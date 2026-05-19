variable "dynamodb_table_arn" {
    description = "ARN of the PeakCore DynamoDB users table"
    type        = string
}

variable "s3_frontend_arn" {
    description = "ARN of the PeakCore Frontend"
    type        = string 
}

variable "s3_workout_plans_arn" {
    description = "ARN of the PeakCore Workout Plans"
    type        = string 
}

variable "sqs_queue_arn" {
    description = "ARN of the PeakCore SQS Queue"
    type = string
}