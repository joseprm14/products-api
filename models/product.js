import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

// Definimos el modelo de datos de la tabla Product
const Product = sequelize.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
    stock: { type: DataTypes.INTEGER },
    price: { type: DataTypes.FLOAT }
});

export default Product