terraform {
  required_version = ">= 1.0"
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Variables
variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "cluster_name" {
  description = "Kubernetes cluster name"
  type        = string
  default     = "execution-stations-cluster"
}

variable "domain" {
  description = "Base domain for execution stations"
  type        = string
  default     = "stations.example.com"
}

variable "max_stations_per_cluster" {
  description = "Maximum number of execution stations per cluster"
  type        = number
  default     = 50
}

variable "default_cpu_limit" {
  description = "Default CPU limit for execution stations"
  type        = string
  default     = "2000m"
}

variable "default_memory_limit" {
  description = "Default memory limit for execution stations"
  type        = string
  default     = "4Gi"
}

variable "enable_network_policies" {
  description = "Enable Kubernetes Network Policies"
  type        = bool
  default     = true
}

variable "enable_pod_security" {
  description = "Enable Pod Security Standards"
  type        = bool
  default     = true
}

variable "vault_addr" {
  description = "Vault server address"
  type        = string
  default     = ""
}

# Local values
locals {
  namespace = "execution-stations-${var.environment}"
  common_labels = {
    "app.kubernetes.io/name"       = "execution-stations"
    "app.kubernetes.io/instance"   = var.environment
    "app.kubernetes.io/component"  = "platform"
    "app.kubernetes.io/part-of"    = "personal-execution-stations"
    "app.kubernetes.io/managed-by" = "terraform"
    "environment"                  = var.environment
  }
}

# Data sources
data "kubernetes_namespace" "execution_stations" {
  metadata {
    name = local.namespace
  }
  depends_on = [kubernetes_namespace.execution_stations]
}

# Kubernetes namespace
resource "kubernetes_namespace" "execution_stations" {
  metadata {
    name = local.namespace
    labels = merge(local.common_labels, {
      "pod-security.kubernetes.io/enforce" = var.enable_pod_security ? "restricted" : "baseline"
      "pod-security.kubernetes.io/audit"   = "restricted"
      "pod-security.kubernetes.io/warn"    = "restricted"
    })
    annotations = {
      "scheduler.alpha.kubernetes.io/node-selector" = "execution-stations=true"
    }
  }
}

# Resource quota
resource "kubernetes_resource_quota" "execution_stations" {
  metadata {
    name      = "execution-stations-quota"
    namespace = kubernetes_namespace.execution_stations.metadata[0].name
    labels    = local.common_labels
  }

  spec {
    hard = {
      "requests.cpu"               = "${var.max_stations_per_cluster * 1000}m"
      "requests.memory"            = "${var.max_stations_per_cluster * 2}Gi"
      "limits.cpu"                 = "${var.max_stations_per_cluster * 2000}m"
      "limits.memory"              = "${var.max_stations_per_cluster * 4}Gi"
      "persistentvolumeclaims"     = var.max_stations_per_cluster
      "pods"                       = var.max_stations_per_cluster * 2
      "services"                   = var.max_stations_per_cluster
      "secrets"                    = var.max_stations_per_cluster * 2
      "configmaps"                 = var.max_stations_per_cluster * 2
    }
  }
}

# Limit ranges
resource "kubernetes_limit_range" "execution_stations" {
  metadata {
    name      = "execution-stations-limits"
    namespace = kubernetes_namespace.execution_stations.metadata[0].name
    labels    = local.common_labels
  }

  spec {
    limit {
      type = "Container"
      default = {
        "cpu"    = var.default_cpu_limit
        "memory" = var.default_memory_limit
      }
      default_request = {
        "cpu"    = "500m"
        "memory" = "1Gi"
      }
      max = {
        "cpu"    = "4000m"
        "memory" = "16Gi"
      }
      min = {
        "cpu"    = "100m"
        "memory" = "128Mi"
      }
    }
  }
}

# Network policies
resource "kubernetes_network_policy" "execution_stations_isolation" {
  count = var.enable_network_policies ? 1 : 0

  metadata {
    name      = "execution-stations-isolation"
    namespace = kubernetes_namespace.execution_stations.metadata[0].name
    labels    = local.common_labels
  }

  spec {
    pod_selector {
      match_labels = {
        "app.kubernetes.io/component" = "execution-station"
      }
    }

    policy_types = ["Ingress", "Egress"]

    # Allow ingress from ingress controller
    ingress {
      from {
        namespace_selector {
          match_labels = {
            "name" = "ingress-nginx"
          }
        }
      }
    }

    # Allow egress to internet and cluster services
    egress {
      to {
        namespace_selector {}
      }
    }

    egress {
      to {}
      ports {
        port     = "53"
        protocol = "UDP"
      }
    }

    egress {
      to {}
      ports {
        port     = "80"
        protocol = "TCP"
      }
    }

    egress {
      to {}
      ports {
        port     = "443"
        protocol = "TCP"
      }
    }
  }
}

# Service account for execution stations
resource "kubernetes_service_account" "execution_stations" {
  metadata {
    name      = "execution-stations-sa"
    namespace = kubernetes_namespace.execution_stations.metadata[0].name
    labels    = local.common_labels
    annotations = var.vault_addr != "" ? {
      "vault.hashicorp.com/agent-inject"               = "true"
      "vault.hashicorp.com/role"                       = "execution-stations-${var.environment}"
      "vault.hashicorp.com/agent-inject-secret-config" = "kv/data/execution-stations/${var.environment}"
    } : {}
  }

  automount_service_account_token = true
}

# RBAC - Role
resource "kubernetes_role" "execution_stations" {
  metadata {
    name      = "execution-stations-role"
    namespace = kubernetes_namespace.execution_stations.metadata[0].name
    labels    = local.common_labels
  }

  rule {
    api_groups = [""]
    resources  = ["pods", "services", "configmaps", "secrets", "persistentvolumeclaims"]
    verbs      = ["get", "list", "watch", "create", "update", "patch", "delete"]
  }

  rule {
    api_groups = ["apps"]
    resources  = ["deployments", "replicasets"]
    verbs      = ["get", "list", "watch", "create", "update", "patch", "delete"]
  }

  rule {
    api_groups = ["networking.k8s.io"]
    resources  = ["ingresses"]
    verbs      = ["get", "list", "watch", "create", "update", "patch", "delete"]
  }
}

# RBAC - Role binding
resource "kubernetes_role_binding" "execution_stations" {
  metadata {
    name      = "execution-stations-binding"
    namespace = kubernetes_namespace.execution_stations.metadata[0].name
    labels    = local.common_labels
  }

  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind      = "Role"
    name      = kubernetes_role.execution_stations.metadata[0].name
  }

  subject {
    kind      = "ServiceAccount"
    name      = kubernetes_service_account.execution_stations.metadata[0].name
    namespace = kubernetes_namespace.execution_stations.metadata[0].name
  }
}

# Outputs
output "namespace" {
  description = "Execution stations namespace"
  value       = kubernetes_namespace.execution_stations.metadata[0].name
}

output "service_account" {
  description = "Service account for execution stations"
  value       = kubernetes_service_account.execution_stations.metadata[0].name
}

output "resource_quota" {
  description = "Resource quota details"
  value = {
    name = kubernetes_resource_quota.execution_stations.metadata[0].name
    hard = kubernetes_resource_quota.execution_stations.spec[0].hard
  }
}