variable "dynamodb_table_name" {
    description = "Name of the PeakCore DynamoDB user table"
    type        = string
}

variable "sqs_queue_url" {
    description = "URL of the SQS Queue"
    type        = string
}

variable "fargate_execution_role_arn" {
    description = "ARN of the Fargate Execution Role"
    type        = string
}