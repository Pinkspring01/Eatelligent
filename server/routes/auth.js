import express from 'express';
import passport from 'passport';

const router = express.Router();

// @route   GET /auth/google
// @desc    Redirect to Google for authentication
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// @route   GET /auth/google/callback
// @desc    Google callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: process.env.CLIENT_URL }),
  (req, res) => {
    // Successful authentication, redirect to frontend
    res.redirect(process.env.CLIENT_URL);
  }
);

// @route   GET /auth/user
// @desc    Get current user
router.get('/user', (req, res) => {
  if (req.user) {
    res.json({ 
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        picture: req.user.picture
      }
    });
  } else {
    res.json({ user: null });
  }
});

// @route   GET /auth/logout
// @desc    Logout user
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.redirect(process.env.CLIENT_URL);
  });
});

export default router;