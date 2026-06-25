resource "aws_cloudfront_origin_access_control" "peakcore_oac" {
  name                              = "peakcore-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "peakcore_distribution" {
  enabled             = true
  default_root_object = "index.html"

  origin {
    domain_name              = var.peakcore_bucket_regional_domain_name
    origin_id                = "peakcore-s3-origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.peakcore_oac.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "peakcore-s3-origin"
    viewer_protocol_policy = "redirect-to-https"


    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

resource "aws_s3_bucket_policy" "peakcore_frontend_trust_policy" {
  bucket = var.s3_frontend_bucket_name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "cloudfront.amazonaws.com"
      }
      Action   = "s3:GetObject"
      Resource = "${var.s3_frontend_arn}/*"
      Condition = {
        StringEquals = {
          "AWS:SourceArn" = aws_cloudfront_distribution.peakcore_distribution.arn
        }
      }
    }]
  })
}