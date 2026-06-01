import json
import boto3
import os 
import logging 
from datetime import datetime, timezone 

logger = logging.getLogger()
logger.setLevel(logging.INFO)

ses = boto3.client("ses")

SES_SENDER_EMAIL = os.environ["SES_SENDER_EMAIL"]
APP_URL = os.environ["APP_URL"]

WORKOUT_STALE_MAP = {
    "Beginner": 12,
    "Intermediate": 8, 
    "Pro": 6, 
    "Expert": 6
}

def is_plan_stale(fitness_rank, plan_generated_at):
    weeks_threshold = WORKOUT_STALE_MAP.get(fitness_rank, 8)
    generated_date = datetime.fromisoformat(plan_generated_at)
    weeks_elapsed = (datetime.now(timezone.utc) - generated_date).days / 7

    return weeks_elapsed >= weeks_threshold 


def send_email(email, first_name):
    ses.send_email(
        Source=SES_SENDER_EMAIL, 
        Destination={"ToAddresses": [email]},
        Message={
            "Subject": {"Data": "Time for a New Workout Plan?"},
            "Body":{
                "Text": {"Data": f"Hey {first_name},\n\nIt has been a while since your last workout plan was generated. Your body may be ready for a new challenge!\n\nClick the link below to generate your updated plan:\n{APP_URL}/questionnaire\n\nKeep pushing,\nPeakCore AI"}
            }
        }
    )

    logger.info(f"reminder email sent to {email}")
    return

def lambda_handler(event, context):
    for record in event["Records"]:
        body = json.loads(record["body"])

        user_id = body["user_id"]
        email = body["email"]
        first_name = body["first_name"]
        fitness_rank = body["fitness_rank"]
        plan_generated_at = body["plan_generated_at"]

        if is_plan_stale(fitness_rank, plan_generated_at):
            send_email(email, first_name)
            logger.info(f"Sent reminder email to {user_id}")
        else:
            logger.info(f"Plan not stale yet for {user_id}, skipping")

        

        