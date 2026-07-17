variable "aws_region" {
  description = "AWS region to deploy resources into."
  type        = string
  default     = "us-east-1"
}

variable "cluster_name" {
  description = "Name used as a prefix for all resource names and tags."
  type        = string
  default     = "app-cluster"
}

variable "environment" {
  description = "Deployment environment (e.g. dev, staging, prod)."
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones to use. Should have at least 2 for HA."
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets."
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets (one per AZ)."
  type        = list(string)
  default     = ["10.0.11.0/24", "10.0.12.0/24"]
}

variable "kubernetes_version" {
  description = "Kubernetes version for the EKS cluster."
  type        = string
  default     = "1.30"
}

variable "endpoint_public_access" {
  description = "Expose the EKS API server publicly."
  type        = bool
  default     = true
}

variable "cluster_log_types" {
  description = "Control plane log types to send to CloudWatch."
  type        = list(string)
  default     = ["api", "audit", "authenticator", "controllerManager", "scheduler"]
}

variable "node_instance_types" {
  description = "EC2 instance types for worker nodes."
  type        = list(string)
  default     = ["t3.medium"]
}

variable "node_disk_size" {
  description = "Root EBS volume size (GiB) for worker nodes."
  type        = number
  default     = 20
}

variable "node_capacity_type" {
  description = "ON_DEMAND or SPOT capacity for worker nodes."
  type        = string
  default     = "ON_DEMAND"
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
  description = "Kubernetes labels to attach to all worker nodes."
  type        = map(string)
  default     = {}
}

variable "tags" {
  description = "Extra tags to merge into all resources."
  type        = map(string)
  default     = {}
}
