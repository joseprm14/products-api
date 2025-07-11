import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Definimos la base de datos para sequelize utilizando variables de entorno
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
});

export default sequelize;