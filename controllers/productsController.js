import Product from "../models/product.js";
import redisClient from "../config/redis.js";

const CACHE_TTL = 1800; // 30 minutos de cache

export const getProducts = async (req, res) => {
    // Endpoint para obtener todos los productos
    try {
        
        // Primero comprueba si se encuentran en el cache, en cuyo caso devuelve estos
        const cacheKey = 'products:all';
        const cached = await redisClient.get(cacheKey);

        if (cached) {
            console.log('Cache hit')
            return res.status(200).json(JSON.parse(cached));
        }

        console.log('Cache miss')
        // Si no estan en el cache, los toma de la base de datos
        const products = await Product.findAll();
        await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(products));

        return res.status(200).json(products);

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error fetching products'});
    }
}

export const createProduct = async (req, res) => {
    // Crear un nuevo producto para la base de datos
    try {
        const product = await Product.create(req.body);
        await redisClient.del('products:all'); // Invalida el cache
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error creating product' });
    }
}

export const updateProduct = async (req, res) => {
    // Actualiza un producto de la base de datos
    try {
        const { id } = req.params;
        await Product.update(req.body, { where: { id } });
        await redisClient.del('products:all'); // Invalida el cache
        await redisClient.del(`product:${id}`);
        res.status(200).json({ message: 'Product updated' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating product' });
    }
}

export const deleteProduct = async (req, res) => {
    // Elimina un producto de la base de datos
    try {
        const { id } = req.params;
        await Product.destroy({ where: { id } });
        await redisClient.del('products:all'); // Invalida el cache
        await redisClient.del(`product:${id}`);
        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting product' });
    }
};

export const getProductById = async (req, res) => {
    // Obtiene un producto dado su id
    try {
        // Primero comprueba si este producto se encuentra en el cache
        const { id } = req.params;
        const cacheKey = `product:${id}`;
        const cached = await redisClient.get(cacheKey);

        if (cached) {
            console.log('Cache hit')
            return res.status(200).json(JSON.parse(cached));
        }
        console.log('Cache miss')
        // Si no es así, lo busca en la base de datos
        const product = await Product.findByPk(id);
        if (!product) return res.status(404).json({ error: 'Not found' });

        await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(product));
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching product' });
    }
};
