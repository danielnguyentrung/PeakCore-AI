output "dynamodb_table_arn" {
    description = "ARN of the PeakCore DynamoDB table"
    value = aws_dynamodb_table.peakcore_users_table.arn 
}