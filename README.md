# TravelHub

TravelHub is a comprehensive, microservices-based travel platform designed to offer a premium, curated experience for exploring Indian destinations. The platform features robust trip planning, seamless booking workflows, and simulated payment processing, all wrapped in a modern, dynamic user interface.

## 🏗️ Architecture

TravelHub is built using a modern microservices architecture to ensure scalability and separation of concerns:

- **Frontend (`/frontend`)**: A fast, interactive user interface built with React, Vite, and modern CSS practices. It includes routing, state management, and beautiful micro-animations for a premium feel.
- **API Gateway & Auth Service (`/node-backend`)**: A Node.js and Express application handling user authentication, rate limiting, and acting as an API gateway to proxy requests to the core backend.
- **Core Backend (`/laravel-backend`)**: A robust Laravel PHP application responsible for managing core business logic, including bookings, listings, and trip planning functionality.

### Tech Stack

- **Frontend**: React 19, Vite, React Router, Socket.io-client, Lucide React
- **Node Gateway**: Node.js, Express, Mongoose, JWT, http-proxy-middleware
- **Laravel Backend**: Laravel 12, PHP 8.2, MongoDB Laravel Integration
- **Database**: MongoDB

## ✨ Key Features

- **Curated Indian Destinations**: Explore 26 beautifully presented Indian locations with high-quality imagery and detailed information.
- **Trip Planning & Booking**: Plan your stays (12,000 INR/night) and multi-day tour packages (26,000 INR).
- **Payment Workflow**: Complete booking and payment flow with secure data handling.
- **User Dashboard**: Manage your bookings and profile through a dedicated user dashboard.
- **Secure Authentication**: Robust JWT-based authentication system.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need the following installed on your system:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)
- [PHP](https://www.php.net/) (v8.2 or higher)
- [Composer](https://getcomposer.org/)
- [MongoDB](https://www.mongodb.com/) (running locally or a connection string to a remote cluster)

### Installation & Setup

The project is split into three main directories. You will need to set up each one.

#### 1. Node API Gateway (`/node-backend`)
```bash
cd node-backend
npm install
```
- Create a `.env` file in the `node-backend` directory and configure your environment variables (e.g., `PORT`, `MONGODB_URI`, `JWT_SECRET`).
- Start the development server:
```bash
npm run dev
```

#### 2. Laravel Backend (`/laravel-backend`)
```bash
cd laravel-backend
composer install
```
- Copy the `.env.example` file to `.env` and configure your database connection and app key:
```bash
cp .env.example .env
php artisan key:generate
```
- Start the Laravel development server:
```bash
php artisan serve
```

#### 3. Frontend (`/frontend`)
```bash
cd frontend
npm install
```
- Create a `.env` file if necessary to point to the Node Gateway API URL (e.g., `VITE_API_URL=http://localhost:5000`).
- Start the Vite development server:
```bash
npm run dev
```

## 💻 Running the Application

To run the application locally, you need to have all three services running simultaneously:
1. Start the Node backend gateway.
2. Start the Laravel backend server.
3. Start the Vite frontend server.

Once all services are running, open your browser and navigate to the URL provided by the Vite server (usually `http://localhost:5173`).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
