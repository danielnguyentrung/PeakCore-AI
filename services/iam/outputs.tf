output "lambda_execution_role_arn" {
  description = "AWS ARN of the Lambda execution role"
  value       = aws_iam_role.lambda_execution_role.arn
}

output "lambda_execution_role_name" {
  description = "Name of the Lambda execution role"
  value       = aws_iam_role.lambda_execution_role.name
}

output "fargate_execution_role_arn" {
  description = "AWS ARN of the Fargate execution role"
  value       = aws_iam_role.fargate_execution_role.arn
}

output "eventbridge_role_arn" {
  description = "AWS ARN of the EventBridge execution role"
  value = aws_iam_role.eventbridge_policy.arn
}