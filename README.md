# Street Animal Guardian

A community web application for reporting injured or distressed street animals. Citizens submit reports with photos and GPS location; admins review cases, mark them resolved, and notify reporters by email.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%7C%20Local-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Features

### Public
- Submit animal reports with type, condition, photo, and location
- Automatic reverse geocoding via OpenStreetMap (Nominatim)
- Email confirmation after submission
- Browse all submitted reports

### Admin
- Session-based admin login
- Dashboard to review all reports
- Mark reports as resolved
- Automatic resolution email to the reporter

## Tech stack

| Layer | Technologies |
|-------|-------------|
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Views | EJS templates |
| Styling | Tailwind CSS |
| Email | Nodemailer (Gmail) |
| Maps | OpenStreetMap Nominatim API |

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection string
- A Gmail account with an [App Password](https://support.google.com/accounts/answer/185833) for email notifications

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/Sudarshanbhat101/Street-Animal-Report-Web-App.git
cd Street-Animal-Report-Web-App
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values (see [Environment variables](#environment-variables) below).

### 4. Build Tailwind CSS

```bash
npm run build:css:once
```

For development, run this in a separate terminal to watch for changes:

```bash
npm run build:css
```

### 5. Start the server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: `3000`) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `EMAIL_USER` | Yes | Gmail address for sending notifications |
| `EMAIL_PASS` | Yes | Gmail app password |
| `ADMIN_USERNAME` | Yes | Admin dashboard username |
| `ADMIN_PASSWORD` | Yes | Admin dashboard password |
| `SESSION_SECRET` | Yes | Random string for express-session |

## Routes

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| `GET` | `/` | Public | Home page |
| `GET` | `/report` | Public | Report form |
| `POST` | `/report` | Public | Submit a report |
| `GET` | `/view-reports` | Public | List all reports |
| `GET` | `/login` | Public | Admin login |
| `POST` | `/login` | Public | Admin authentication |
| `GET` | `/admin` | Admin | Admin dashboard |
| `POST` | `/admin/resolve/:id` | Admin | Mark report resolved |
| `GET` | `/logout` | Admin | End session |

## Project structure

```
Street-Animal-Report-Web-App/
├── app.js                 # Express app, routes, MongoDB models
├── views/                 # EJS templates
│   ├── home.ejs
│   ├── report.ejs
│   ├── success.ejs
│   ├── view-reports.ejs
│   ├── login.ejs
│   └── admin-reports.ejs
├── public/
│   └── css/
│       ├── input.css      # Tailwind source
│       └── style.css      # Built CSS (generated)
├── tailwind.config.js
├── .env.example
├── .gitignore
├── LICENSE
└── package.json
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start with nodemon (auto-reload) |
| `npm run build:css` | Watch and compile Tailwind CSS |
| `npm run build:css:once` | One-time Tailwind CSS build |

## Security notes

- Never commit `.env` or real credentials
- Use strong `ADMIN_PASSWORD` and `SESSION_SECRET` in production
- Set `cookie.secure: true` when serving over HTTPS

## Future improvements

- [ ] Role-based access with hashed passwords in the database
- [ ] Image upload to cloud storage (S3 / Cloudinary)
- [ ] Map view for report locations
- [ ] SMS alerts for rescue volunteers

## Author

**Sudarshan Bhat** — [GitHub](https://github.com/Sudarshanbhat101)

## License

This project is licensed under the [MIT License](LICENSE).
