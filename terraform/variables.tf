variable "aws_region" {
  description = "AWS region to deploy resources into."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name used as a prefix for all resource names and tags."
  type        = string
  default     = "ms-app"
}

variable "environment" {
  description = "Deployment environment (e.g. dev, staging, prod)."
  type        = string
  default     = "dev"
}

# ── VPC ──────────────────────────────────────────────────────────────────────

variable "vpc_cidr" {
  description = "CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones to use."
  type        = list(string)
  default     = ["us-east-1a"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets."
  type        = list(string)
  default     = ["10.0.1.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets."
  type        = list(string)
  default     = ["10.0.11.0/24"]
}

# ── EC2 ──────────────────────────────────────────────────────────────────────

variable "instance_type" {
  description = "EC2 instance type."
  type        = string
  default     = "t3.micro"
}

variable "ami_id" {
  description = "Custom AMI ID. Leave empty to use the latest Amazon Linux 2023."
  type        = string
  default     = ""
}

variable "root_volume_size" {
  description = "Root EBS volume size in GiB."
  type        = number
  default     = 20
}

variable "public_key" {
  description = "SSH public key material for the key pair. Leave empty to skip."
  type        = string
  default     = ""
}

variable "ssh_allowed_cidrs" {
  description = "CIDR blocks allowed to SSH into the instance."
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "user_data" {
  description = "User data script to run on instance launch."
  type        = string
  default     = null
}

# ── Shared ───────────────────────────────────────────────────────────────────

variable "tags" {
  description = "Extra tags to merge into all resources."
  type        = map(string)
  default     = {}
}
