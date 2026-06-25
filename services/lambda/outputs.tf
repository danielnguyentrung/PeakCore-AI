output "peakcore_core_arn" {
  description = "ARN of the Peakcore Core Lambda function"
  value       = aws_lambda_function.peakcore_core.arn
}

output "peakcore_core_name" {
  description = "Name of the Peakcore Core Lambda function"
  value       = aws_lambda_function.peakcore_core.function_name
}

output "peakcore_validation_arn" {
  description = "ARN of the PeakCore Validation"
  value       = aws_lambda_function.peakcore_validation.arn
}

output "peakcore_validation_name" {
  description = "Name of the PeakCore Validation Lambda function"
  value       = aws_lambda_function.peakcore_validation.function_name
}

output "peakcore_read_arn" {
  description = "Name of the PeakCore Read Lambda Function"
  value       = aws_lambda_function.peakcore_read.arn
}

output "peakcore_read_name" {
  description = "Name of the PeakCore Read Lambda Function"
  value       = aws_lambda_function.peakcore_read.function_name
}

