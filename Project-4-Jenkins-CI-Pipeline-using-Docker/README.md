# Project-4: Jenkins CI Pipeline in Docker with GitHub Webhooks and Docker Hub Image Publishing

![GitHub](https://img.shields.io/badge/Source-GitHub-black?logo=github)
![Jenkins](https://img.shields.io/badge/CI-Jenkins-red?logo=jenkins)
![Docker](https://img.shields.io/badge/Container-Docker-blue?logo=docker)
![NodeJS](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![DockerHub](https://img.shields.io/badge/Registry-DockerHub-blue?logo=docker)

A complete CI pipeline using Jenkins running inside Docker.
The pipeline automatically builds a Node.js application, creates a Docker image, and pushes it to Docker Hub. A GitHub webhook triggers the pipeline whenever code is pushed.


## Project Aim

The aim of this project is to set up a fully automated CI pipeline using Jenkins running inside a Docker container. The pipeline fetches code from GitHub, installs dependencies, runs tests, builds a Docker image, and pushes the image to Docker Hub. GitHub webhooks are used to automatically trigger Jenkins builds after each commit. This setup simulates production-level CI workflows commonly used in DevOps environments.


## Table of Contents

* [Overview](#overview)
* [Architecture](#architecture)
* [Project Code Structure](#project-code-structure)
* [Technologies Used](#technologies-used)
* [How to Run the Application](#how-to-run-the-application)
* [API Endpoints](#api-endpoints-backend)
* [Stopping and Cleaning](#stopping-and-cleaning)
* [Simulation Output](#simulation-output)
* [Conclusion](#conclusion)


## Overview

This project demonstrates:

* Running Jenkins inside a Docker container using Docker Compose
* Building and testing a Node.js application using a Jenkins pipeline
* Building and pushing Docker images to Docker Hub
* Automating CI triggers using GitHub Webhooks
* Using Jenkins credentials to securely store Docker Hub tokens
* Running Jenkins on an AWS EC2 instance to simulate cloud-based CI

Steps executed in this project:

1. Created a simple Node.js application endpoint.
2. Created a Jenkinsfile for pipeline automation.
3. Pushed the code to a GitHub repository.
4. Provisioned an AWS EC2 instance and connected via SSH.
5. Installed Docker on EC2.
6. Created Docker Compose configuration to run Jenkins in a Docker container.
7. Logged into Jenkins and installed plugins.
8. Restarted Jenkins using Docker Compose down/up (volumes preserved).
9. Set up a Jenkins Pipeline job.
10. Added two Secret Text credentials for Docker Hub username and token.
11. Executed build and verified Docker image push to Docker Hub.
12. Configured GitHub webhook to trigger Jenkins pipeline automatically.
13. Made a code change and pushed it to GitHub.
14. Observed Jenkins triggering pipeline automatically and publishing a new Docker image.


## Architecture

```mermaid
graph TD
    A[Developer] -->|Commit & Push| B[GitHub Repository]
    B -->|Webhook Trigger| C[Jenkins in Docker on EC2]
    C <-->|Checkout Code| B
    C -->|Build, Test, Docker Build| D[Docker Engine on EC2]
    D -->|Push Image| E[Docker Hub Registry]
    C -->|Pipeline Status| A
```


## Project Code Structure

```
jenkins-ci-pipeline/
│
├── app-code-files/
│   ├── app.js
│   ├── test.js
│   ├── package.json
│   ├── Dockerfile
│   └── Jenkinsfile
│
├──  server-config-files/ (to be put manually in server)
│   ├── docker-compose.yml
│   └── jenkins_home/ (auto-created volume)
│
├── assets/
└── README.md
```


## Technologies Used

| Category           | Technologies                   |
| ------------------ | ------------------------------ |
| CI/CD Engine       | Jenkins                        |
| Containerization   | Docker, Docker Compose         |
| Backend            | Node.js                        |
| Cloud Provider     | AWS (EC2)                      |
| Version Control    | Git, GitHub                    |
| Container Registry | Docker Hub                     |
| Automation         | Jenkins Pipeline (Declarative) |
| Webhooks           | GitHub → Jenkins               |


## How to Run the Application


### 1. Create and Connect to EC2 instance

Make ready the github repository with required code files

![Github repository](./assets/00-git-repo.png)

Launch an EC2 instance using following configuraion:

- **Name**: `Jenkins-in-docker-server`  
- **AMI**: Ubuntu  
- **Instance Type**: `c7i-flex.large` (Jenkins requires high CPU/RAM)
- **Security Group**: Allow **all inbound** temporarily for project use  
- **Key Pair**: Your key

![EC2 instance](./assets/01-instance-ready.png)


### 2. Install Docker

Follow the installation commands from here (execute given commands):
`https://docs.docker.com/engine/install/ubuntu/`

![Install docker](./assets/02-docker-installed.png)


### 3. Create docker-compose.yml for Jenkins

```yaml
version: "3.9"
services:
  jenkins:
    image: jenkins/jenkins:lts-jdk17
    container_name: jenkins
    user: root
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
      - /usr/bin/docker:/usr/bin/docker
volumes:
  jenkins_home:
```

Start Jenkins using docker compose:

```bash
docker compose up -d
```


### 4. Retrieve Jenkins admin password

```bash
docker exec -it jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

![Get admin password](./assets/03-jenkins-config-1.png)

Open Jenkins in browser and unlock:

```
http://<EC2-PUBLIC-IP>:8080
```

![Unlock admin](./assets/04-jenkins-config-2.png)


### 5. Install Required Plugins

Install these plugins (mostly installed by default):

* Git plugin
* Git client plugin
* GitHub Integration plugin
* GitHub Branch Source
* Docker Pipeline
* Credentials Binding
* Pipeline (workflow-aggregator)

Restart Jenkins when prompted.

After restart, use docker compose to up the containers.

![Install plugins suggested](./assets/05-jenkins-config-3.png)

![Install plugins](./assets/06-jenkins-config-4.png)


### 6. Add Credentials in Jenkins

- Get DockerHub Personal Access token from:

`DockerHub Dashboard → Settings → Personal Access Tokens → Generate`

![PAT page](./assets/07-1-docker-hub-cred-page.png)

![Configure PAT](./assets/07-2-dockerhub-cred-config.png)

![PAT created](./assets/07-3-dockergub-cred.png)

- In Jenkins, navigate to:

`Jenkins Dashboard → Manage Jenkins → Credentials → Global → Add Credentials`

![Jenkins settings page](./assets/08-1-jenkins-setting.png)

![Jenkins credentials page](./assets/08-2-jenkins-creds.png)

![Jenkins Global credentials](./assets/09-jenkins-global-creds.png)

- Add two **Secret Text** credentials:

1. Docker Hub Username (`dockerhub-username`)
2. Docker Hub Token (`dockerhub-token`)

![Credential config page](./assets/10-jenkins-cred-enter.png)

![Credentials page](./assets/11-jenkins-secret-creds.png)


### 7. Configure Pipeline Job

* New Item → Pipeline
* Select "Pipeline script from SCM"
* SCM: `Git`
* Repository URL: your GitHub repo
* Branch: `*/main`
* Script Path: `Jenkinsfile`

![Job configuration](./assets/12-1-config-pipeline.png)

![Enable Trigger](./assets/12-2-pipeline-configs.png)

![Pipeline configuration](./assets/12-3-pipeline-config.png)


### 8. Trigger Build (manual)

- Click `Build Now` of the pipeline job, then use:

```bash
docker logs -f jenkins
```

- Verify that Jenkins builds and pushes image to Docker Hub.

![Manual Trigger](./assets/13-1-trigger-manually.png)

![Pipeline execution success](./assets/13-2-trigger-manually-success.png)

![Pushed Image](./assets/13-3-trigger-manually-dockerhub.png)


### 9. Trigger Build (automated)

- Congifure a Github Webhook using
`http://<EC2-PUBLIC-IP>:8080/github-webhook`

- Make code changes, commit and push to github

- Verify that Jenkins builds and pushes image to Docker Hub.

![Configure webhook](./assets/14-1-create-webhook.png)

![Webhook created](./assets/14-2-webhook-created.png)

![Push changes](./assets/15-1-code-changes-push.png)

![Job triggered](./assets/15-2-webhook-trigger.png)

![Pipeline execution success](./assets/15-3-trigger-success.png)

![Pushed Image](./assets/15-4-image-pushed.png)


## API Endpoints (Backend)

| Method | Endpoint       | Description            |
| ------ | -------------- | ---------------------- |
| GET    | `/api`         | Returns a test message |
| GET    | `/api/welcome` | Returns a test message |
| GET    | `/api/greet`   | Returns a test message |

Example test:

```bash
curl http://<IP>:50000/api/welcome
curl http://<IP>:50000/api
curl http://<IP>:50000/api/greet
```


## Stopping and Cleaning

- Stop Jenkins:

```bash
docker compose down
```

- Stop and clean volumes:

```bash
docker compose down --volumes
```


## Simulation Output

### Docker Hub Image Updated

- Check latest tag:
```
docker pull your-username/ci-sample-app:latest
```

- Run the image
```bash
docker run -itd -p 50000:50000 --name jenkins your-username/ci-sample-app:latest
```

- Check the endpoints at `http://<IP>:50000`

![Endpoint-1](./assets/16-1-test-endpoint.png)

![Endpoint-2](./assets/16-2-test-endpoint.png)

![Endpoint-3](./assets/16-3-test-endpoint.png)


## Conclusion

This project demonstrates a complete CI setup using Jenkins running inside Docker on an AWS EC2 instance. It automates the building and publishing of Docker images to Docker Hub and uses GitHub Webhooks to trigger the pipeline on every code push. This reflects real-world CI workflows where automation, containerization, and version control integration form the backbone of a DevOps pipeline.

Key learning outcomes:

* Running Jenkins inside Docker with persistent volumes
* Creating a Jenkins Declarative Pipeline using Jenkinsfile
* Integrating Jenkins with GitHub SCM
* Using Jenkins credentials to securely store secrets
* Building and pushing Docker images using pipeline scripts
* Configuring GitHub webhooks to trigger CI builds
* Using EC2 as a cloud-based CI environment
