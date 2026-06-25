# PeakCore AI 

An AI-powered fitness application that generates personalized workout plans built on AWS leveraging Amazon S3, CloudFront, API Gateway, AWS Cognito, SQS, Lambda, Bedrock, SES, and Eventbridge. 

## Tech Stack

**Frontend**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**Infrastructure**

![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)
![AWS](https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)

**AWS Services**

![AWS Lambda](https://img.shields.io/badge/AWS_Lambda-FF9900?style=for-the-badge&logo=awslambda&logoColor=white)
![Amazon S3](https://img.shields.io/badge/Amazon_S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)
![Amazon DynamoDB](https://img.shields.io/badge/Amazon_DynamoDB-4053D6?style=for-the-badge&logo=amazondynamodb&logoColor=white)
![Amazon SQS](https://img.shields.io/badge/Amazon_SQS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Amazon SES](https://img.shields.io/badge/Amazon_SES-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Amazon Cognito](https://img.shields.io/badge/Amazon_Cognito-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![API Gateway](https://img.shields.io/badge/API_Gateway-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![CloudFront](https://img.shields.io/badge/CloudFront-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Amazon Bedrock](https://img.shields.io/badge/Amazon_Bedrock-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Amazon ECS](https://img.shields.io/badge/Amazon_ECS-FF9900?style=for-the-badge&logo=amazonecs&logoColor=white)
![EventBridge](https://img.shields.io/badge/EventBridge-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)

## Objective 

Workout plans are take a bit of time to create, research, and customize to our environment and schedules. With PeakCore AI, users can generate a personalized workout plan tailored to their schedule and environment within minutes.

## Solution Overview 

Users create an account on the PeakCore AI website and fill out a questionnaire covering their measurements, schedule, environment, and fitness goals. Once submitted, the data is sent to the backend where a validation Lambda function reviews the input. If valid, it is passed to the core Lambda function which uses AI to generate a personalized workout plan. The user then receives an email with a link to view their plan on the website.

### Workflow 

1. User creates an account on the PeakCoreAI website. 
2. Once the account is created, the user is directed to the home page and will selects "Get Started Free" to begin the questionnaire. 
3. Once the questionnaire is completed the user selects submit and the data is then sent from the frontend to the API gatewate to the validation lambda function. 
4. The Validation Lambda function will check to see if all fields on the questionnaire have the information provided. It will also set a cooldown timer if it's the first submission incase the user submits multiple submissions. If the user send multiple requests to create the workout within the cooldown period they will be denied creation of the workout plan until the timer concludes. 
5. Once the data has been validated, the validation lambda will send the data to the SQS Queue which will then be sent over the the Core Lambda Function. 
6. 

### Architecture Diagram

## Lessons Learned 