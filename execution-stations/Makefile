# Personal Execution Stations Makefile
# Provides convenient commands for managing the execution stations infrastructure

# Default environment
ENV ?= dev
USER_ID ?= test-user
COGNITIVE_STYLE ?= visual_systemic
DOMAIN ?= stations.example.com

# Paths
TERRAFORM_DIR = terraform
SCRIPTS_DIR = scripts
K8S_DIR = kubernetes
PROFILES_DIR = profiles

# Colors
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

.PHONY: help bootstrap plan apply destroy health-check validate scale-station backup-user-data list-profiles generate-profile clean

## Default target
help: ## Show this help message
	@echo "Personal Execution Stations Management"
	@echo "======================================"
	@echo ""
	@echo "Usage: make <target> [ENV=environment] [USER_ID=user] [options]"
	@echo ""
	@echo "Available targets:"
	@awk 'BEGIN {FS = ":.*##"; printf ""} /^[a-zA-Z_-]+:.*?##/ { printf "  ${GREEN}%-18s${NC} %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
	@echo ""
	@echo "Environment Variables:"
	@echo "  ENV              Environment (dev, staging, prod) - default: dev"
	@echo "  USER_ID          User identifier - default: test-user"
	@echo "  COGNITIVE_STYLE  Cognitive style profile - default: visual_systemic"
	@echo "  DOMAIN           Base domain - default: stations.example.com"
	@echo ""
	@echo "Examples:"
	@echo "  make bootstrap ENV=dev"
	@echo "  make generate-profile USER_ID=alice COGNITIVE_STYLE=visual_systemic"
	@echo "  make apply ENV=prod"
	@echo "  make health-check ENV=staging"

## Cluster Bootstrap
bootstrap: ## Bootstrap the Kubernetes cluster with foundational infrastructure
	@echo "${BLUE}Bootstrapping cluster for environment: ${ENV}${NC}"
	@chmod +x $(SCRIPTS_DIR)/bootstrap-cluster.sh
	@$(SCRIPTS_DIR)/bootstrap-cluster.sh $(ENV)

## Terraform Operations
init: ## Initialize Terraform
	@echo "${BLUE}Initializing Terraform for environment: ${ENV}${NC}"
	@cd $(TERRAFORM_DIR) && terraform init

plan: init ## Plan Terraform changes
	@echo "${BLUE}Planning Terraform changes for environment: ${ENV}${NC}"
	@cd $(TERRAFORM_DIR) && terraform plan \
		-var environment=$(ENV) \
		-var domain=$(DOMAIN) \
		-out=tfplan-$(ENV)

apply: init ## Apply Terraform changes
	@echo "${BLUE}Applying Terraform changes for environment: ${ENV}${NC}"
	@cd $(TERRAFORM_DIR) && terraform apply \
		-var environment=$(ENV) \
		-var domain=$(DOMAIN) \
		-auto-approve

destroy: init ## Destroy Terraform resources (USE WITH CAUTION)
	@echo "${RED}WARNING: This will destroy all resources for environment: ${ENV}${NC}"
	@echo "${RED}Press Ctrl+C to abort or Enter to continue...${NC}"
	@read confirm
	@cd $(TERRAFORM_DIR) && terraform destroy \
		-var environment=$(ENV) \
		-var domain=$(DOMAIN) \
		-auto-approve

## Profile Management
list-profiles: ## List available cognitive styles
	@echo "${BLUE}Available cognitive styles:${NC}"
	@chmod +x $(SCRIPTS_DIR)/generate-profile.py
	@python3 $(SCRIPTS_DIR)/generate-profile.py --list-styles

generate-profile: ## Generate user profile configuration
	@echo "${BLUE}Generating profile for user: ${USER_ID} with style: ${COGNITIVE_STYLE}${NC}"
	@mkdir -p $(PROFILES_DIR)
	@chmod +x $(SCRIPTS_DIR)/generate-profile.py
	@python3 $(SCRIPTS_DIR)/generate-profile.py \
		--user-id $(USER_ID) \
		--cognitive-style $(COGNITIVE_STYLE) \
		--domain $(DOMAIN) \
		--output-format yaml \
		--output-dir $(PROFILES_DIR)/$(USER_ID) > $(PROFILES_DIR)/$(USER_ID)-profile.yaml
	@echo "${GREEN}Profile generated: $(PROFILES_DIR)/$(USER_ID)-profile.yaml${NC}"

deploy-profile: generate-profile ## Deploy user profile to Kubernetes
	@echo "${BLUE}Deploying profile for user: ${USER_ID}${NC}"
	@if [ -d "$(PROFILES_DIR)/$(USER_ID)" ]; then \
		kubectl apply -f $(PROFILES_DIR)/$(USER_ID)/; \
		echo "${GREEN}Profile deployed successfully${NC}"; \
	else \
		echo "${RED}Profile directory not found. Run 'make generate-profile' first.${NC}"; \
		exit 1; \
	fi

## Health and Validation
health-check: ## Run health checks on the deployment
	@echo "${BLUE}Running health checks for environment: ${ENV}${NC}"
	@chmod +x $(SCRIPTS_DIR)/validate-deployment.sh
	@$(SCRIPTS_DIR)/validate-deployment.sh $(ENV)

validate: health-check ## Alias for health-check

## Station Management
scale-station: ## Scale execution station for a user
	@echo "${BLUE}Scaling station for user: ${USER_ID}${NC}"
	@kubectl scale deployment execution-station-$(USER_ID) \
		--namespace execution-stations-$(ENV) \
		--replicas=$(REPLICAS)
	@echo "${GREEN}Station scaled to $(REPLICAS) replicas${NC}"

restart-station: ## Restart execution station for a user
	@echo "${BLUE}Restarting station for user: ${USER_ID}${NC}"
	@kubectl rollout restart deployment/execution-station-$(USER_ID) \
		--namespace execution-stations-$(ENV)
	@kubectl rollout status deployment/execution-station-$(USER_ID) \
		--namespace execution-stations-$(ENV)
	@echo "${GREEN}Station restarted successfully${NC}"

logs-station: ## Show logs for a user's execution station
	@echo "${BLUE}Showing logs for user: ${USER_ID}${NC}"
	@kubectl logs -f deployment/execution-station-$(USER_ID) \
		--namespace execution-stations-$(ENV) \
		--tail=100

describe-station: ## Describe execution station resources for a user
	@echo "${BLUE}Describing station resources for user: ${USER_ID}${NC}"
	@kubectl describe deployment execution-station-$(USER_ID) \
		--namespace execution-stations-$(ENV)
	@kubectl describe service execution-station-$(USER_ID) \
		--namespace execution-stations-$(ENV)
	@kubectl describe ingress execution-station-$(USER_ID) \
		--namespace execution-stations-$(ENV)

## Backup and Maintenance
backup-user-data: ## Backup user workspace data
	@echo "${BLUE}Backing up data for user: ${USER_ID}${NC}"
	@mkdir -p backups/$(USER_ID)
	@kubectl exec -n execution-stations-$(ENV) \
		deployment/execution-station-$(USER_ID) -- \
		tar czf - /workspace | base64 > backups/$(USER_ID)/workspace-$(shell date +%Y%m%d-%H%M%S).tar.gz.b64
	@echo "${GREEN}Backup completed: backups/$(USER_ID)/${NC}"

restore-user-data: ## Restore user workspace data (requires BACKUP_FILE)
	@if [ -z "$(BACKUP_FILE)" ]; then \
		echo "${RED}Please specify BACKUP_FILE=path/to/backup.tar.gz.b64${NC}"; \
		exit 1; \
	fi
	@echo "${BLUE}Restoring data for user: ${USER_ID} from $(BACKUP_FILE)${NC}"
	@base64 -d $(BACKUP_FILE) | kubectl exec -i -n execution-stations-$(ENV) \
		deployment/execution-station-$(USER_ID) -- tar xzf - -C /
	@echo "${GREEN}Data restored successfully${NC}"

update-profile: ## Update user profile configuration
	@echo "${BLUE}Updating profile for user: ${USER_ID}${NC}"
	@python3 $(SCRIPTS_DIR)/generate-profile.py \
		--user-id $(USER_ID) \
		--cognitive-style $(COGNITIVE_STYLE) \
		--domain $(DOMAIN) \
		--cpu $(CPU) \
		--memory $(MEMORY) \
		--output-format yaml > $(PROFILES_DIR)/$(USER_ID)-profile-updated.yaml
	@kubectl patch configmap user-config-$(USER_ID) \
		--namespace execution-stations-$(ENV) \
		--patch-file $(PROFILES_DIR)/$(USER_ID)-profile-updated.yaml
	@echo "${GREEN}Profile updated successfully${NC}"

## Monitoring and Observability
port-forward-grafana: ## Port forward to Grafana dashboard
	@echo "${BLUE}Port forwarding to Grafana on http://localhost:3000${NC}"
	@echo "${YELLOW}Default credentials: admin / admin123${NC}"
	@kubectl port-forward -n monitoring svc/kube-prometheus-stack-grafana 3000:80

port-forward-prometheus: ## Port forward to Prometheus
	@echo "${BLUE}Port forwarding to Prometheus on http://localhost:9090${NC}"
	@kubectl port-forward -n monitoring svc/kube-prometheus-stack-prometheus 9090:9090

port-forward-station: ## Port forward to a user's execution station
	@echo "${BLUE}Port forwarding to station for user: ${USER_ID} on http://localhost:8080${NC}"
	@kubectl port-forward -n execution-stations-$(ENV) \
		service/execution-station-$(USER_ID) 8080:80

## Development and Testing
dev-setup: bootstrap apply ## Full development environment setup
	@echo "${GREEN}Development environment ready!${NC}"
	@make generate-profile USER_ID=dev-user COGNITIVE_STYLE=experimental_creative
	@make deploy-profile USER_ID=dev-user

test-deployment: ## Run deployment tests
	@echo "${BLUE}Running deployment tests...${NC}"
	@make health-check ENV=$(ENV)
	@echo "${GREEN}All tests passed!${NC}"

## Cleanup
clean: ## Clean up generated files and temporary resources
	@echo "${BLUE}Cleaning up generated files...${NC}"
	@rm -rf $(PROFILES_DIR)/*
	@rm -rf backups/*
	@rm -f $(TERRAFORM_DIR)/tfplan-*
	@rm -f $(TERRAFORM_DIR)/.terraform/terraform.tfstate*
	@echo "${GREEN}Cleanup completed${NC}"

clean-all: clean destroy ## Full cleanup including infrastructure
	@echo "${YELLOW}Full cleanup completed${NC}"

## Status and Information
status: ## Show status of all components
	@echo "${BLUE}=== Personal Execution Stations Status ===${NC}"
	@echo ""
	@echo "${BLUE}Environment:${NC} $(ENV)"
	@echo "${BLUE}Namespace:${NC} execution-stations-$(ENV)"
	@echo ""
	@echo "${BLUE}Pods:${NC}"
	@kubectl get pods -n execution-stations-$(ENV) || echo "Namespace not found"
	@echo ""
	@echo "${BLUE}Services:${NC}"
	@kubectl get services -n execution-stations-$(ENV) || echo "No services found"
	@echo ""
	@echo "${BLUE}Ingresses:${NC}"
	@kubectl get ingresses -n execution-stations-$(ENV) || echo "No ingresses found"
	@echo ""
	@echo "${BLUE}Resource Usage:${NC}"
	@kubectl top pods -n execution-stations-$(ENV) 2>/dev/null || echo "Metrics not available"

list-users: ## List all deployed user stations
	@echo "${BLUE}Deployed execution stations:${NC}"
	@kubectl get deployments -n execution-stations-$(ENV) \
		-l app.kubernetes.io/component=execution-station \
		-o jsonpath='{.items[*].metadata.labels.user-id}' | tr ' ' '\n' | sort

## Documentation
docs: ## Generate documentation
	@echo "${BLUE}Generating documentation...${NC}"
	@mkdir -p docs
	@echo "# Personal Execution Stations Documentation" > docs/README.md
	@echo "" >> docs/README.md
	@echo "Generated on: $$(date)" >> docs/README.md
	@echo "" >> docs/README.md
	@echo "## Available Commands" >> docs/README.md
	@make help | grep -A 100 "Available targets:" >> docs/README.md
	@echo "${GREEN}Documentation generated: docs/README.md${NC}"

## Prerequisites check
check-prereqs: ## Check if all required tools are installed
	@echo "${BLUE}Checking prerequisites...${NC}"
	@command -v kubectl >/dev/null 2>&1 || { echo "${RED}kubectl is required but not installed${NC}"; exit 1; }
	@command -v terraform >/dev/null 2>&1 || { echo "${RED}terraform is required but not installed${NC}"; exit 1; }
	@command -v helm >/dev/null 2>&1 || { echo "${RED}helm is required but not installed${NC}"; exit 1; }
	@command -v python3 >/dev/null 2>&1 || { echo "${RED}python3 is required but not installed${NC}"; exit 1; }
	@echo "${GREEN}All prerequisites are installed${NC}"

# Make scripts executable on first run
$(SCRIPTS_DIR)/%.sh: $(SCRIPTS_DIR)/%.sh
	@chmod +x $@

$(SCRIPTS_DIR)/%.py: $(SCRIPTS_DIR)/%.py
	@chmod +x $@