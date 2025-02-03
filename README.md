# Blog Backend

This is a backend API for a blog application built using **Bun**, **Express**, **Prisma**, and **TypeScript**. It provides endpoints for managing users, authentication, posts, and comments while using cookie-based authentication.

## Features

- **User Authentication**: Register, login, logout, and session management using cookies.
- **Post Management**: Create, read, update, and delete blog posts.
- **Comment System**: Users can comment on posts.
- **Middleware & Validation**: Zod for input validation, Morgan for logging.
- **Database Management**: Prisma ORM with PostgreSQL.
- **Secure Authentication**: Cookie-based authentication mechanism.

## Tech Stack

- **Bun** - JavaScript runtime
- **Express** - Web framework for handling routes and middleware
- **Prisma** - ORM for database interactions
- **TypeScript** - Static type checking
- **Zod** - Validation library for request data
- **Morgan** - HTTP request logger

## Installation

### Prerequisites

Ensure you have the following installed:
- [Bun](https://bun.sh/)
- [PostgreSQL](https://www.postgresql.org/)
- Node.js (if needed for Prisma CLI)

### Steps

1. **Clone the repository**
   ```sh
   git clone https://github.com/Lakshya9545/Scriptorium.git
   cd blog-backend
   ```
2. **Install dependencies**
   ```sh
   bun install
   ```
3. **Set up environment variables**
   Create a `.env` file in the root directory and configure the required variables:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/blog_db
   JWT_SECRET=your_secret_key
   COOKIE_SECRET=your_cookie_secret
   ```
4. **Run database migrations**
   ```sh
   bun prisma migrate dev
   ```
5. **Start the server**
   ```sh
   bun run dev
   ```

## API Endpoints

     ```bash
     import Scriptorium.postman_collection.json in postman
    



## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to your branch: `git push origin feature-branch`
5. Submit a pull request.

