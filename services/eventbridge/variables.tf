variable "peakcore_cluster_arn" {
  description = "ARN of the Fargate Cluster"
  type        = string
}

variable "peakcore_task_definition_arn" {
  description = "ARN of the ECS Task Definition"
  type        = string
}

variable "eventbridge_role_arn" {
  description = "AWS ARN of the EventBridge execution role"
  type        = string
}