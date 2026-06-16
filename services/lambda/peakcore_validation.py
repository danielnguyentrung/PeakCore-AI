import json
import boto3
import os 
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

sqs = boto3.client("sqs")
SQS_QUEUE_URL = os.environ["SQS_QUEUE_URL"]

input_fields = {
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
    "environment": str
}

multiselect_fields = ["goals"]

def input_validation(body, input_fields):

    for key, value in input_fields.items():
        if key not in body or body[key] == "" or body[key] is None:
            return {"statusCode": 400, "body": json.dumps({"error": f"{key} is required"})}
        
        if value == int and isinstance(body[key], bool):
            return {"statusCode": 400, "body": json.dumps({"error": f"{key} must be of an integer"})}
        
        if not isinstance(body[key], value):
            return {"statusCode": 400, "body": json.dumps({"error": f"{key} must be of type {value.__name__}"})}
    
    return 


def multiselect_validation(body, multiselect_fields):

    for field in multiselect_fields:

        if field not in body:
            return {"statusCode": 400, "body": json.dumps({"error": f"{field} is required"})}
        
        if not isinstance(body[field], list):
            return {"statusCode": 400, "body": json.dumps({"error": f"{field} must be of type array"})}
        
        if len(body[field]) == 0:
            return {"statusCode": 400, "body": json.dumps({"error": f"{field} cannot be empty"})}
    
    return

def conditional_validation(body):

    if body["event_training"] == True and ("event_name" not in body or body["event_name"] == "" or body["event_name"] is None):
        return {"statusCode": 400, "body": json.dumps({"error": "event_name cannot be empty"})}
    
    if body["environment"] == "Home gym":
        if "home_gym_equipment" not in body: 
            return{"statusCode": 400, "body": json.dumps({"error": "home_gym_equipment is required"})}
        if not isinstance(body["home_gym_equipment"], list):
            return {"statusCode": 400, "body": json.dumps({"error": "home_gym_equipment must be a list"})}
        if len(body["home_gym_equipment"]) == 0:
            return {"statusCode": 400, "body": json.dumps ({"error": "home_gym_equipment cannot be empty"})}
   
    return None  

def lambda_handler(event, context):
    body = json.loads(event.get("body") or "{}")

    input_error = input_validation(body, input_fields)
    if input_error: 
        return input_error
    
    multiselect_error = multiselect_validation(body, multiselect_fields)
    if multiselect_error:
        return multiselect_error
    
    conditional_error = conditional_validation(body)
    if conditional_error:
        return conditional_error
    
    claims = event["requestContext"]["authorizer"]["claims"]
    user_email = claims["email"]
    user_id = claims["sub"]

    message = {
        "user_id": user_id,
        "email": user_email,
        "profile": body
    }
    try: 
        sqs.send_message(
            QueueUrl = SQS_QUEUE_URL,
            MessageBody=json.dumps(message)
        )
    
    except Exception as e:
        logger.error(f"Failed to send message to SQS: {e}")
        return {"statusCode": 500, "body": json.dumps({"error": "Internal server error, please try again later"})}

    return {"statusCode": 202, "body": json.dumps({"message": "Your workout plan is being generated, you will recieve an email shortly!"})}

