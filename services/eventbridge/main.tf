data "aws_vpc" "default" {
    default = true 
}

data "aws_subnets" "default" {
    filter {
        name = "vpc-id"
        values = [data.aws_vpc.default.id]
    }
}

resource "aws_security_group" "peakcore_eventbridge_sg" {
    name = "peakcore-eventbridge-sg"
    vpc_id = data.aws_vpc.default.id
    egress {
        from_port = 0 
        to_port = 0 
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_cloudwatch_event_rule" "peakcore_staleness_schedule" {
    name = "peakcore-staleness-schedule"
    schedule_expression = "cron(0 0 * * ? *)"
}

resource "aws_cloudwatch_event_target" "peakcore_fargate_target" {
    rule = aws_cloudwatch_event_rule.peakcore_staleness_schedule.name
    target_id = "peakcore-fargate-target"
    arn = var.peakcore_cluster_arn
    role_arn = var.eventbridge_role_arn



    ecs_target {
        task_definition_arn = var.peakcore_task_definition_arn
        launch_type = "FARGATE"
        network_configuration {
          subnets = data.aws_subnets.default.ids
          security_groups = [aws_security_group.peakcore_eventbridge_sg.id]
          assign_public_ip = true
        }
    }
}