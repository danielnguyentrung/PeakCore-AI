variable "aws_region" {
  description = "The AWS region to deploy resources in."
  type        = string
  default     = "us-east-1"
}

variable "email_sender" {
  description = "Generic Email Address for PeakCore"
  type        = string
}

variable "peakcore_model" {
  description = "AI Model for Bedrock"
  type = string 
  default = "PLACEHOLDER"
}

variable "app_url" {
  description = "Frontend app URL for email links"
  type = string 
  default = "https://placeholder.cloudfront.net"
}