output "sqs_queue_arn" {
    description = "ARN of the peakcore queue"
    value = aws_sqs_queue.peakcore_queue.arn
}

output "sqs_queue_url" {
    description = "URL of the PeakCore queue"
    value = aws_sqs_queue.peakcore_queue.url
}

output "sqs_notification_queue_arn" {
    description = "ARN of the notification queue" 
    value = aws_sqs_queue.peakcore_notification_queue.arn
}

output "sqs_notification_queue_url" {
    description = "URL of the PeakCore notification queue" 
    value = aws_sqs_queue.peakcore_notification_queue.url 
}


