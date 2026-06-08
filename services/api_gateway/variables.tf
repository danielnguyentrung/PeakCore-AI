variable "peakcore_validation_arn" {
    description = "Name of the PeakCore Validation Lambda Function"
    type = string 
}

variable "peakcore_read_name" {
    description = "Name of the PeakCore Read Lambda Function"
    type = string 
}

variable "user_pool_id" {
    description = "ID of the Cognito User Pool"
    type = string
}