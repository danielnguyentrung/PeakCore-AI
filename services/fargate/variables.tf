variable "dynamodb_table_name" {
    description = "Name of the PeakCore DynamoDB user table"
    type        = string
}

variable "sqs_queue_url" {
    description = "URL of the SQS Queue"
    type        = string
}