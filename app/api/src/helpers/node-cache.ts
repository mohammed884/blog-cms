import NodeCache from "node-cache";
const cache = new NodeCache();

interface ISetCacheOpts {
    key: string;
    value: any;
    ttl:string
}
const convertToMs = (ttl:string) => {
    const [a, type]:any = ttl.split("-");
    const amount = Number(a)    
    switch (type) {
        case "seconds":
            return amount * 1000;
        case "minutes":
            return amount * 60 * 1000;
        case "hours":
            return amount * 60 * 60 * 1000;
        case "days":
            return amount * 24 * 60 * 60 * 1000;
        case "weeks":
            return amount * 7 * 24 * 60 * 60 * 1000;
        case "months":
            return amount * 30 * 24 * 60 * 60 * 1000;
        case "years":
            return amount * 365 * 24 * 60 * 60 * 1000;
    }
}
const setCache = ({ key, value, ttl }: ISetCacheOpts) => {
    let timeInTtl = ttl ? convertToMs(ttl) : "";
    return cache.set(key, value, timeInTtl);
};
const deleteCache = (key: string) => {
    return cache.del(key);
}
const flushCache = () => {
    cache.flushAll();
}
const getCache = (key: string) => {
    return cache.get(key);
}
export {
    setCache,
    deleteCache,
    flushCache,
    getCache
}