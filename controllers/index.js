// Packages
const jwt = require('jsonwebtoken');
const validator = require('validator');
const mongoose = require('mongoose');

// Functions
const { responseCreator, getUserIp } = require('./../functions/global');
const { checkCodeExistance } = require('./../functions/redis');

// Configs
const { legalIps, legalServices } = require('./../configs/config');

module.exports = {
    /**
     * Function to authorize requests
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    async authorization(req, res, next) {
        let user_ip = getUserIp(req);
        if ('token' in (req.headers)) {
            try {
                const tokenDecode = jwt.verify((req.headers.token), process.env.SERVICES_TOKEN_KEY);
                if ('containerId' in tokenDecode && 'service' in tokenDecode && legalServices.includes(tokenDecode['service'])) {
                    Object.assign(req, {
                        user: {
                            containerId: (tokenDecode['containerId'])
                        }
                    })
                    return next();
                }
            } catch (error) {
                console.log('Sent token is not valid');
            }
        }

        const { authorization } = req.headers
        if (!authorization) return res.status(401).send(responseCreator(5));
        try {
            await checkCodeExistance(authorization)
            const decode = jwt.verify(authorization, process.env.SECRET_KEY)
            if (!decode || !decode['containerId'] || !validator.isMongoId(decode['containerId'])) return res.status(401).send(responseCreator(5))
            Object.assign(req, {
                user: {
                    containerId: (decode['containerId'])
                }
            })
            return next();
        } catch (error) {
            console.log('Sent authorization is not valid')
            return res.status(401).send(responseCreator(5))
        }
    },
    /**
     * Send Error object for authotization in project
     * @param {object} req 
     * @param {object} res 
     * @param {object} next 
     */
    checkDB: (req, res, next) => {
        if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
            return res.status(500).send(responseCreator(0))
        }
        next()
    },
    /**
     * Send Error object for routes not found in project
     * @param {object} req 
     * @param {object} res 
     */
    errorhandler(req, res) {
        return res.status(404).send(responseCreator(9))
    }
}