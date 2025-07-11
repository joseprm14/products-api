import express from 'express';
import sequelize from './config/db.js';
import productRoutes from './routes/products.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/products', productRoutes);

// Testear DB y sync
sequelize.sync().then(() => console.log('DB connected'));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app
  .listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  })
  .on("error", (err) => {
    console.error(`Error al iniciar el servidor con error: ${err}`);
  });
