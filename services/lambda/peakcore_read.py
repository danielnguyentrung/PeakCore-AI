import json
import boto3
import os 
import logging 

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource("dynamodb")

DYNAMODB_TABLE_NAME = os.environ["DYNAMODB_TABLE_NAME"]
table = dynamodb.Table(DYNAMODB_TABLE_NAME)

def lambda_handler(event, context): 
    claims = event["requestContext"]["authorizer"]["claims"]
    user_id = claims["sub"]

    response = table.get_item(Key={"user_id": user_id})
    item = response.get("Item")

    if not item:
        return{"statusCode": 404, "body": json.dumps({"error": "No workout plan found, please generate a plan first"})}
    
    logger.info(f"Retrieved workout plan for {user_id}")

    return {"statusCode": 200, "body": json.dumps({
        "workout_plan": item["workout_plan"]
    })}