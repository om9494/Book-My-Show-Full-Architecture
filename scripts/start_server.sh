#!/bin/bash
# Fetch credentials from Secrets Manager natively via AWS CLI
SECRET_JSON=$(aws secretsmanager get-secret-value --secret-id bookmyshow/app-config --query SecretString --output text --region us-east-1)

export SPRING_DATASOURCE_URL=$(echo $SECRET_JSON | jq -r '."spring.datasource.url"')
export SPRING_DATASOURCE_USERNAME=$(echo $SECRET_JSON | jq -r '."spring.datasource.username"')
export SPRING_DATASOURCE_PASSWORD=$(echo $SECRET_JSON | jq -r '."spring.datasource.password"')
export SPRING_DATA_REDIS_HOST=$(echo $SECRET_JSON | jq -r '."redisHost"')
export SPRING_DATA_REDIS_PORT=6379
export RAZORPAY_KEY_ID=$(echo $SECRET_JSON | jq -r '."razorpay.key.id"')
export RAZORPAY_KEY_SECRET=$(echo $SECRET_JSON | jq -r '."razorpay.key.secret"')

# ✅ Add mail credentials
export MAIL_USERNAME=$(echo $SECRET_JSON | jq -r '."spring.mail.username"')
export MAIL_PASSWORD=$(echo $SECRET_JSON | jq -r '."spring.mail.password"')

export SNS_TOPIC_ARN=$(echo $SECRET_JSON | jq -r '."sns.topic.arn"')
export SQS_QUEUE_NAME=$(echo $SECRET_JSON | jq -r '."sqs.queue.name"')

# Start the application
cd /opt/bookmyshow
nohup java -jar /opt/bookmyshow/book-my-show-0.0.1-SNAPSHOT.jar --server.address=0.0.0.0 > /dev/null 2>&1 &