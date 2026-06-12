output "peakcore_cluster_arn" {
    description = "ARN of the Fargate Cluster"
    value = aws_ecs_cluster.peakcore_cluster.arn
}

output "peakcore_task_definition_arn" {
    description = "ARN of the ECS Task Definition"
    value = aws_ecs_task_definition.peakcore_task.arn
}