import * as ioredisTypes from 'ioredis';
import ioredis from 'ioredis';

const redisClient = new ioredis();
const withIOredisClient = async <T>(client: ioredisTypes.Redis, fn: (client: ioredisTypes.Redis) => Promise<T>): Promise<T> => {
    try {
        return await fn(client);
    } catch (err) {
        throw err; // Re-throw errors for proper handling
    } finally {
        // if (client) {
        //     client.quit();
        // }
        // client.quit(); // Close the connection after each operation
    }
};
const setRedisCache = async (client: ioredisTypes.Redis, key: string, value: any, expiry?: number,dataType?:"hashmap"): Promise<void> => {
    await withIOredisClient(client, async (client) => {
        if (expiry) {
            await client.set(key, JSON.stringify(value), 'EX', expiry);
        } else {
            await client.set(key, JSON.stringify(value));
        }
    });
};
const getCache = async <T>(client: ioredisTypes.Redis, key: string): Promise<T | null> => {
    return await withIOredisClient(client, async (client) => {
        const value = await client.get(key);
        return value ? JSON.parse(value) : null;
    });
};

const delCache = async (client: ioredisTypes.Redis, key: string): Promise<number> => {
    return await withIOredisClient(client, async (client) => {
        return client.del(key);
    });
};
const getOrSetCache = async (client: ioredisTypes.Redis, key: string, cb: any, expiry: number) => {
    const cachedValue = await getCache(client, key);
    if (cachedValue) return cachedValue;
    const freashData = await cb();
    await setRedisCache(client, key, freashData, expiry);
    return freashData;
}
export { redisClient, getCache, setRedisCache, delCache, getOrSetCache }