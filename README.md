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

2. **Start the PostgreSQL database**
   Use Docker Compose to start the PostgreSQL service in the background:
   ```sh
   docker compose up -d
   ```

3. **Install dependencies**
   Run `pnpm` to install all dependencies in the monorepo:
   ```sh
   pnpm install
   ```

4. **Seed the database**
   Run the seed script to populate the database:
   ```sh
   pnpm seed
   ```

5. **Start the development server**
   After seeding is complete, start the development servers:
   ```sh
   pnpm dev
   ```

## Notes
- The `docker compose up -d` command will create a PostgreSQL instance that the application depends on.
- The seeding script must be run to populate the database with initial data before starting the app.


