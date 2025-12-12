pipeline {
    agent any

    stages {
        stage('Install npm') {
            steps {
                echo 'Installing node and npm...'
                sh 'apt-get update -y'
                sh 'apt-get install nodejs npm -y'
            }
        }

        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install'
            }
        }

        stage('Run tests') {
            steps {
                echo 'Running tests...'
                sh 'npm run test'
            }
        }

        stage('Build & Push Docker Image') {
            when {
                expression { return fileExists('Dockerfile') }
            }
            environment {
                DOCKERHUB_USERNAME = credentials('dockerhub-username')
                DOCKERHUB_TOKEN = credentials('dockerhub-token')
            }
            steps {
                sh """
                docker build -t $DOCKERHUB_USERNAME/ci-sample-app:latest .
                echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
                docker push $DOCKERHUB_USERNAME/ci-sample-app:latest
                """
            }
        }
    }

    post {
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
