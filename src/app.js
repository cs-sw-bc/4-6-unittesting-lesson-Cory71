import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import indexRoutes from './routes/indexRoutes.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRoutes);

app.use((req, res) => {
  res.status(404).render('notFound', { path: req.originalUrl });
});

export default app;
