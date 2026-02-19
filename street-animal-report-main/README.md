# Street Animal Guardian

A comprehensive web application for reporting and managing street animal cases in communities.

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Express-session** - Session management
- **Nodemailer** - Email notifications
- **Axios** - HTTP requests
- **Bcrypt** - Password hashing

### Frontend
- **EJS** - Templating engine
- **TailwindCSS** - Styling framework
- **HTML/CSS/JavaScript** - Core web technologies

## 🛠️ Features

### User Features
- Report submission with animal details and location
- Photo upload capability
- Real-time location mapping
- Email confirmation system
- Public report viewing

### Admin Features
- Secure admin dashboard
- Report management system
- Resolution tracking
- Comprehensive report overview

## 🔧 Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

4. Start the development server
```bash
npm run dev
```

5. Build CSS (in a separate terminal)
```bash
npm run build:css
```

## 📝 Project Structure

```
├── app.js              # Main application file
├── views/             # EJS templates
├── public/            # Static files
│   ├── css/          # CSS files
│   └── js/           # JavaScript files
├── .env              # Environment variables
└── package.json      # Project dependencies
```

## 🔒 Security Features

- Admin authentication system
- Input validation
- Secure session handling
- Environment variable protection

## 🌐 API Integration

- OpenStreetMap for location services
- Email service integration
- MongoDB database connection

## 📧 Contact

For support or queries, please contact the project maintainers. 