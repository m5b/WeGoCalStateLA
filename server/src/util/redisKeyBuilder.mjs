export function buildRedisKey(prefix, key){
    if(!prefix || !key){
        throw new Error("Redis prefix or key is defined as null")
    }
    return prefix + key
}