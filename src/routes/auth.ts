import express from 'express'
import passport from 'passport'

const router = express.Router()

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/auth/google')
}

// Route to start OAuth authentication
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

// Callback route for Google to redirect to
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/dashboard')
  }
)

// Restricted route
router.get('/restricted', isAuthenticated, (req, res) => {
  res.send('This is a restricted route. You are authenticated.')
})

export default router
