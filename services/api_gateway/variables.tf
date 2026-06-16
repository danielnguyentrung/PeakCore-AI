variable "peakcore_validation_arn" {
    description = "ARN of the PeakCore Validation Lambda Function"
    type = string 
}

variable "peakcore_read_arn" {
    description = "ARN of the PeakCore Read Lambda Function"
    type = string 
}

variable "user_pool_id" {
    description = "ID of the Cognito User Pool"
    type = string
}

variable "user_pool_client_id" {
    description = "ID of the Cognito User Pool Client"
    type = string
}