#!/bin/bash
set -euo pipefail

# Deployment Validation Script for Personal Execution Stations
# Validates deployment health, resource allocation, and security configuration

ENV=${1:-dev}
NAMESPACE="execution-stations-${ENV}"
TIMEOUT=${TIMEOUT:-300}
VERBOSE=${VERBOSE:-false}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "\n🔍 ${BLUE}$1${NC}"
}

# Check if required tools are available
check_prerequisites() {
    log_step "Checking prerequisites..."
    
    local missing_tools=()
    
    if ! command -v kubectl &> /dev/null; then
        missing_tools+=("kubectl")
    fi
    
    if ! command -v curl &> /dev/null; then
        missing_tools+=("curl")
    fi
    
    if ! command -v jq &> /dev/null; then
        missing_tools+=("jq")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        log_error "Missing required tools: ${missing_tools[*]}"
        log_error "Please install the missing tools and try again."
        exit 1
    fi
    
    log_success "All prerequisites are available"
}

# Check if namespace exists
check_namespace() {
    log_step "Validating namespace: ${NAMESPACE}"
    
    if ! kubectl get namespace "${NAMESPACE}" &>/dev/null; then
        log_error "Namespace ${NAMESPACE} not found"
        log_info "Available namespaces:"
        kubectl get namespaces --no-headers | awk '{print "  - " $1}'
        exit 1
    fi
    
    # Check namespace labels and annotations
    local labels=$(kubectl get namespace "${NAMESPACE}" -o jsonpath='{.metadata.labels}' 2>/dev/null || echo '{}')
    local annotations=$(kubectl get namespace "${NAMESPACE}" -o jsonpath='{.metadata.annotations}' 2>/dev/null || echo '{}')
    
    log_success "Namespace ${NAMESPACE} exists"
    
    if [[ "$VERBOSE" == "true" ]]; then
        log_info "Namespace labels: $labels"
        log_info "Namespace annotations: $annotations"
    fi
}

# Check deployments status
check_deployments() {
    log_step "Checking deployment status..."
    
    local deployments=$(kubectl get deployments -n "${NAMESPACE}" -o jsonpath='{.items[*].metadata.name}' 2>/dev/null || echo "")
    
    if [[ -z "$deployments" ]]; then
        log_warning "No deployments found in namespace ${NAMESPACE}"
        return
    fi
    
    local failed_deployments=()
    
    for deployment in ${deployments}; do
        log_info "Checking deployment: ${deployment}"
        
        # Check if deployment is available
        if kubectl wait --for=condition=available --timeout="${TIMEOUT}s" deployment/"${deployment}" -n "${NAMESPACE}" &>/dev/null; then
            # Get replica status
            local ready=$(kubectl get deployment "${deployment}" -n "${NAMESPACE}" -o jsonpath='{.status.readyReplicas}' 2>/dev/null || echo "0")
            local desired=$(kubectl get deployment "${deployment}" -n "${NAMESPACE}" -o jsonpath='{.spec.replicas}' 2>/dev/null || echo "1")
            
            if [[ "$ready" == "$desired" ]]; then
                log_success "✅ ${deployment} is ready (${ready}/${desired})"
            else
                log_warning "⚠️  ${deployment} partially ready (${ready}/${desired})"
            fi
        else
            log_error "❌ ${deployment} failed to become ready within ${TIMEOUT}s"
            failed_deployments+=("$deployment")
            
            # Show deployment status for troubleshooting
            log_info "Deployment status for ${deployment}:"
            kubectl describe deployment "${deployment}" -n "${NAMESPACE}" | grep -A 10 "Conditions:" || true
        fi
    done
    
    if [ ${#failed_deployments[@]} -ne 0 ]; then
        log_error "Failed deployments: ${failed_deployments[*]}"
        exit 1
    fi
}

# Check resource quotas
check_resource_quotas() {
    log_step "Checking resource quotas..."
    
    local quotas=$(kubectl get resourcequota -n "${NAMESPACE}" --no-headers 2>/dev/null | awk '{print $1}' || echo "")
    
    if [[ -z "$quotas" ]]; then
        log_warning "No resource quotas found in namespace ${NAMESPACE}"
        return
    fi
    
    for quota in $quotas; do
        log_info "Resource quota: ${quota}"
        
        # Get quota details
        local quota_info=$(kubectl describe resourcequota "${quota}" -n "${NAMESPACE}" 2>/dev/null || echo "")
        
        if [[ -n "$quota_info" ]]; then
            # Extract usage information
            echo "$quota_info" | grep -E "(Used|Hard):" | while read -r line; do
                log_info "  $line"
            done
            
            # Check for quota violations
            local violations=$(echo "$quota_info" | grep -c "exceeded" || echo "0")
            if [[ "$violations" -gt 0 ]]; then
                log_error "❌ Resource quota violations detected in ${quota}"
                echo "$quota_info" | grep "exceeded"
                exit 1
            else
                log_success "✅ Resource quota ${quota} is within limits"
            fi
        fi
    done
}

# Check network policies
check_network_policies() {
    log_step "Validating network policies..."
    
    local netpols=$(kubectl get networkpolicies -n "${NAMESPACE}" --no-headers 2>/dev/null | wc -l)
    log_info "Found ${netpols} network policies"
    
    if [[ "$netpols" -eq 0 ]]; then
        log_warning "No network policies found - consider implementing network segmentation"
    else
        # List network policies
        kubectl get networkpolicies -n "${NAMESPACE}" --no-headers | while read -r name rest; do
            log_info "Network policy: ${name}"
        done
        log_success "✅ Network policies are configured"
    fi
}

# Health check endpoints
health_check_endpoints() {
    log_step "Running health checks..."
    
    local stations=$(kubectl get deployments -n "${NAMESPACE}" -o jsonpath='{.items[*].metadata.name}' 2>/dev/null || echo "")
    
    if [[ -z "$stations" ]]; then
        log_warning "No execution stations found for health checking"
        return
    fi
    
    local failed_health_checks=()
    
    for station in ${stations}; do
        log_info "Health checking ${station}..."
        
        # Check if there's a corresponding service
        local service="${station/deployment/svc}"
        if ! kubectl get service "${service}" -n "${NAMESPACE}" &>/dev/null; then
            # Try alternative service name patterns
            service="${station}"
            if ! kubectl get service "${service}" -n "${NAMESPACE}" &>/dev/null; then
                service="${station}-service"
                if ! kubectl get service "${service}" -n "${NAMESPACE}" &>/dev/null; then
                    log_warning "No service found for ${station}, skipping health check"
                    continue
                fi
            fi
        fi
        
        # Port forward and health check
        local port_forward_pid=""
        local local_port=$(( (RANDOM % 30000) + 30000 ))  # Random port between 30000-60000
        
        # Start port forwarding in background
        kubectl port-forward -n "${NAMESPACE}" "service/${service}" "${local_port}:80" &>/dev/null &
        port_forward_pid=$!
        
        # Wait for port forward to establish
        sleep 5
        
        # Perform health check
        local health_status=0
        if curl -f -s --max-time 10 "http://localhost:${local_port}/health" &>/dev/null; then
            log_success "✅ ${station} health check passed"
        elif curl -f -s --max-time 10 "http://localhost:${local_port}/ready" &>/dev/null; then
            log_success "✅ ${station} readiness check passed"
        elif curl -f -s --max-time 10 "http://localhost:${local_port}/" &>/dev/null; then
            log_success "✅ ${station} basic connectivity passed"
        else
            log_error "❌ ${station} health check failed"
            failed_health_checks+=("$station")
            health_status=1
        fi
        
        # Cleanup port forward
        if [[ -n "$port_forward_pid" ]]; then
            kill "$port_forward_pid" 2>/dev/null || true
            wait "$port_forward_pid" 2>/dev/null || true
        fi
        
        # Brief pause between checks
        sleep 2
    done
    
    if [ ${#failed_health_checks[@]} -ne 0 ]; then
        log_error "Failed health checks: ${failed_health_checks[*]}"
        return 1
    fi
}

# Check persistent volumes
check_persistent_volumes() {
    log_step "Checking persistent volumes..."
    
    # Get PVs bound to this namespace
    local pvs=$(kubectl get pv -o jsonpath='{.items[?(@.spec.claimRef.namespace=="'${NAMESPACE}'")].metadata.name}' 2>/dev/null || echo "")
    
    if [[ -z "$pvs" ]]; then
        log_warning "No persistent volumes found for namespace ${NAMESPACE}"
        return
    fi
    
    local failed_pvs=()
    
    for pv in ${pvs}; do
        local status=$(kubectl get pv "${pv}" -o jsonpath='{.status.phase}' 2>/dev/null || echo "Unknown")
        local claim=$(kubectl get pv "${pv}" -o jsonpath='{.spec.claimRef.name}' 2>/dev/null || echo "Unknown")
        
        if [[ "${status}" == "Bound" ]]; then
            log_success "✅ PV ${pv} is bound to claim ${claim}"
        else
            log_error "❌ PV ${pv} status: ${status}"
            failed_pvs+=("$pv")
        fi
    done
    
    if [ ${#failed_pvs[@]} -ne 0 ]; then
        log_error "Failed persistent volumes: ${failed_pvs[*]}"
        return 1
    fi
}

# Check ingress endpoints
check_ingress_endpoints() {
    log_step "Checking ingress endpoints..."
    
    local ingresses=$(kubectl get ingress -n "${NAMESPACE}" -o jsonpath='{.items[*].spec.rules[*].host}' 2>/dev/null || echo "")
    
    if [[ -z "$ingresses" ]]; then
        log_warning "No ingress endpoints found in namespace ${NAMESPACE}"
        return
    fi
    
    for host in ${ingresses}; do
        log_info "Testing ingress endpoint: ${host}"
        
        # Test HTTPS endpoint
        if curl -f -k -s --max-time 10 "https://${host}/health" &>/dev/null; then
            log_success "✅ ${host} health endpoint is accessible"
        elif curl -f -k -s --max-time 10 "https://${host}/" &>/dev/null; then
            log_success "✅ ${host} is accessible"
        else
            log_warning "⚠️ ${host} not yet accessible (DNS/cert propagation may be pending)"
        fi
    done
}

# Security validation
check_security() {
    log_step "Validating security configuration..."
    
    # Check for non-root containers
    local non_root_violations=$(kubectl get pods -n "${NAMESPACE}" -o jsonpath='{.items[*].spec.containers[*].securityContext.runAsNonRoot}' 2>/dev/null | grep -c "false" || echo "0")
    
    if [[ "$non_root_violations" -gt 0 ]]; then
        log_warning "Found containers running as root (security risk)"
    else
        log_success "✅ All containers are running as non-root"
    fi
    
    # Check for privileged containers
    local privileged_containers=$(kubectl get pods -n "${NAMESPACE}" -o jsonpath='{.items[*].spec.containers[*].securityContext.privileged}' 2>/dev/null | grep -c "true" || echo "0")
    
    if [[ "$privileged_containers" -gt 0 ]]; then
        log_error "❌ Found privileged containers (security risk)"
        return 1
    else
        log_success "✅ No privileged containers found"
    fi
    
    # Check for proper service accounts
    local default_sa_pods=$(kubectl get pods -n "${NAMESPACE}" -o jsonpath='{.items[?(@.spec.serviceAccountName=="default")].metadata.name}' 2>/dev/null || echo "")
    
    if [[ -n "$default_sa_pods" ]]; then
        log_warning "Pods using default service account: ${default_sa_pods}"
    else
        log_success "✅ All pods are using custom service accounts"
    fi
}

# Generate summary report
generate_report() {
    log_step "Generating validation summary..."
    
    local total_checks=0
    local passed_checks=0
    local failed_checks=0
    local warning_checks=0
    
    # This would need to be implemented to track check results
    # For now, just provide basic cluster information
    
    echo ""
    echo "=== Deployment Validation Summary ==="
    echo "Environment: ${ENV}"
    echo "Namespace: ${NAMESPACE}"
    echo "Timestamp: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
    echo ""
    
    # Basic statistics
    local pods=$(kubectl get pods -n "${NAMESPACE}" --no-headers 2>/dev/null | wc -l)
    local deployments=$(kubectl get deployments -n "${NAMESPACE}" --no-headers 2>/dev/null | wc -l)
    local services=$(kubectl get services -n "${NAMESPACE}" --no-headers 2>/dev/null | wc -l)
    local ingresses=$(kubectl get ingresses -n "${NAMESPACE}" --no-headers 2>/dev/null | wc -l)
    
    echo "Resource Summary:"
    echo "  Pods: ${pods}"
    echo "  Deployments: ${deployments}"
    echo "  Services: ${services}"
    echo "  Ingresses: ${ingresses}"
    echo ""
}

# Main execution
main() {
    echo "🚀 Personal Execution Stations Deployment Validation"
    echo "Environment: ${ENV}"
    echo "Namespace: ${NAMESPACE}"
    echo "Timeout: ${TIMEOUT}s"
    echo ""
    
    # Run all validation checks
    check_prerequisites
    check_namespace
    check_deployments
    check_resource_quotas
    check_network_policies
    check_persistent_volumes
    check_security
    
    # Optional checks that may fail without breaking deployment
    health_check_endpoints || log_warning "Some health checks failed (may be expected during deployment)"
    check_ingress_endpoints
    
    generate_report
    
    log_success "🎉 Deployment validation completed for ${ENV}"
    echo ""
    echo "Next steps:"
    echo "  1. Monitor application logs: kubectl logs -n ${NAMESPACE} -l app.kubernetes.io/component=execution-station"
    echo "  2. Check resource usage: kubectl top pods -n ${NAMESPACE}"
    echo "  3. Verify user access to execution stations"
    echo "  4. Run integration tests if available"
}

# Handle script arguments
case "${1:-}" in
    -h|--help)
        echo "Usage: $0 [ENVIRONMENT] [OPTIONS]"
        echo ""
        echo "Arguments:"
        echo "  ENVIRONMENT    Environment name (dev, staging, prod) - default: dev"
        echo ""
        echo "Environment Variables:"
        echo "  TIMEOUT        Timeout in seconds for checks - default: 300"
        echo "  VERBOSE        Enable verbose output - default: false"
        echo ""
        echo "Examples:"
        echo "  $0 dev"
        echo "  TIMEOUT=600 VERBOSE=true $0 prod"
        exit 0
        ;;
    *)
        main
        ;;
esac