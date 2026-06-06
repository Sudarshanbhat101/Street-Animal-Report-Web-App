# Street Animal Guardian

> Collaborative project — community platform to report injured or distressed street animals, with admin resolution tracking and email notifications.

**Live demo:** [street-animal-report.vercel.app](https://street-animal-report.vercel.app)  
**Partner repo:** [shripoornasunilpetkar/street-animal-report](https://github.com/shripoornasunilpetkar/street-animal-report)

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Local%20%7C%20Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Contributors

| Name | GitHub |
|------|--------|
| Sudarshan Bhat | [@Sudarshanbhat101](https://github.com/Sudarshanbhat101) |
| Shripoorna Sunil Petkar | [@shripoornasunilpetkar](https://github.com/shripoornasunilpetkar) |

## What it does

1. Citizen fills report form — animal type, condition, photo, GPS location, email
2. `POST /report` validates input and reverse-geocodes coordinates via **OpenStreetMap Nominatim**
3. Report saved to **MongoDB** as a `Report` document (image stored as base64 string)
4. **Nodemailer** sends confirmation email to reporter
5. Admin logs in → reviews reports → marks resolved → resolution email sent

## Tech stack

| Layer | Technology | Role |
|-------|------------|------|
| Runtime | Node.js + Express | Server, routes, middleware |
| Database | MongoDB + Mongoose | `Report` model persistence |
| Views | EJS | Server-rendered HTML pages |
| Styling | Tailwind CSS | UI (`public/css/input.css` → `style.css`) |
| Email | Nodemailer (Gmail) | Report confirmation + resolution emails |
| Maps | OpenStreetMap Nominatim | Lat/lng → readable address |
| Auth | express-session | Admin session (`req.session.isAdmin`) |

## Data model — `Report` (Mongoose)

```js
{
  animalType: String,   // required — e.g. "Dog", "Cat"
  location: String,     // required — "latitude, longitude"
  status: String,       // required — "stray" | "injured" | "dead"
  image: String,        // base64 data URL — "data:image/..."
  email: String,        // required — reporter email
  reportedAt: Date,     // default: Date.now
  resolved: Boolean     // default: false
}
```

## Routes

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| `GET` | `/` | Public | Home page |
| `GET` | `/report` | Public | Report submission form |
| `POST` | `/report` | Public | Submit report (validates + emails + renders `success.ejs`) |
| `GET` | `/view-reports` | Public | List all reports with readable addresses |
| `GET` | `/login` | Public | Admin login page |
| `POST` | `/login` | Public | Admin authentication |
| `GET` | `/admin` | Admin | Dashboard — all reports, resolve action |
| `POST` | `/admin/resolve/:id` | Admin | Mark report resolved + email reporter |
| `GET` | `/logout` | Admin | Destroy session |

## Project structure

```
Street-Animal-Report-Web-App/
├── app.js                 # Express app, Mongoose schema, all routes
├── views/                 # EJS templates
│   ├── home.ejs
│   ├── report.ejs
│   ├── success.ejs
│   ├── view-reports.ejs
│   ├── login.ejs
│   └── admin-reports.ejs
├── public/css/
│   ├── input.css          # Tailwind source
│   └── style.css          # Built output (run build:css)
├── tailwind.config.js
├── .env.example
└── package.json
```

## Setup

```bash
git clone https://github.com/Sudarshanbhat101/Street-Animal-Report-Web-App.git
cd Street-Animal-Report-Web-App
npm install
cp .env.example .env
# Edit .env with your MongoDB, Gmail, and admin credentials
npm run build:css:once
npm run dev
# Open http://localhost:3000
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default `3000`) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `EMAIL_USER` | Yes | Gmail address for notifications |
| `EMAIL_PASS` | Yes | Gmail app password |
| `ADMIN_USERNAME` | Yes | Admin dashboard username |
| `ADMIN_PASSWORD` | Yes | Admin dashboard password |
| `SESSION_SECRET` | Yes | Random string for express-session |

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Production server |
| `npm run dev` | Dev server with nodemon |
| `npm run build:css` | Watch Tailwind CSS |
| `npm run build:css:once` | One-time Tailwind build |

## License

MIT — see [LICENSE](LICENSE).
