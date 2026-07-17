variable "cluster_name" {
  description = "Name of the EKS cluster."
  type        = string
}

variable "kubernetes_version" {
  description = "Kubernetes version for the EKS cluster."
  type        = string
  default     = "1.30"
}

variable "vpc_id" {
  description = "ID of the VPC where the cluster will be created."
  type        = string
}

variable "public_subnet_ids" {
  description = "Public subnet IDs (used for load balancers)."
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "Private subnet IDs where worker nodes will be launched."
  type        = list(string)
}

variable "endpoint_public_access" {
  description = "Whether the EKS API server endpoint is publicly accessible."
  type        = bool
  default     = true
}

variable "cluster_log_types" {
  description = "List of EKS control plane log types to enable."
  type        = list(string)
  default     = ["api", "audit", "authenticator", "controllerManager", "scheduler"]
}

variable "node_instance_types" {
  description = "EC2 instance types for the managed node group."
  type        = list(string)
  default     = ["t3.medium"]
}

variable "node_disk_size" {
  description = "Root EBS disk size (GiB) for worker nodes."
  type        = number
  default     = 20
}

variable "node_capacity_type" {
  description = "Capacity type for the node group: ON_DEMAND or SPOT."
  type        = string
  default     = "ON_DEMAND"

  validation {
    condition     = contains(["ON_DEMAND", "SPOT"], var.node_capacity_type)
    error_message = "node_capacity_type must be ON_DEMAND or SPOT."
  }
}

variable "node_desired_size" {
  description = "Desired number of worker nodes."
  type        = number
  default     = 2
}

variable "node_min_size" {
  description = "Minimum number of worker nodes."
  type        = number
  default     = 1
}

variable "node_max_size" {
  description = "Maximum number of worker nodes."
  type        = number
  default     = 4
}

variable "node_labels" {
  description = "Kubernetes labels to apply to worker nodes."
  type        = map(string)
  default     = {}
}

variable "tags" {
  description = "Additional tags to apply to all resources."
  type        = map(string)
  default     = {}
}
