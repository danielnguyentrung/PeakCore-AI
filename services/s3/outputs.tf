output "s3_frontend_arn" {
    description = "ARN of the PeakCore S3 Bucket for the Frontend"
    value = aws_s3_bucket.peakcore_frontend.arn
}

output "s3_workout_plans_arn" {
    description = "ARN of the PeakCore S3 bucket for the Workout Plans"
    value = aws_s3_bucket.peakcore_workout_plans.arn
}

