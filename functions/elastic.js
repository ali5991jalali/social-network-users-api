// Packages
const elasticSearch = require('elasticsearch');

// Configs
const { dataKeys, rangeKeys } = require('./../configs/config')

// Global
const { validator, getIsoDate, makeArrayFromIds } = require('./global')


const client = new elasticSearch.Client({
    host: process.env.ELASTICADDRESS,
    log: 'error'
});

module.exports = {
    /**
     * Function to check if elasticsearch cluster is up or down!
     */
    checkElasticConnection() {
        return new Promise((resolve, reject) => {
            client.ping({
                requestTimeout: 200
            }, function (error) {
                if (error) {
                    reject({ message: 'elasticsearch cluster is down!' })
                } else {
                    resolve(true)
                }
            });
        })
    },
    /**
     * Function to create elasticsearch index
     */
    createIndex() {
        client.indices.create({
            index: 'raychat-users',
            body: {
                mappings: {
                    properties: {
                        name: {
                            type: 'text',
                            fields: {
                                keyword: {
                                    type: 'keyword'
                                }
                            }
                        },
                        email: {
                            type: 'text',
                            fields: {
                                keyword: {
                                    type: 'keyword'
                                }
                            }
                        },
                        type: {
                            type: 'integer'
                        },
                        status: {
                            type: 'integer'
                        },
                        hidden: {
                            type: 'integer'
                        },
                        channelId: {
                            type: 'keyword'
                        },
                        containerId: {
                            type: 'keyword'
                        },
                        conversationId: {
                            type: 'keyword'
                        },
                        tags: {
                            type: 'keyword'
                        },
                        notes: {
                            type: 'keyword'
                        },
                        options: {
                            type: 'object'
                        },
                        meta: {
                            type: 'object',
                            properties: {
                                online: {
                                    type: 'boolean',
                                    fields: {
                                        keyword: {
                                            type: 'keyword'
                                        }
                                    }
                                },
                                phone: {
                                    type: 'text'
                                },
                                avatar: {
                                    type: 'text',
                                    fields: {
                                        keyword: {
                                            type: 'keyword'
                                        }
                                    }
                                },
                                location: {
                                    type: 'object'
                                },
                                browser: {
                                    type: 'object'
                                }
                            }
                        },
                        createdAt: {
                            type: 'date'
                        },
                        updatedAt: {
                            type: 'date'
                        }
                    }
                }
            }
        }, (error, response, status) => {
            if (error) {
                if (status == 400) {
                    console.log('This index has been created before so if yo want to change please delete created index first and then try again')
                } else {
                    console.log(`An error occured along creating index in elasticsearch: `, error)
                }
            } else {
                console.log('index in elasticsearch created successfully')
            }

        })
    },
    createNoteIndex() {
        client.indices.create({
            index: 'raychat-notes',
            body: {
                mappings: {
                    properties: {
                        userId: {
                            type: 'keyword'
                        },
                        agentId: {
                            type: 'keyword'
                        },
                        text: {
                            type: 'text',
                            fields: {
                                keyword: {
                                    type: 'keyword'
                                }
                            }
                        },
                        url: {
                            type: 'text',
                            fields: {
                                keyword: {
                                    type: 'keyword'
                                }
                            }
                        },
                        containerId: {
                            type: 'keyword'
                        },
                        channelId: {
                            type: 'keyword'
                        },
                        createdAt: {
                            type: 'date'
                        },
                        updatedAt: {
                            type: 'date'
                        }
                    }
                }
            }
        }, (error, response, status) => {
            if (error) {
                if (status == 400) {
                    console.log('This index has been created before so if yo want to change please delete created index first and then try again')
                } else {
                    console.log(`An error occured along creating index in elasticsearch: `, error)
                }
            } else {
                console.log('index in elasticsearch created successfully')
            }

        })
    },
    createTagIndex() {
        client.indices.create({
            index: 'raychat-tags',
            body: {
                mappings: {
                    properties: {
                        userId: {
                            type: 'keyword'
                        },
                        agentId: {
                            type: 'keyword'
                        },
                        channelId: {
                            type: 'keyword'
                        },
                        title: {
                            type: 'text',
                            fields: {
                                keyword: {
                                    type: 'keyword'
                                }
                            }
                        },
                        tc: {
                            type: 'text',
                            fields: {
                                keyword: {
                                    type: 'keyword'
                                }
                            }
                        },
                        containerId: {
                            type: 'keyword'
                        },
                        'conversationCount': {
                            type: 'integer'
                        },
                        'contactCount': {
                            type: 'integer'
                        },
                        'isArchived': {
                            type: 'boolean'
                        },
                        createdAt: {
                            type: 'date'
                        },
                        updatedAt: {
                            type: 'date'
                        }
                    }
                }
            }
        }, (error, response, status) => {
            if (error) {
                if (status == 400) {
                    console.log('This index has been created before so if yo want to change please delete created index first and then try again')
                } else {
                    console.log(`An error occured along creating index in elasticsearch: `, error)
                }
            } else {
                console.log('index in elasticsearch created successfully')
            }

        })
    },
    createStatisticIndex() {
        client.indices.create({
            index: 'raychat-users-statistic',
            body: {
                mappings: {
                    properties: {
                        userId: {
                            type: 'keyword'
                        },
                        interaction: {
                            type: 'integer'
                        },
                        type: {
                            type: 'integer'
                        },
                        containerId: {
                            type: 'keyword'
                        },
                        channelId: {
                            type: 'keyword'
                        },
                        lead: {
                            type: 'date'
                        },
                        user: {
                            type: 'date'
                        },
                        changes: {
                            type: 'nested',
                            properties: {
                                from: {
                                    type: 'integer'
                                },
                                to: {
                                    type: 'integer'
                                },
                                time: {
                                    type: 'date'
                                }
                            }
                        },
                        createdAt: {
                            type: 'date'
                        },
                        updatedAt: {
                            type: 'date'
                        }
                    }
                }
            }
        }, (error, response, status) => {
            if (error) {
                if (status == 400) {
                    console.log('This index has been created before so if yo want to change please delete created index first and then try again')
                } else {
                    console.log(`An error occured along creating index in elasticsearch: `, error)
                }
            } else {
                console.log('index in elasticsearch created successfully')
            }

        })
    },
    /**
     * Function to craete query for searching in elastic
     * @param {object} query 
     * @param {array} illegalKeys 
     */
    makeElasticQuery(query, illegalKeys, dataKeys) {
        let { skip, limit, sort, order, fields, ...rest } = query;
        const sortPattern = new RegExp(/^(createdAt|updatedAt)$/);
        const orderPattern = new RegExp(/^(asc|desc)$/);
        let datePattern = new RegExp(/^\d{4}-\d{2}-\d{2}$/);
        let fromPattern = /^.+From$/;
        let toPattern = /^.+To$/;
        let body = {
            query: {
                bool: {
                    must: []
                }
            },
            size: (Number(query.limit) || 10),
            from: (Number(query.skip) || 0),
            "sort": [
                {
                    [query['sort'] && sortPattern.test(query['sort']) ? (query['sort']) : 'createdAt']: {
                        "order": ((query['order'] && orderPattern.test(query['order'])) ? query['order'] : 'desc')
                    }
                }
            ]
        }

        const filter = []
        for (key of Object.keys(rest)) {
            if (illegalKeys.includes(key)) throw Error('illegal key');
            if (rest[key] == undefined || rest[key] == null || String(rest[key]).trim() == '') continue;
            if (Object.keys(dataKeys).includes(key)) {
                if (key == 'title') {
                    body.query.bool.must.push({
                        regexp: {
                            [(dataKeys[key])]: `${query[key]}.*`
                        }
                    })
                } else {
                    body.query.bool.must.push({
                        match: {
                            [(dataKeys[key])]: query[key]
                        }
                    })
                }
            } else if (Object.keys(rangeKeys).includes(key)) {
                if (rangeKeys[key]['typeCheck'] == 'isQueryDate' && /.*00.*/.test(rest[key])) {
                    throw Error('invalid value')
                }
                if (toPattern.test(key)) {
                    filter.push({
                        range: {
                            [(`${rangeKeys[key]['address']}`)]: {
                                'lt': getIsoDate(rest[key])
                            }
                        }
                    })
                } else if (fromPattern.test(key)) {
                    filter.push({
                        range: {
                            [(`${rangeKeys[key]['address']}`)]: {
                                'gt': getIsoDate(rest[key])
                            }
                        }
                    })
                }
            }
        }
        filter.length > 0 ? Object.assign(body.query.bool, { filter }) : null;
        // Add ids to query
        if ('ids' in query) {
            idResult = makeArrayFromIds(query.ids);
            if (idResult) {
                (body['query']['bool']['must']).push({
                    terms: {
                        _id: idResult
                    }
                })
            } else {
                throw Error('invalid value')
            }
        }
        return body;
    },
    /**
     * Function to convert elastic result to api result
     * @param {array} result 
     */
    makeElasticQueryResult(result) {
        const data = []
        for (item of result.hits.hits) {
            const row = {}
            Object.assign(row, {
                _id: item._id
            }, (item._source)
            )
            data.push(row)
        }
        return data;
    },
    /**
     * Function to make query for searching in elastic and get count of data
     * @param {object} query 
     * @param {array} illegalKeys 
     */
    makeElasticQueryCount(query, illegalKeys) {
        let rest = query;
        let datePattern = new RegExp(/^\d{4}-\d{2}-\d{2}$/);
        let fromPattern = /^.+From$/;
        let toPattern = /^.+To$/;
        let body = {
            query: {
                bool: {
                    must: []
                }
            }
        }
        const filter = []
        for (key of Object.keys(rest)) {
            if (illegalKeys.includes(key)) throw Error('illegal key');
            if (rest[key] == undefined || rest[key] == null || String(rest[key]).trim() == '') continue;
            if (Object.keys(dataKeys).includes(key)) {
                body.query.bool.must.push({
                    match: {
                        [(dataKeys[key])]: query[key]
                    }
                })
            } else if (Object.keys(rangeKeys).includes(key)) {
                if (rangeKeys[key]['typeCheck'] == 'isQueryDate' && /.*00.*/.test(rest[key])) {
                    throw Error('invalid value')
                }
                if (toPattern.test(key)) {
                    filter.push({
                        range: {
                            [(`${rangeKeys[key]['address']}`)]: {
                                'lt': getIsoDate(rest[key])
                            }
                        }
                    })
                } else if (fromPattern.test(key)) {
                    filter.push({
                        range: {
                            [(`${rangeKeys[key]['address']}`)]: {
                                'gt': getIsoDate(rest[key])
                            }
                        }
                    })
                }
            }
        }
        filter.length > 0 ? Object.assign(body.query.bool, { filter }) : null;
        return body;
    }
}