variable "lambda_execution_role_arn" {
  description = "ARN of the Lambda execution role"
  type        = string
}

variable "sqs_queue_arn" {
  description = "ARN of the peakcore queue"
  type        = string 
}

variable "sqs_queue_url" {
  description = "URL of the PeakCore queue"
  type        = string 
}

variable "sqs_notification_queue_arn" {
  description = "ARN of the notification queue"
  type = string 
}

variable "dynamodb_table_name" {
  description = "Name of the PeakCore DynamoDB table"
  type        = string
}

variable "bedrock_model_id" {
  description = "Bedrock model ID for Claude"
  type        = string
}

variable "ses_sender_email" {
  description = "Verified SES sender email address"
  type        = string
}

variable "app_url" {
  description = "Frontend app URL for email links"
  type        = string 
}

