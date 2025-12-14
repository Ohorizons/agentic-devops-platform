# =============================================================================
# THREE HORIZONS PLATFORM - GLOBAL VARIABLES
# =============================================================================

# -----------------------------------------------------------------------------
# COMMON VARIABLES
# -----------------------------------------------------------------------------

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  validation {
    condition     = can(regex("^[a-z0-9-]{3,24}$", var.project_name))
    error_message = "Project name must be 3-24 lowercase alphanumeric characters or hyphens."
  }
}

# NOTE: environment, location, and tags are defined in main.tf

# -----------------------------------------------------------------------------
# SIZING PROFILE
# -----------------------------------------------------------------------------

variable "sizing_profile" {
  description = "Sizing profile (small, medium, large, xlarge)"
  type        = string
  default     = "medium"
  validation {
    condition     = contains(["small", "medium", "large", "xlarge"], var.sizing_profile)
    error_message = "Sizing profile must be small, medium, large, or xlarge."
  }
}

# -----------------------------------------------------------------------------
# NETWORKING
# -----------------------------------------------------------------------------

variable "vnet_address_space" {
  description = "Address space for the virtual network"
  type        = list(string)
  default     = ["10.0.0.0/16"]
}

variable "enable_private_endpoints" {
  description = "Enable private endpoints for PaaS services"
  type        = bool
  default     = true
}

# -----------------------------------------------------------------------------
# KUBERNETES (AKS/ARO)
# -----------------------------------------------------------------------------

variable "kubernetes_platform" {
  description = "Kubernetes platform (aks or aro)"
  type        = string
  default     = "aks"
  validation {
    condition     = contains(["aks", "aro"], var.kubernetes_platform)
    error_message = "Kubernetes platform must be aks or aro."
  }
}

variable "kubernetes_version" {
  description = "Kubernetes version"
  type        = string
  default     = "1.28"
}

variable "enable_workload_identity" {
  description = "Enable Workload Identity for AKS"
  type        = bool
  default     = true
}

# -----------------------------------------------------------------------------
# GITHUB INTEGRATION
# -----------------------------------------------------------------------------

# NOTE: github_org is defined in main.tf

variable "github_repo" {
  description = "Main GitHub repository name"
  type        = string
  default     = "platform-gitops"
}

variable "enable_github_runners" {
  description = "Deploy self-hosted GitHub runners"
  type        = bool
  default     = true
}

# -----------------------------------------------------------------------------
# SECURITY & COMPLIANCE
# -----------------------------------------------------------------------------

variable "enable_defender" {
  description = "Enable Microsoft Defender for Cloud"
  type        = bool
  default     = true
}

variable "enable_purview" {
  description = "Enable Microsoft Purview"
  type        = bool
  default     = false
}

variable "defender_plans" {
  description = "Defender plans to enable"
  type        = list(string)
  default     = ["VirtualMachines", "AppServices", "SqlServers", "StorageAccounts", "Containers", "KeyVaults"]
}

# -----------------------------------------------------------------------------
# PLATFORM COMPONENTS
# -----------------------------------------------------------------------------

variable "enable_argocd" {
  description = "Deploy ArgoCD for GitOps"
  type        = bool
  default     = true
}

variable "enable_rhdh" {
  description = "Deploy Red Hat Developer Hub"
  type        = bool
  default     = true
}

variable "enable_observability" {
  description = "Deploy observability stack (Prometheus, Grafana)"
  type        = bool
  default     = true
}

# NOTE: enable_ai_foundry is defined in main.tf

# -----------------------------------------------------------------------------
# DATABASE
# -----------------------------------------------------------------------------

variable "database_type" {
  description = "Database type (postgresql, mysql, cosmosdb)"
  type        = string
  default     = "postgresql"
}

variable "database_sku" {
  description = "Database SKU tier"
  type        = string
  default     = "GP_Standard_D2s_v3"
}

# -----------------------------------------------------------------------------
# IDENTITY & AUTH
# -----------------------------------------------------------------------------

variable "entra_tenant_id" {
  description = "Microsoft Entra ID tenant ID"
  type        = string
  default     = ""
}

variable "entra_admin_group_id" {
  description = "Entra ID group ID for cluster admins"
  type        = string
  default     = ""
}
