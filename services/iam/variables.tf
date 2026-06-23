variable "dynamodb_table_arn" {
    description = "ARN of the PeakCore DynamoDB users table"
    type        = string
}

variable "s3_frontend_arn" {
    description = "ARN of the PeakCore Frontend"
    type        = string 
}

variable "sqs_queue_arn" {
    description = "ARN of the PeakCore SQS Queue"
    type = string
}

variable "sqs_notification_queue_arn" {
    description = "ARN of the notification queue" 
    type = string
}

variable "peakcore_task_definition_arn" {
    description = "ARN of the ECS Task Definition"
    type = string 
}