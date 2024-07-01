# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

RUN apt-get update && apt-get install -y cron gcc

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Setup cron job
# Create a crontab file
RUN echo "*/15 * * * * python /app/pncp.py >> /var/log/cron.log 2>&1" > /etc/cron.d/pncp-cron

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/pncp-cron

# Apply cron job
RUN crontab /etc/cron.d/pncp-cron

# Create the log file to be able to run tail
RUN touch /var/log/cron.log

# Run the command on container startup
CMD cron && tail -f /var/log/cron.log
