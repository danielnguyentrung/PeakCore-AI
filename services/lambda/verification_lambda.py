import json
import boto3
import os 
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

sqs = boto3.client("sqs")
SQS_QUEUE_URL = os.environ["SQS_QUEUE_URL"]

INPUT_FIELDS = {
    "first_name": str,
    "last_name": str,
    "gender": str, 
    "age":int, 
    "weight": int, 
    "height": int,
    "fitness_experience": str,
    "fitness_rank": str, 
    "event_training": bool,
    "event_name": str,
    "event_customization": bool,
    "work_hours": int,
    "workout_duration": int, 
    "job_difficulty": str, 
    "injuries": str,
    "environment_preference": str
}

MULTISELECT_FIELDS = [
    "goals", "home_gym_equipment"
]

def input_validation(body, input_fields):

    for field in input_fields:
        if field not in body or body[field] == "" or body[field] is None:
            return {"statusCode": 400, "body": json.dumps({"error": f"{field} is required"})}
    
    return None

    



def lambda_handler(event, context):