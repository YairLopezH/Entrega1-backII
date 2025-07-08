import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from '../helpers/passport.js';
import User from '../models/user.model.js';

const router = Router();
const JWT_SECRET = 'your_jwt_secret'; 

router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    const newUser = new User({ first_name, last_name, email, age, password });
    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el registro', error });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: info.message || 'No autorizado' });
    }
    req.login(user, { session: false }, (err) => {
      if (err) return next(err);
      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token });
    });
  })(req, res, next);
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user._id,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    age: req.user.age,
    role: req.user.role,
    cart: req.user.cart
  });
});

export default router;
