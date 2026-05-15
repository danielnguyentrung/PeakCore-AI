output "peakcore_core_arn" {
  description = "ARN of the Peakcore Core Lambda function"
  value       = aws_lambda_function.peakcore_core.arn
}

output "peakcore_core_name" {
  description = "Name of the Peakcore Core Lambda function"
  value       = aws_lambda_function.peakcore_core.function_name
}