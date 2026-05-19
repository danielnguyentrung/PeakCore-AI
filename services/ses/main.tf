resource "aws_ses_email_identity" "peakcore_outbound" {
    email = var.email_sender
}