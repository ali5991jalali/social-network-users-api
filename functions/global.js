// Packages
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const redis = require('redis');
const cors = require('cors');
const request = require('request');
const jwt = require('jsonwebtoken');


// Configs
const { errors, patterns, rangeKeys } = require('./../configs/config');
const { CACHE_URL, SERVICES_TOKEN_KEY } = process.env;

// Functions

// Redis client
const redisClient = redis.createClient();

/**
 * Function for adding needed methods to validator package
 * @param {object} validator 
 */
function convertValidator(validator) {
    Object.keys(patterns).forEach((item) => {
        validator[item] = (data) => {
            return patterns[item].test(data)
        }
    })
    return validator;
}

// Import validator and convert to needed structur
const validator = convertValidator(require('validator'));


module.exports = {
    /**
     * Function for setting server 
     * @param {object} app 
     */
    serverSetting(app) {
        app.use(cors())
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({ extended: true }))
        return app;
    },
    /**
     * Function for connectiong server to specific port and all other connections (database)
     * @param {object} app 
     */
    Connections(app) {
        const { PORT: port, MONGOADRESS: mongoAdrress } = process.env
        app.listen((port), () => {
            console.log(`Application is running on port ${port}`)
        })

        mongoose.connect(`mongodb://${mongoAdrress}`, (error) => {
            if (error) {
                console.log(`Error in connectiong mongo because of ${error}`)
            } else {
                console.log('Successfully connected to mongo')
            }
        })

    },
    redisClient,
    validator,
    /**
     * Function to convert result to same response structure
     * @param {integer} code 
     * @param {object || array} result 
     */
    responseCreator(code, result = {}) {
        if (code == 200) {
            return { success: true, data: result }
        }
        return {
            success: false, error: {
                code,
                message: errors[code]
            }
        }
    },
    /**
     * Function for getting needed keys from data object or array
     * @param {object || array} result 
     * @param {array} keys 
     * @param {object} dataKeys 
     */
    getKeys(result, keys, dataKeys, illegalKeys) {
        const response = []
        let arrayFlag = true;
        if (!Array.isArray(result)) {
            result = [result]
            arrayFlag = false
        }
        for (object of result) {
            object = object._doc ? object._doc : object
            let data = {}
            for (key of keys) {
                if (illegalKeys.includes(key)) continue;
                if (Object.keys(object).includes(key)) {
                    Object.assign(data, {
                        [key]: object[key]
                    })
                } else if (Object.keys(dataKeys).includes(key)) {
                    let inner = dataKeys[key].split('.');
                    let search = inner.reduce((prev, curr) => {
                        return prev + `['${curr}']`
                    }, 'object')
                    if (eval(search) !== undefined) {
                        Object.assign(data, {
                            [key]: eval(search)
                        })
                    }
                }
            }
            response.push(data);
        }
        if (!arrayFlag) {
            return response[0]
        }
        return response;
    },
    /**
     * Function for checking params validation
     * @param {object} req 
     * @param {object} validation 
     */
    checkValidation(req, validation) {
        const result = {
            success: true
        }
        for (keyPlace in validation) {
            let { exist, typeCheck } = validation[keyPlace]
            for (existanceKey of exist) {
                if (!(req[keyPlace]) || !(req[keyPlace]).hasOwnProperty(existanceKey)) {
                    return Object.assign(result, {
                        success: false,
                        code: 1
                    })
                }
            }
            for (typeCheckKey in typeCheck) {
                if (!req[keyPlace]) continue;
                if ((req[keyPlace]).hasOwnProperty(typeCheckKey) && `${typeCheck[typeCheckKey]}` == 'isArray') {
                    if (!Array.isArray(req[keyPlace][typeCheckKey])) {
                        console.log(typeCheckKey)
                        return Object.assign(result, {
                            success: false,
                            code: 2
                        })
                    }
                    continue;
                }
                if ((req[keyPlace]).hasOwnProperty(typeCheckKey) && !eval(`validator.${typeCheck[typeCheckKey]}('${req[keyPlace][typeCheckKey]}')`)) {
                    console.log(typeCheckKey)
                    return Object.assign(result, {
                        success: false,
                        code: 2
                    })
                }
            }
        }
        return result;
    },
    /**
     * Function to find wanted keys in object
     * @param {object} object 
     * @param {array} keys 
     */
    findKeys(object, keys) {
        const result = {}
        keys.forEach((key) => {
            if (Object.keys(object).includes(key)) {
                result[key] = object[key]
            }
        })
        return result;
    },
    /**
     * Function to return error by checking error message
     * @param {string} message 
     */
    catchError(message) {
        if (/duplicate key error/.test(message)) {
            return {
                status: 422,
                result: module.exports.responseCreator(8)
            }
        } else if (/illegal key/.test(message)) {
            return {
                status: 422,
                result: module.exports.responseCreator(10)
            }
        } else if (/invalid value/.test(message)) {
            return {
                status: 422,
                result: module.exports.responseCreator(2)
            }
        }
        return {
            status: 500,
            result: module.exports.responseCreator(3)
        }
    },
    /**
     * Function to find array of keys from object we have to send back to client
     * @param {object} query 
     * @param {array} defaultKeys 
     */
    makeKeysFromFields(query, defaultKeys) {
        if (!query.fields) return defaultKeys;
        let keys = [];
        ((query.fields).split(',')).forEach((value) => {
            if (validator.isAlpha(value.trim()) || value == '_id') {
                keys.push(value.trim())
            }
        })
        if (keys.length > 0) return keys;
        return defaultKeys;
    },
    /**
     * Function to get ids in queryString and convert to array
     * @param {string} idsString
     */
    makeArrayFromIds(idsString) {
        const idsArray = idsString.split(',');
        if (idsArray.length > 60) return false;
        const result = idsArray.filter((id) => {
            return validator.isMongoId(id)
        })
        if (result.length == 0) return false;
        return result;
    },
    /**
     * Function to convert string date to iso date format
     * @param {string} date 
     */
    getIsoDate(date) {
        date = date.replace(/(\d{4})-(\d{2})-(\d{2})/, "$2/$3/$1");
        date = new Date(date);
        date.setDate(date.getDate() + 1);
        date.setHours(date.getHours() - 19);
        date.setMinutes(date.getMinutes() - 30);
        var isodate = date.toISOString();
        return isodate;
    },
    convertData(object, patterns) {
        const truePattern = /^true$/;
        patterns.boolean.forEach(element => {
            Object.keys(object).includes(element) ? (object[element] = truePattern.test(object[element]) ? true : false) : null;
        });
        patterns.number.forEach(element => {
            Object.keys(object).includes(element) ? object[element] = Number(object[element]) : null;
        });
        patterns.trimAndLowerCase.forEach(element => {
            Object.keys(object).includes(element) ? object[element] = (`${(object[element])}`).trim().toLowerCase() : null;
        });
        return object;
    },
    getUserIp(req) {
        return ((req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0]);
    },
    /**
    * Function for field creator
    * @param {string} fields
    * @param {string} fieldName
    * @param {object} date
    * @param {string} type
    */
    selectFields(fields, fieldName, data, typeFile) {
        let field = fields[typeFile][fieldName].split("."), result = data
        if (field.length) {
            field.map(item => {
                result = result[item]
            })
            return result
        } else if (field.length === undefined) {
            return result[field]
        }
    },
    socketRequest(event, data) {
        request({
            method: 'POST',
            url: 'https://api.raychat.io/socket/',
            json: {
                event,
                data
            },
            headers: {
                token: jwt.sign({
                    service: 'user'
                }, SERVICES_TOKEN_KEY)
            }
        })
    }
}
