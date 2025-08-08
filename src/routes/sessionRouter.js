import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const router = express.Router();

router.post('/login', (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: info.message });
    
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    res.json({ message: 'Login exitoso', token, user: { id: user._id, first_name: user.first_name, last_name: user.last_name, email: user.email, age: user.age, role: user.role } });
  })(req, res);
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ user: { id: req.user._id, first_name: req.user.first_name, last_name: req.user.last_name, email: req.user.email, age: req.user.age, role: req.user.role } });
});

export default router;
