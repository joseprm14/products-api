import redis from 'redis';

// Configuracion del cliente de redis
const redisClient = redis.createClient({
    socket: {
        host: '127.0.0.1',
        port: 6379
    }
});

redisClient.connect().catch(console.error);

export default redisClient;