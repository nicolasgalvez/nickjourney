import express from 'express';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './routes/auth';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Google auth middleware
// Currently no use for this during testing. I still need to look up how discord oauth works for public apps.
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
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


export default app;
