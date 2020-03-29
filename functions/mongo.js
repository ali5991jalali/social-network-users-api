// Configs
const { dataKeys, rangeKeys, patterns } = require('./../configs/config');
const { validator, getIsoDate, makeArrayFromIds } = require('./global')

module.exports = {
    /**
     * Function to make query for searching in mongo
     * @param {object} query 
     * @param {array} illegalKeys 
     */
    makeInitialMongoWhere(query, illegalKeys) {
        let { skip, limit, sort, order, fields, ...rest } = query;
        const where = {}
        const datePattern = new RegExp(/^\d{4}-\d{2}-\d{2}$/);
        const fromPattern = /^.+From$/;
        const toPattern = /^.+To$/;
        for (key of Object.keys(rest)) {
            if (illegalKeys.includes(key)) throw Error('illegal key');
            if (rest[key] == undefined || rest[key] == null || String(rest[key]).trim() == '') continue;
            if (Object.keys(dataKeys).includes(key)) {
                Object.assign(where, {
                    [(dataKeys[key])]: query[key]
                })
            } else if (Object.keys(rangeKeys).includes(key)) {
                if (rangeKeys[key]['typeCheck'] == 'isQueryDate' && /.*00.*/.test(rest[key])) {
                    throw Error('invalid value')
                }
                if (toPattern.test(key)) {
                    if (Object.keys(where).includes(rangeKeys[key]['address'])) {
                        where[(rangeKeys[key]['address'])]['$lt'] = getIsoDate(rest[key])
                    } else {
                        where[(rangeKeys[key]['address'])] = { '$lt': getIsoDate(rest[key]) }
                    }
                } else if (fromPattern.test(key)) {
                    if (Object.keys(where).includes(rangeKeys[key]['address'])) {
                        where[(rangeKeys[key]['address'])]['$gt'] = getIsoDate(rest[key])
                    } else {
                        where[(rangeKeys[key]['address'])] = { '$gt': getIsoDate(rest[key]) }
                    }
                }
            }
        }
        // Add ids to where
        if ('ids' in query) {
            idResult = makeArrayFromIds(query.ids);
            if (idResult) {
                where['_id'] = { '$in': idResult }
            } else {
                throw Error('invalid value')
            }
        }
        return where;
    },
    /**
     * Function to create mongo search options
     * @param {object} query 
     */
    makeInitialMongoOption(query) {
        const sortPattern = new RegExp(/^(createdAt|updatedAt)$/);
        const orderPattern = new RegExp(/^(asc|desc)$/);
        const options = {
            limit: (Number(query.limit) || 10),
            offset: (Number(query.skip) || 0),
            sort: {}
        }
        let querySort = 'createdAt';
        let order = (query.order && orderPattern.test(query.order)) ? Number((query.order).replace('asc', 1).replace('desc', -1)) : -1
        if (query['sort'] && sortPattern.test(query['sort'])) {
            querySort = query['sort']
        }
        Object.assign(options.sort, {
            [querySort]: order
        })
        return options;
    },
    /**
     * Function to create mongo update query
     * @param {object} body 
     * @param {array} keys 
     * @param {object} dataKeys 
     */
    makeMongoUpadteQuery(body, keys, dataKeys, illegalKeys) {
        const update = {}
        for (key of keys) {
            if (Object.keys(body).includes(key) && Object.keys(dataKeys).includes(key)) {
                Object.assign(update, {
                    [(dataKeys[key])]: body[key]
                })
            }
        }
        return update;
    },
    /**
    * Function to make query for searching in mongo and get count
    * @param {object} query 
    * @param {array} illegalKeys 
    */
    makeInitialMongoWhereCount(query, illegalKeys) {
        let rest = query;
        const where = {}
        const datePattern = new RegExp(/^\d{4}-\d{2}-\d{2}$/);
        const fromPattern = /^.+From$/;
        const toPattern = /^.+To$/;
        for (key of Object.keys(rest)) {
            if (illegalKeys.includes(key)) throw Error('illegal key');
            if (Object.keys(dataKeys).includes(key)) {
                Object.assign(where, {
                    [(dataKeys[key])]: query[key]
                })
            } else if (Object.keys(rangeKeys).includes(key)) {
                if (rest[key]) {
                    if (eval(`validator.${rangeKeys[key]['typeCheck']}('${rest[key]}')`)) {
                        if (rangeKeys[key]['typeCheck'] == 'isQueryDate' && /.*00.*/.test(rest[key])) {
                            throw Error('invalid value')
                        }
                        if (toPattern.test(key)) {
                            if (Object.keys(where).includes(rangeKeys[key]['address'])) {
                                where[(rangeKeys[key]['address'])]['$lt'] = getIsoDate(rest[key])
                            } else {
                                where[(rangeKeys[key]['address'])] = { '$lt': getIsoDate(rest[key]) }
                            }
                        } else if (fromPattern.test(key)) {
                            if (Object.keys(where).includes(rangeKeys[key]['address'])) {
                                where[(rangeKeys[key]['address'])]['$gt'] = getIsoDate(rest[key])
                            } else {
                                where[(rangeKeys[key]['address'])] = { '$gt': getIsoDate(rest[key]) }
                            }
                        }
                    } else {
                        throw Error('invalid value')
                    }
                }
            }
        }
        return where;
    }
}