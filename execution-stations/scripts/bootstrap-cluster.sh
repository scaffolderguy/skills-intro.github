#!/bin/bash
set -euo pipefail

# Cluster Bootstrap Script for Personal Execution Stations
# Sets up the foundational infrastructure required for execution stations

ENV=${1:-dev}
CLUSTER_NAME="${ENV}-cluster"
INSTALL_VAULT=${INSTALL_VAULT:-false}
INSTALL_EXTERNAL_SECRETS=${INSTALL_EXTERNAL_SECRETS:-true}
INSTALL_MONITORING=${INSTALL_MONITORING:-true}
ADMIN_EMAIL=${ADMIN_EMAIL:-admin@example.com}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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
    echo -e "\n🚀 ${BLUE}$1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log_step "Checking prerequisites..."
    
    local missing_tools=()
    
    if ! command -v kubectl &> /dev/null; then
        missing_tools+=("kubectl")
    fi
    
    if ! command -v helm &> /dev/null && [[ "$INSTALL_MONITORING" == "true" || "$INSTALL_VAULT" == "true" || "$INSTALL_EXTERNAL_SECRETS" == "true" ]]; then
        missing_tools+=("helm")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        log_error "Missing required tools: ${missing_tools[*]}"
        exit 1
    fi
    
    # Check cluster connectivity
    if ! kubectl cluster-info &>/dev/null; then
        log_error "Cannot connect to Kubernetes cluster. Please check your kubectl configuration."
        exit 1
    fi
    
    log_success "All prerequisites are available"
}

# Install cert-manager
install_cert_manager() {
    log_step "Installing cert-manager..."
    
    # Check if cert-manager is already installed
    if kubectl get namespace cert-manager &>/dev/null; then
        log_warning "cert-manager namespace already exists, skipping installation"
        return
    fi
    
    # Install cert-manager
    kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
    
    # Wait for cert-manager to be ready
    log_info "Waiting for cert-manager to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/cert-manager -n cert-manager
    kubectl wait --for=condition=available --timeout=300s deployment/cert-manager-cainjector -n cert-manager
    kubectl wait --for=condition=available --timeout=300s deployment/cert-manager-webhook -n cert-manager
    
    log_success "cert-manager installed successfully"
}

# Install ingress-nginx
install_ingress_nginx() {
    log_step "Installing ingress-nginx..."
    
    # Check if ingress-nginx is already installed
    if kubectl get namespace ingress-nginx &>/dev/null; then
        log_warning "ingress-nginx namespace already exists, skipping installation"
        return
    fi
    
    # Install ingress-nginx
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
    
    # Wait for ingress-nginx to be ready
    log_info "Waiting for ingress-nginx to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/ingress-nginx-controller -n ingress-nginx
    
    log_success "ingress-nginx installed successfully"
}

# Install metrics-server
install_metrics_server() {
    log_step "Installing metrics-server..."
    
    # Check if metrics-server is already installed
    if kubectl get deployment metrics-server -n kube-system &>/dev/null; then
        log_warning "metrics-server already exists, skipping installation"
        return
    fi
    
    # Install metrics-server
    kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
    
    # Wait for metrics-server to be ready
    log_info "Waiting for metrics-server to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/metrics-server -n kube-system
    
    log_success "metrics-server installed successfully"
}

# Create cluster issuer for Let's Encrypt
create_cluster_issuer() {
    log_step "Creating cluster issuer..."
    
    # Check if cluster issuer already exists
    if kubectl get clusterissuer letsencrypt-prod &>/dev/null; then
        log_warning "letsencrypt-prod cluster issuer already exists, skipping creation"
        return
    fi
    
    cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
  labels:
    app.kubernetes.io/name: letsencrypt-prod
    app.kubernetes.io/component: cluster-issuer
    environment: ${ENV}
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: ${ADMIN_EMAIL}
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
    
    log_success "Cluster issuer created successfully"
}

# Install HashiCorp Vault
install_vault() {
    if [[ "$INSTALL_VAULT" != "true" ]]; then
        return
    fi
    
    log_step "Installing Vault..."
    
    # Check if Vault is already installed
    if kubectl get namespace vault &>/dev/null; then
        log_warning "Vault namespace already exists, skipping installation"
        return
    fi
    
    # Add Helm repo and install Vault
    helm repo add hashicorp https://helm.releases.hashicorp.com
    helm repo update
    
    helm install vault hashicorp/vault \
        --namespace vault \
        --create-namespace \
        --set "server.dev.enabled=true" \
        --set "injector.enabled=true" \
        --set "server.resources.requests.memory=256Mi" \
        --set "server.resources.requests.cpu=250m" \
        --set "server.resources.limits.memory=1Gi" \
        --set "server.resources.limits.cpu=1000m"
    
    # Wait for Vault to be ready
    log_info "Waiting for Vault to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/vault-agent-injector -n vault
    
    log_success "Vault installed successfully"
    log_info "Note: Vault is running in dev mode. Configure properly for production!"
}

# Install External Secrets Operator
install_external_secrets() {
    if [[ "$INSTALL_EXTERNAL_SECRETS" != "true" ]]; then
        return
    fi
    
    log_step "Installing External Secrets Operator..."
    
    # Check if External Secrets is already installed
    if kubectl get namespace external-secrets-system &>/dev/null; then
        log_warning "External Secrets namespace already exists, skipping installation"
        return
    fi
    
    # Add Helm repo and install External Secrets
    helm repo add external-secrets https://charts.external-secrets.io
    helm repo update
    
    helm install external-secrets external-secrets/external-secrets \
        --namespace external-secrets-system \
        --create-namespace \
        --set installCRDs=true \
        --set resources.requests.memory=128Mi \
        --set resources.requests.cpu=100m \
        --set resources.limits.memory=512Mi \
        --set resources.limits.cpu=500m
    
    # Wait for External Secrets to be ready
    log_info "Waiting for External Secrets to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/external-secrets -n external-secrets-system
    
    log_success "External Secrets Operator installed successfully"
}

# Install monitoring stack (Prometheus & Grafana)
install_monitoring() {
    if [[ "$INSTALL_MONITORING" != "true" ]]; then
        return
    fi
    
    log_step "Installing monitoring stack..."
    
    # Check if monitoring is already installed
    if kubectl get namespace monitoring &>/dev/null; then
        log_warning "Monitoring namespace already exists, skipping installation"
        return
    fi
    
    # Add Helm repo and install kube-prometheus-stack
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo update
    
    # Create monitoring namespace first
    kubectl create namespace monitoring
    
    helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
        --namespace monitoring \
        --set grafana.adminPassword=admin123 \
        --set prometheus.prometheusSpec.retention=30d \
        --set prometheus.prometheusSpec.resources.requests.memory=2Gi \
        --set prometheus.prometheusSpec.resources.requests.cpu=1000m \
        --set prometheus.prometheusSpec.resources.limits.memory=4Gi \
        --set prometheus.prometheusSpec.resources.limits.cpu=2000m \
        --set grafana.resources.requests.memory=128Mi \
        --set grafana.resources.requests.cpu=100m \
        --set grafana.resources.limits.memory=512Mi \
        --set grafana.resources.limits.cpu=500m
    
    # Wait for Grafana to be ready
    log_info "Waiting for monitoring stack to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/kube-prometheus-stack-grafana -n monitoring
    
    log_success "Monitoring stack installed successfully"
    log_info "Grafana admin password: admin123"
    log_info "Access Grafana: kubectl port-forward -n monitoring svc/kube-prometheus-stack-grafana 3000:80"
}

# Create execution stations namespace and basic resources
setup_execution_stations_namespace() {
    log_step "Setting up execution stations namespace..."
    
    # Create namespace if it doesn't exist
    local namespace="execution-stations-${ENV}"
    if ! kubectl get namespace "${namespace}" &>/dev/null; then
        kubectl create namespace "${namespace}"
        kubectl label namespace "${namespace}" \
            app.kubernetes.io/name=execution-stations \
            app.kubernetes.io/component=platform \
            environment="${ENV}"
    fi
    
    # Create basic RBAC for execution stations
    cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ServiceAccount
metadata:
  name: execution-stations-bootstrap
  namespace: ${namespace}
  labels:
    app.kubernetes.io/name: execution-stations
    app.kubernetes.io/component: bootstrap
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: ${namespace}
  name: execution-stations-bootstrap
rules:
- apiGroups: [""]
  resources: ["pods", "services", "configmaps", "secrets", "persistentvolumeclaims"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
- apiGroups: ["apps"]
  resources: ["deployments", "replicasets"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
- apiGroups: ["networking.k8s.io"]
  resources: ["ingresses", "networkpolicies"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: execution-stations-bootstrap
  namespace: ${namespace}
subjects:
- kind: ServiceAccount
  name: execution-stations-bootstrap
  namespace: ${namespace}
roleRef:
  kind: Role
  name: execution-stations-bootstrap
  apiGroup: rbac.authorization.k8s.io
EOF
    
    log_success "Execution stations namespace configured"
}

# Create sample SecretStore for External Secrets (if enabled)
create_secret_store() {
    if [[ "$INSTALL_EXTERNAL_SECRETS" != "true" ]]; then
        return
    fi
    
    log_step "Creating sample SecretStore configuration..."
    
    local namespace="execution-stations-${ENV}"
    
    cat <<EOF | kubectl apply -f -
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: vault-backend
  namespace: ${namespace}
  labels:
    app.kubernetes.io/name: execution-stations
    app.kubernetes.io/component: secret-store
spec:
  provider:
    vault:
      server: "http://vault.vault.svc.cluster.local:8200"
      path: "kv"
      version: "v2"
      auth:
        kubernetes:
          mountPath: "kubernetes"
          role: "execution-stations-${ENV}"
          serviceAccountRef:
            name: "execution-stations-bootstrap"
EOF
    
    log_info "SecretStore created for Vault integration"
    log_warning "Remember to configure Vault authentication and policies!"
}

# Generate bootstrap summary
generate_summary() {
    log_step "Bootstrap Summary"
    
    echo ""
    echo "=== Personal Execution Stations Bootstrap Complete ==="
    echo "Environment: ${ENV}"
    echo "Cluster: ${CLUSTER_NAME}"
    echo "Timestamp: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
    echo ""
    
    echo "Installed Components:"
    echo "  ✅ cert-manager (TLS certificate management)"
    echo "  ✅ ingress-nginx (Ingress controller)"
    echo "  ✅ metrics-server (Resource metrics)"
    
    if [[ "$INSTALL_VAULT" == "true" ]]; then
        echo "  ✅ HashiCorp Vault (Secret management)"
    fi
    
    if [[ "$INSTALL_EXTERNAL_SECRETS" == "true" ]]; then
        echo "  ✅ External Secrets Operator (Secret synchronization)"
    fi
    
    if [[ "$INSTALL_MONITORING" == "true" ]]; then
        echo "  ✅ Prometheus & Grafana (Monitoring and observability)"
    fi
    
    echo "  ✅ Execution Stations namespace and RBAC"
    echo ""
    
    echo "Next Steps:"
    echo "  1. Configure DNS records for your domain"
    echo "  2. Set up secret management (Vault policies or external secret stores)"
    echo "  3. Deploy Terraform configuration:"
    echo "     cd execution-stations/terraform"
    echo "     terraform init"
    echo "     terraform plan -var environment=${ENV}"
    echo "     terraform apply -var environment=${ENV}"
    echo "  4. Generate user profiles:"
    echo "     ./scripts/generate-profile.py --user-id test-user --cognitive-style visual_systemic"
    echo "  5. Validate deployment:"
    echo "     ./scripts/validate-deployment.sh ${ENV}"
    echo ""
    
    if [[ "$INSTALL_MONITORING" == "true" ]]; then
        echo "Monitoring Access:"
        echo "  Grafana: kubectl port-forward -n monitoring svc/kube-prometheus-stack-grafana 3000:80"
        echo "  Prometheus: kubectl port-forward -n monitoring svc/kube-prometheus-stack-prometheus 9090:9090"
        echo "  Default Grafana credentials: admin / admin123"
        echo ""
    fi
    
    echo "Useful Commands:"
    echo "  Check cluster status: kubectl get nodes"
    echo "  List all components: kubectl get all -A"
    echo "  View logs: kubectl logs -n <namespace> <pod-name>"
    echo ""
}

# Main execution
main() {
    echo "🚀 Personal Execution Stations Cluster Bootstrap"
    echo "Environment: ${ENV}"
    echo "Cluster: ${CLUSTER_NAME}"
    echo ""
    echo "Configuration:"
    echo "  Install Vault: ${INSTALL_VAULT}"
    echo "  Install External Secrets: ${INSTALL_EXTERNAL_SECRETS}"
    echo "  Install Monitoring: ${INSTALL_MONITORING}"
    echo "  Admin Email: ${ADMIN_EMAIL}"
    echo ""
    
    # Run bootstrap steps
    check_prerequisites
    install_cert_manager
    install_ingress_nginx
    install_metrics_server
    create_cluster_issuer
    install_vault
    install_external_secrets
    install_monitoring
    setup_execution_stations_namespace
    create_secret_store
    
    generate_summary
    
    log_success "✅ Cluster bootstrap completed successfully for ${ENV}"
}

# Handle script arguments and help
case "${1:-}" in
    -h|--help)
        echo "Usage: $0 [ENVIRONMENT] [OPTIONS]"
        echo ""
        echo "Arguments:"
        echo "  ENVIRONMENT              Environment name (dev, staging, prod) - default: dev"
        echo ""
        echo "Environment Variables:"
        echo "  INSTALL_VAULT           Install HashiCorp Vault - default: false"
        echo "  INSTALL_EXTERNAL_SECRETS Install External Secrets Operator - default: true"
        echo "  INSTALL_MONITORING      Install Prometheus & Grafana - default: true"
        echo "  ADMIN_EMAIL            Admin email for Let's Encrypt - default: admin@example.com"
        echo ""
        echo "Examples:"
        echo "  $0 dev"
        echo "  INSTALL_VAULT=true ADMIN_EMAIL=ops@company.com $0 prod"
        echo ""
        echo "This script bootstraps a Kubernetes cluster with the foundational"
        echo "infrastructure required for Personal Execution Stations."
        exit 0
        ;;
    *)
        main
        ;;
esac