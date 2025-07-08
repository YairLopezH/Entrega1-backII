import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';
import sessionRouter from './routes/sessions.routes.js';
import passport from './helpers/passport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionRouter);
app.use('/', viewsRouter);

app.use((err, req, res, next) => {
  console.error('Error en la aplicación:', err);
  res.status(500).send('Error interno del servidor');
});

app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

const PORT = process.env.PORT || 8080;
const MONGO_URL = 'mongodb://localhost:27017/codergames_entrega';

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error conectando a MongoDB:', error);
  });
