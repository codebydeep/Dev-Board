variable "name" {
  description = "Name prefix for all EC2 resources."
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC to launch the instance into."
  type        = string
}

variable "subnet_id" {
  description = "Subnet ID where the instance will be launched."
  type        = string
}

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

variable "associate_public_ip" {
  description = "Whether to associate a public IP address with the instance."
  type        = bool
  default     = true
}

variable "root_volume_size" {
  description = "Size of the root EBS volume in GiB."
  type        = number
  default     = 20
}

variable "public_key" {
  description = "SSH public key material. Leave empty to skip key pair creation."
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

variable "tags" {
  description = "Tags to apply to all resources."
  type        = map(string)
  default     = {}
}
