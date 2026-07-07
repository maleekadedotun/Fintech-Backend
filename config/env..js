export default {
    jwtSecret: process.env.JWT_SECRET,
    dbUrl: process.env.MONGO_URI,
    redisUrl: process.env.REDIS_URL,
};