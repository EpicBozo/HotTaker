#Base image
FROM python:3.8

# Set the working directory in the container
WORKDIR /app

#install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc\
    python3-dev\
    nodejs\
    npm

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install any dependencies
RUN pip install -r requirements.txt

# Copy the content of the local src directory to the working directory
COPY . .

#Expose port
EXPOSE 8000