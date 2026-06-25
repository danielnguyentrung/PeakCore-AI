output "s3_frontend_arn" {
  description = "ARN of the PeakCore S3 Bucket for the Frontend"
  value       = aws_s3_bucket.peakcore_frontend.arn
}

output "s3_frontend_bucket_name" {
  description = "The S3 bucket name for the frontend"
  value       = aws_s3_bucket.peakcore_frontend.id
}

output "peakcore_bucket_regional_domain_name" {
  description = "Regional domain name of the Peakcore Frontend Bucket"
  value       = aws_s3_bucket.peakcore_frontend.bucket_regional_domain_name
}