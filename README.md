# Apexsoft Technology Admin Panel

A modern, responsive admin dashboard built with React and Tailwind CSS.

## Features

- **Authentication System**: Secure login with dummy credentials
- **Dashboard**: Overview with statistics and recent orders
- **User Management**: CRUD operations for user accounts
- **Settings**: System configuration and preferences
- **Dark Mode**: Built-in dark theme support
- **Responsive Design**: Works on all device sizes

## Demo Credentials

- **Email**: `apexsofttechnology@gmail.com`
- **Password**: `Apex@8899`

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or download the project
2. Navigate to the project directory:
   ```bash
   cd Apexadmin
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and visit `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── Login.js          # Login page component
│   ├── Layout.js         # Main layout with sidebar
│   ├── Dashboard.js      # Dashboard with stats and charts
│   ├── UserManagement.js # User management interface
│   └── Settings.js       # System settings page
├── App.js               # Main app component with routing
├── index.js             # React entry point
└── index.css            # Global styles
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Technologies Used

- **React 18** - Frontend framework
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Phosphor Icons** - Icon library (via SVG)

## Features Overview

### Authentication
- Simple login form with validation
- Session management using localStorage
- Protected routes

### Dashboard
- Revenue, users, and orders statistics
- Recent orders table
- Animated sales chart

### User Management
- User listing with search functionality
- Add, edit, and delete operations
- Role and status management

### Settings
- General application preferences
- Security settings with toggles
- Notification preferences
- API integrations

## Customization

The application uses Tailwind CSS for styling. You can customize the theme by modifying the `tailwind.config` object in `public/index.html`.

### Color Scheme
- Primary: `#1173d4` (Blue)
- Background Light: `#f6f7f8`
- Background Dark: `#101922`

## Browser Support

This application supports all modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for demonstration purposes.
