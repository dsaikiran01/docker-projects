# Simple Multi-Container Application

This repository contains a multi-container application with the following components:

1. **Frontend**: A static HTML/CSS/JavaScript frontend served by an Nginx container.
2. **Backend**: A Node.js/Express backend that connects to MongoDB.
3. **MongoDB**: A database container using the official MongoDB image.
4. **Mongo Express**: A web-based MongoDB admin interface.

## Project Structure

- `frontend/`: Contains the static files for the frontend.
- `backend/`: Contains the Node.js/Express backend.
- `docker-compose.yml`: Defines the multi-container setup.

## Prerequisites

- Docker and Docker Compose installed on your system.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Build and Start the Containers

```bash
docker compose -f docker-compose.yml up -d
```

### 3. Access the Application

- **Frontend**: [http://localhost:8080](http://localhost:8080)
- **Backend API**: [http://localhost:3000](http://localhost:3000)
- **Mongo Express**: [http://localhost:8081](http://localhost:8081)

### 4. Environment Variables

The following environment variables are used in the application:

- **Backend**:
  - `MONGO_URI`: MongoDB connection string (default: `mongodb://mongo:27017/simple_auth_db`)
- **Mongo Express**:
  - `ME_CONFIG_MONGODB_SERVER`: MongoDB server name (default: `mongo`)
  - `ME_CONFIG_MONGODB_PORT`: MongoDB port (default: `27017`)
  - `ME_CONFIG_BASICAUTH_USERNAME`: Admin username (default: `admin`)
  - `ME_CONFIG_BASICAUTH_PASSWORD`: Admin password (default: `admin`)

### 5. API Endpoints

- **Register User**: `POST /api/register`
  - Request Body: `{ "username": "<username>", "password": "<password>" }`
  - Response: `{ "message": "User saved", "userId": "<id>" }`

- **Get All Users**: `GET /api/users`
  - Response: `[ { "username": "<username>", "password": "<password>" }, ... ]`

### 6. Stopping the Containers

```bash
docker-compose down
```

### 7. Cleaning Up

To remove all containers, networks, and volumes:

```bash
docker compose -f docker-compose.yml down
```

## Notes

- Ensure that the `docker-compose.yml` file is properly configured for your environment.
- Mongo Express is accessible at `http://API_IP:8081/db` with the default credentials `admin/admin`.
