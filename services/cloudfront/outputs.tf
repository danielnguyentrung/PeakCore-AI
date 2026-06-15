output "cloudfront_url" {
    description = "The URL of the Cloudfront distribution"
    value = aws_cloudfront_distribution.peakcore_distribution.domain_name
}