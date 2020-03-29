// Packages

// Global
const { redisClient: client } = require('./global')

module.exports = {
    setKeyInRedis(key, value) {
        return new Promise((resolve, reject) => {
            client.set(key, value, (error) => {
                if (error) {
                    reject(error);
                }
                resolve(true);
            })
        })
    },
    removeKeyFromRedis(key) {
        return new Promise((resolve, reject) => {
            client.del(key, (error) => {
                if (error) {
                    reject(error);
                }
                resolve(true);
            })
        })
    },
    checkCodeExistance(code) {
        return new Promise((resolve, reject) => {
            client.exists(code, (error, reply) => {
                if (error) {
                    console.log(error)
                    reject(error)
                }
                if (reply === 1) {
                    resolve(true)
                } else {
                    reject('does not exist this code')
                }
            })
        })
    }
}