🚖 Taxi App Microservices

This repository contains a microservices-based taxi application with the following services:

Matching Service 🚗 (Handles driver-client matching using Socket.IO)

Auth Service 🔑 (Manages authentication, JWT, and user verification)

DB Service 🗄️ (Manages PostgreSQL database interactions)

Gateway Service 🌐 (API Gateway that routes requests to the correct service)

📌 Tech Stack

Node.js (Backend)

Express.js (API framework)

Socket.IO (Real-time communication)

Redis (Caching and real-time data handling)

PostgreSQL (Database)

Docker & Docker Compose (Containerization)

Nginx (Reverse proxy for API Gateway)


🚀 Getting Started

1️⃣ Clone the Repository
git clone https://github.com/AliSoua/Nlymo.git
cd Nlymo

2️⃣ Install Dependencies
For each microservice (matching_service, auth_service, db_service, gateway_service), run:
cd <service_name>
npm install

3️⃣ Run Each Microservice
Inside each service folder, start the server:
npm run server

4️⃣ Start Redis Servers
Navigate to the cli folder and run the batch file to start Redis servers:
cd cli
.\redis_server.bat

📌 Environment Variables
Each microservice requires a .env file for configuration. Here are the required variables:
Auth & DB Services (auth_service/.env and db_service/.env)

PGUSER= 
PGPASSWORD=
PGDATABASE=
PGHOST=
PGPORT=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
ADMIN_ACCESS_TOKEN=
SECRET_KEY=







