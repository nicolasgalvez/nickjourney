import express from 'express';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './routes/auth';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// ...existing code...

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

console.log('GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', GOOGLE_CLIENT_SECRET);

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  import('./config/passport').then(() => {
    app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: false }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(authRoutes);
  }).catch(err => {
    console.error('Failed to load passport configuration:', err);
  });
} else {
  console.warn('Google OAuth credentials are not set. Authentication is disabled.');
}

// ...existing code...

export default app;
