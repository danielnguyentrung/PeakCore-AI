variable "peakcore_bucket_regional_domain_name" {
    description = "Regional domain name of the Peakcore Frontend Bucket"
    type = string 
}

variable "s3_frontend_bucket_name" {
    description = "The S3 bucket name for the frontend"
    type = string
}

variable "s3_frontend_arn" {
    description = "ARN of the PeakCore S3 Bucket for the Frontend"
    type = string 
}