# Resource Reservation Management System

## About the Project

The Resource Reservation Management System is a web application developed to manage shared resources and their reservations.

An admin can add and manage resources, check availability, create reservations, and cancel bookings. The dashboard also provides a quick overview of reservation statistics.

The system checks resource availability to help prevent overlapping reservations.

## Features

- Admin login and logout
- Dashboard with reservation statistics
- Add, edit, search, and filter resources
- Activate and deactivate resources
- Create and cancel reservations
- Check resource availability
- Prevent overlapping reservations
- Validate requests and handle errors

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- JWT authentication
- bcryptjs
- Git and GitHub

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Mizxzhl/resource-reservation-system.git
cd resource-reservation-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and add the following variables with your own values:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/YOUR_DATABASE"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD_HASH="your_escaped_bcrypt_password_hash"
SESSION_SECRET="your_random_session_secret"
```

**Generate the admin password hash:**

Run the following command, replacing `YourStrongPassword123!` with your preferred admin password:

```bash
node -e "require('bcryptjs').hash('YourStrongPassword123!', 12).then(console.log)"
```

Copy the generated hash into `ADMIN_PASSWORD_HASH`.

**Important:** Next.js environment variable expansion interprets `$` characters. Escape every `$` in the generated bcrypt hash using `\$` when adding it to `.env`.

Example format:

```env
ADMIN_PASSWORD_HASH="\$2b\$12\$YOUR_ESCAPED_HASH"
```

Use the complete generated hash, replacing every `$` with `\$`.

**Generate the session secret:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the generated value into `SESSION_SECRET`.

**Security:** Never commit your `.env` file, passwords, session secrets, or database credentials to GitHub. Ensure `.env` is included in `.gitignore`.

### 4. Set up the database

Make sure PostgreSQL is running and your database has been created.

**Generate the Prisma Client:**

```bash
npx prisma generate
```

This generates the Prisma Client required by the application.

**Apply the existing Prisma migrations:**

```bash
npx prisma migrate deploy
```

This creates the required database tables using the project's existing migrations.

### 5. Start the application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:####) in your browser.

The admin login page is available at `/login`.

Use the `ADMIN_EMAIL` and the original password used to generate `ADMIN_PASSWORD_HASH` to log in.

### 6. Verify the production build

Run:

```bash
npm run build
```

A successful build confirms that the application compiles for production.


## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/resources` | Get resources and apply filters |
| POST | `/api/resources` | Create a resource |
| PUT | `/api/resources/[id]` | Update a resource |
| DELETE | `/api/resources/[id]` | Deactivate a resource |
| GET | `/api/resources/[id]/availability` | Check availability |
| GET | `/api/reservations` | Get reservations |
| POST | `/api/reservations` | Create a reservation |
| DELETE | `/api/reservations/[id]` | Cancel a reservation |
| GET | `/api/dashboard/stats` | Get dashboard statistics |
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/logout` | Admin logout |
| GET | `/api/auth/session` | Check the admin session |

The management endpoints require an authenticated admin session.

## Database

The application uses PostgreSQL with Prisma ORM.

The main database models are:

- **Resource:** Stores resource details, location, and active status.
- **Reservation:** Stores the resource being reserved, the person making the reservation, purpose, start and end times, and status.

A sample database backup is included in the repository.

## ER Diagram

The ER diagram shows the relationship between resources and reservations.
(https://dbdiagram.io/d/6ad079f7aebfe7a21ff65122)

## Author

Developed as a software engineering project.
