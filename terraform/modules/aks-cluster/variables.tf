# =============================================================================
# THREE HORIZONS ACCELERATOR - AKS CLUSTER MODULE VARIABLES
# =============================================================================

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
}

variable "customer_name" {
  description = "Customer name for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "kubernetes_version" {
  description = "Kubernetes version"
  type        = string
  default     = "1.29"
}

variable "sku_tier" {
  description = "AKS SKU tier (Free, Standard, Premium)"
  type        = string
  default     = "Standard"
}

variable "system_node_pool" {
  description = "System node pool configuration"
  type = object({
    name       = string
    vm_size    = string
    node_count = number
    zones      = list(string)
  })
  default = {
    name       = "system"
    vm_size    = "Standard_D4s_v5"
    node_count = 3
    zones      = ["1", "2", "3"]
  }
}

variable "user_node_pools" {
  description = "User node pools configuration"
  type = list(object({
    name      = string
    vm_size   = string
    min_count = number
    max_count = number
    zones     = list(string)
    labels    = map(string)
    taints    = list(string)
  }))
  default = []
}

variable "vnet_subnet_id" {
  description = "Subnet ID for AKS nodes"
  type        = string
}

variable "pod_subnet_id" {
  description = "Subnet ID for pods (Azure CNI Overlay)"
  type        = string
  default     = null
}

variable "acr_id" {
  description = "Azure Container Registry ID for pull permissions"
  type        = string
  default     = null
}

variable "key_vault_id" {
  description = "Key Vault ID for secrets integration"
  type        = string
  default     = null
}

variable "log_analytics_id" {
  description = "Log Analytics Workspace ID for Container Insights"
  type        = string
  default     = null
}

variable "addons" {
  description = "AKS add-ons configuration"
  type = object({
    azure_policy           = bool
    azure_keyvault_secrets = bool
    oms_agent              = bool
  })
  default = {
    azure_policy           = true
    azure_keyvault_secrets = true
    oms_agent              = true
  }
}

variable "workload_identity" {
  description = "Enable workload identity"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
