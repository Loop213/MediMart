# MediMart
<<<<<<< HEAD
Medimart is a full-stack medicine e-commerce platform that enables users to browse, search, and purchase healthcare products online with a fast, secure, and user-friendly experience.
=======

Production-ready full stack medicine e-commerce application inspired by modern pharmacy platforms such as Tata 1mg and PharmEasy.

## Stack

- Frontend: React + Vite + Tailwind CSS + Redux Toolkit + React Router
- Backend: Node.js + Express + MongoDB Atlas + Mongoose
- Auth: JWT + role-based access
- Payments: Cash on Delivery and manual UPI verification

## Features

- Search and filter medicines
- Cart persisted to database
- Prescription upload support
- COD and UPI checkout flows
- Order tracking and profile management
- Admin dashboard for medicines, orders, users, prescriptions, and payment verification
- Dark mode and light mode with local preference persistence

## Run locally

1. Copy `client/.env.example` to `client/.env`
2. Copy `server/.env.example` to `server/.env`
3. Install dependencies:

```bash
npm install
```

4. Start both apps:

```bash
npm run dev
```

## Seed admin and sample medicines

```bash
npm run seed
```

## Default admin credentials

- Email: value from `ADMIN_EMAIL`
- Password: value from `ADMIN_PASSWORD`
>>>>>>> d6b095c (Initial commit)
