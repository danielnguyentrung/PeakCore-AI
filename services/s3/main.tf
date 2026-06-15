resource "aws_s3_bucket" "peakcore_frontend" {
    bucket = "peakcore-frontend"
}

resource "aws_s3_bucket_website_configuration" "peakcore_frontend_config" {
    bucket = aws_s3_bucket.peakcore_frontend.id

    index_document {
        suffix = "index.html"
    }

    error_document {
        key = "index.html"
    }
}

resource "aws_s3_bucket_public_access_block" "peakcore_frontend_access" {
    bucket = aws_s3_bucket.peakcore_frontend.id
    block_public_acls = true
    block_public_policy = true
    ignore_public_acls = true   
    restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "peakcore_frontend_versioning" {
    bucket = aws_s3_bucket.peakcore_frontend.id
    versioning_configuration {
      status = "Enabled"
    }
}