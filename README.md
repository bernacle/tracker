# Tracker Project

This project is a Turborepo monorepo that uses `pnpm` for package management.

## Prerequisites
- Docker
- pnpm (v7 or later)

## Getting Started

1. **Clone the repository**
   ```sh
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Copy environment variables**
   Copy the content of `.env.example` to a new file named `.env`:
   ```sh
   cp .env.example .env
   ```

3. **Start the PostgreSQL database**
   Use Docker Compose to start the PostgreSQL service in the background:
   ```sh
   docker compose up -d
   ```

4. **Install dependencies**
   Run `pnpm` to install all dependencies in the monorepo:
   ```sh
   pnpm install
   ```

5. **Seed the database**
   Run the seed script to populate the database:
   ```sh
   pnpm seed
   ```

6. **Start the development server**
   After seeding is complete, start the development servers:
   ```sh
   pnpm dev
   ```
7. **Register and Authenticate an user** 
   With the server running, access `/auth/sign-up` to register a new user, then log in at `/auth/sign-in`

## Notes

To run the tests:
```sh
pnpm test
```
- The `docker compose up -d` command will create a PostgreSQL instance that the application depends on.
- The seeding script must be run to populate the database with initial data before starting the app.

## Local URLs

- `API`: Accessible at `http://localhost:3333`.
- `WEB`: Accessible at `http://localhost:3000`.