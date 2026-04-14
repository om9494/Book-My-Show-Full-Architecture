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

# Start the application
cd /opt/bookmyshow
nohup java -jar *.jar > /opt/bookmyshow/app.log 2>&1 &