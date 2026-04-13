#!/bin/bash
PID=$(pgrep -f 'java -jar /opt/bookmyshow')
if [ -z "$PID" ]; then
    echo "Application is not running."
else
    kill -15 $PID
    sleep 10
fi