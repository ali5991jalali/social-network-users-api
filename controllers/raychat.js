// Packages
const bcrypt = require('bcryptjs');
const elasticSearch = require('elasticsearch');
const csv = require('csvtojson');
const fs = require('fs');

// Functions
const { responseCreator, getKeys, findKeys, catchError, makeKeysFromFields, selectFields, socketRequest } = require('./../functions/global');
const { makeInitialMongoOption, makeInitialMongoWhere, makeMongoUpadteQuery, makeInitialMongoWhereCount } = require('./../functions/mongo');
const { checkElasticConnection, makeElasticQuery, makeElasticUpdateQuery, makeElasticQueryResult, makeElasticQueryCount } = require('./../functions/elastic');
const { setKeyInRedis, removeKeyFromRedis } = require('./../functions/redis');

// Configs
const { responseKeys, dataKeys, queryKeys, illegalResponseKeys, illegalQueryKeys, syncData: syncDataConfig, mimetypes, notes, tags, statistic } = require('./../configs/config')

// Models
const Raychat = require('./../models/raychat')
const Notes = require('./../models/notes')
const Tags = require('./../models/tags')
const Statistic = require('./../models/statistic')

// Elastic Client
const client = new elasticSearch.Client({
    host: process.env.ELASTICADDRESS,
    log: 'error'
});

module.exports = {
    // Find by query
    async find(req, res) {
        try {
            const elasticConnection = await checkElasticConnection();
            const body = await makeElasticQuery(req.query, illegalQueryKeys, dataKeys)
            console.log(body.query.bool.must)
            body.query.bool.must.push({
                match: {
                    'containerId': (req.user.containerId)
                }
            })
            const result = await client.search({
                index: 'raychat-users',
                type: '_doc',
                body
            })
            return res.status(200).send(responseCreator(200, getKeys(makeElasticQueryResult(result), makeKeysFromFields(req.query, responseKeys.find), dataKeys, illegalResponseKeys.find)))
        } catch (esError) {
            console.log(esError.message)
            try {
                const where = makeInitialMongoWhere(req.query, illegalQueryKeys);
                const options = makeInitialMongoOption(req.query);
                Object.assign(where, {
                    containerId: (req.user.containerId)
                })
                const result = await Raychat.paginate(where, options);
                return res.status(200).send(responseCreator(200, getKeys(result.docs, makeKeysFromFields(req.query, responseKeys.find), dataKeys, illegalResponseKeys.find)))
            } catch (error) {
                console.log(error.message)
                const { status, result } = catchError(error.message);
                return res.status(status).send(result)
            }
        }
    },
    // Create new documnet
    async create(req, res) {
        console.log('req.body', req.body)
        const data = findKeys(req.body, ['name', 'email', 'type', 'channelId', 'options', 'tags', 'notes', 'status'])
        Object.assign(data, {
            meta: findKeys(req.body, ['phone', 'avatar', 'title', 'location', 'browser', 'online', 'lastPage'])
        },
            {
                containerId: (req.user.containerId)
            }
        )
        if (req.body.conversationId) {
            data['conversationId'] = [(req.body.conversationId)]
        }
        (Object.keys(data.meta)).includes('online') == false ? data['meta']['online'] = false : null;
        try {
            const elasticConnection = await checkElasticConnection();
            const newData = await Raychat.create(data);
            console.log(newData)
            const { _id, __v, ...elasticData } = newData._doc
            const newElasticData = await client.create({
                index: 'raychat-users',
                type: '_doc',
                id: String(_id),
                body: elasticData
            })
            socketRequest('newUser', getKeys(newData, makeKeysFromFields(req.query, responseKeys.create), dataKeys, illegalResponseKeys.create))
            return res.status(200).send(responseCreator(200, getKeys(newData, makeKeysFromFields(req.query, responseKeys.create), dataKeys, illegalResponseKeys.create)))
        } catch (error) {
            console.log(error.message)
            const { status, result } = catchError(error.message);
            return res.status(status).send(result)
        }
    },
    // Update documnet by id
    async update(req, res) {
        try {
            const elasticConnection = await checkElasticConnection();
            const update = makeMongoUpadteQuery(req.body, ['name', 'email', 'type', 'status', 'tags', 'notes', 'location', 'browser', 'online', 'avatar', 'phone', 'lastPage', 'options'], dataKeys)
            if (req.body.conversationId) {
                update['$addToSet'] = {
                    conversationId: (req.body.conversationId)
                }
            }
            console.log(update)
            const updated = await Raychat.findOneAndUpdate({ _id: (req.params.id), 'containerId': (req.user.containerId) }, update, { new: true });
            if (!updated) {
                return res.status(404).send(responseCreator(4))
            }
            const { _id, __v, ...elasticUpdate } = updated._doc;
            const elasticUpdated = await client.update({
                index: 'raychat-users',
                type: '_doc',
                id: (req.params.id),
                body: {
                    "doc": elasticUpdate
                }
            })
            if (Object.keys(update).includes('online')) {
                if (!update['online']) {
                    socketRequest('leftUser', getKeys(updated, makeKeysFromFields(req.query, responseKeys.update), dataKeys, illegalResponseKeys.update))
                } else {
                    socketRequest('newUser', getKeys(updated, makeKeysFromFields(req.query, responseKeys.update), dataKeys, illegalResponseKeys.update))
                }
            } else {
                socketRequest('userInformation', getKeys(updated, makeKeysFromFields(req.query, responseKeys.update), dataKeys, illegalResponseKeys.update))
            }
            return res.status(200).send(responseCreator(200, getKeys(updated, makeKeysFromFields(req.query, responseKeys.update), dataKeys, illegalResponseKeys.update)))
        } catch (error) {
            console.log(error)
            const { status, result } = catchError(error.message);
            return res.status(status).send(result)
        }
    },
    // Find by id
    async findOne(req, res) {
        try {
            const elasticConnection = await checkElasticConnection();
            const elasticData = await client.search({
                index: 'raychat-users',
                type: '_doc',
                body: {
                    query: {
                        bool: {
                            must: [
                                {
                                    match: {
                                        _id: (req.params.id)
                                    }
                                },
                                {
                                    match: {
                                        'containerId': (req.user.containerId)
                                    }
                                }
                            ]
                        }
                    }
                }
            })
            if ((elasticData.hits.hits).length == 0) {
                return res.status(404).send(responseCreator(4))
            }
            const data = (makeElasticQueryResult(elasticData))[0]
            return res.status(200).send(responseCreator(200, getKeys(data, makeKeysFromFields(req.query, responseKeys.findOne), dataKeys, illegalResponseKeys.findOne)))
        } catch (esError) {
            console.log(esError.message)
            try {
                const data = await Raychat.findOne({ _id: (req.params.id), 'containerId': (req.user.containerId) })
                if (!data) {
                    return res.status(404).send(responseCreator(4))
                }
                return res.status(200).send(responseCreator(200, getKeys(data, makeKeysFromFields(req.query, responseKeys.findOne), dataKeys, illegalResponseKeys.findOne)))
            } catch (error) {
                console.log(error.message)
                const { status, result } = catchError(error.message);
                return res.status(status).send(result)
            }
        }
    },
    // Delete by id
    async remove(req, res) {
        try {
            const elasticConnection = await checkElasticConnection();
            const deleted = await Raychat.deleteOne({ _id: (req.params.id), 'containerId': (req.user.containerId) })
            if (!deleted['n']) {
                return res.status(404).send(responseCreator(4))
            }
            const elasticDeleted = await client.delete({
                index: 'raychat-users',
                type: '_doc',
                id: (req.params.id)
            })
            return res.status(200).send({ success: true })
        } catch (error) {
            console.log(error.message)
            return res.status(500).send(responseCreator(3))
        }
    },
    // Find note by query
    async findNote(req, res) {
        try {
            const elasticConnection = await checkElasticConnection();
            const body = await makeElasticQuery(req.query, notes.illegalQueryKeys, notes.dataKeys)
            body.query.bool.must.push({
                match: {
                    'containerId': (req.user.containerId)
                }
            })
            const result = await client.search({
                index: 'raychat-notes',
                type: '_doc',
                body
            })
            return res.status(200).send(responseCreator(200, getKeys(makeElasticQueryResult(result), makeKeysFromFields(req.query, notes.responseKeys.find), notes.dataKeys, notes.illegalResponseKeys.find)))
        } catch (esError) {
            console.log(esError.message)
            try {
                const where = makeInitialMongoWhere(req.query, notes.illegalQueryKeys);
                const options = makeInitialMongoOption(req.query);
                Object.assign(where, {
                    containerId: (req.user.containerId)
                })
                const result = await Notes.paginate(where, options);
                return res.status(200).send(responseCreator(200, getKeys(result.docs, makeKeysFromFields(req.query, notes.responseKeys.find), notes.dataKeys, notes.illegalResponseKeys.find)))
            } catch (error) {
                console.log(error.message)
                const { status, result } = catchError(error.message);
                return res.status(status).send(result)
            }
        }
    },
    // Create note new documnet
    async createNote(req, res) {
        const data = findKeys(req.body, ['userId', 'agentId', 'text', 'url', 'channelId'])
        Object.assign(data,
            {
                containerId: (req.user.containerId)
            }
        )
        try {
            const elasticConnection = await checkElasticConnection();
            const newData = await Notes.create(data);
            console.log(newData)
            const { _id, __v, ...elasticData } = newData._doc
            const newElasticData = await client.create({
                index: 'raychat-notes',
                type: '_doc',
                id: String(_id),
                body: elasticData
            })
            return res.status(200).send(responseCreator(200, getKeys(newData, makeKeysFromFields(req.query, notes.responseKeys.create), notes.dataKeys, notes.illegalResponseKeys.create)))
        } catch (error) {
            console.log(error.message)
            const { status, result } = catchError(error.message);
            return res.status(status).send(result)
        }
    },
    // Update note documnet by id
    async updateNote(req, res) {
        try {
            const elasticConnection = await checkElasticConnection();
            const update = makeMongoUpadteQuery(req.body, ['text', 'url'], notes.dataKeys)
            const updated = await Notes.findOneAndUpdate({ _id: (req.params.id), 'containerId': (req.user.containerId) }, update, { new: true });
            if (!updated) {
                return res.status(404).send(responseCreator(4))
            }
            const { _id, __v, ...elasticUpdate } = updated._doc;
            const elasticUpdated = await client.update({
                index: 'raychat-notes',
                type: '_doc',
                id: (req.params.id),
                body: {
                    "doc": elasticUpdate
                }
            })

            return res.status(200).send(responseCreator(200, getKeys(updated, makeKeysFromFields(req.query, notes.responseKeys.update), notes.dataKeys, notes.illegalResponseKeys.update
            )))
        } catch (error) {
            console.log(error.message)
            const { status, result } = catchError(error.message);
            return res.status(status).send(result)
        }
    },
    // Find note by id
    async findOneNote(req, res) {
        try {
            const elasticConnection = await checkElasticConnection();
            const elasticData = await client.search({
                index: 'raychat-notes',
                type: '_doc',
                body: {
                    query: {
                        bool: {
                            must: [
                                {
                                    match: {
                                        _id: (req.params.id)
                                    }
                                },
                                {
                                    match: {
                                        'containerId': (req.user.containerId)
                                    }
                                }
                            ]
                        }
                    }
                }
            })
            if ((elasticData.hits.hits).length == 0) {
                return res.status(404).send(responseCreator(4))
            }
            const data = (makeElasticQueryResult(elasticData))[0]
            return res.status(200).send(responseCreator(200, getKeys(data, makeKeysFromFields(req.query, notes.responseKeys.findOne), notes.dataKeys, notes.illegalResponseKeys.findOne)))
        } catch (esError) {
            console.log(esError.message)
            try {
                const data = await Notes.findOne({ _id: (req.params.id), 'containerId': (req.user.containerId) })
                if (!data) {
                    return res.status(404).send(responseCreator(4))
                }
                return res.status(200).send(responseCreator(200, getKeys(data, makeKeysFromFields(req.query, notes.responseKeys.findOne), notes.dataKeys, notes.illegalResponseKeys.findOne)))
            } catch (error) {
                console.log(error.message)
                const { status, result } = catchError(error.message);
                return res.status(status).send(result)
            }
        }
    },
    // Delete note by id
    async removeNote(req, res) {
        try {
            const elasticConnection = await checkElasticConnection();
            const deleted = await Notes.deleteOne({ _id: (req.params.id), 'containerId': (req.user.containerId) })
            if (!deleted['n']) {
                return res.status(404).send(responseCreator(4))
            }
            const elasticDeleted = await client.delete({
                index: 'raychat-notes',
                type: '_doc',
                id: (req.params.id)
            })
            return res.status(200).send({ success: true })
        } catch (error) {
            console.log(error.message)
            return res.status(500).send(responseCreator(3))
        }
    },



















    // Find tag 
    async findTag(req, res) {
        try {
            const elasticConnection = await checkElasticConnection();
            const body = await makeElasticQuery(req.query, tags.illegalQueryKeys, tags.dataKeys)
            body.query.bool.must.push({
                match: {
                    'containerId': (req.user.containerId)
                }
            })
            console.log(body.query.bool.must)
            const result = await client.search({
                index: 'raychat-tags',
                type: '_doc',
                body
            })
            return res.status(200).send(responseCreator(200, getKeys(makeElasticQueryResult(result), makeKeysFromFields(req.query, tags.responseKeys.find), tags.dataKeys, tags.illegalResponseKeys.find)))
        } catch (esError) {
            console.log(esError.message)
            try {
                const where = makeInitialMongoWhere(req.query, tags.illegalQueryKeys);
                const options = makeInitialMongoOption(req.query);
                Object.assign(where, {
                    containerId: (req.user.containerId)
                })
                const result = await Tags.paginate(where, options);
                return res.status(200).send(responseCreator(200, getKeys(result.docs, makeKeysFromFields(req.query, tags.responseKeys.find), tags.dataKeys, tags.illegalResponseKeys.find)))
            } catch (error) {
                console.log(error.message)
                const { status, result } = catchError(error.message);
                return res.status(status).send(result)
            }
        }
    },
    // Create tag 
    async createTag(req, res) {
        const data = findKeys(req.body, ['agentId', 'title', 'channelId', 'tc','isArchived'])
        Object.assign(data,
            {
                containerId: (req.user.containerId)
            }
        )
        try {
            const elasticConnection = await checkElasticConnection();
            if (!req.body.tc) {
                const lastTag = await Tags.findOne({ containerId: (req.user.containerId), channelId: (req.body.channelId), title: (req.body.title) })
                if (!lastTag) {
                    const colors = tags.tcColors;
                    data['tc'] = colors[Math.floor(Math.random() * colors.length)];
                } else {
                    data['tc'] = lastTag.tc;
                }
            }
            const newData = await Tags.create(data);
            console.log(newData)
            const { _id, __v, ...elasticData } = newData._doc
            const newElasticData = await client.create({
                index: 'raychat-tags',
                type: '_doc',
                id: String(_id),
                body: elasticData
            })
            return res.status(200).send(responseCreator(200, getKeys(newData, makeKeysFromFields(req.query, tags.responseKeys.create), tags.dataKeys, tags.illegalResponseKeys.create)))
        } catch (error) {
            console.log(error.message)
            const { status, result } = catchError(error.message);
            return res.status(status).send(result)
        }
    },
    // Update tag by id
    async updateTag(req, res) {
        try {
            const elasticConnection = await checkElasticConnection();
            const update = makeMongoUpadteQuery(req.body, ['title', 'bgc', 'tc', 'conversationCount', 'contactCount','isArchived'], tags.dataKeys)
            const updated = await Tags.findOneAndUpdate({ _id: (req.params.id), 'containerId': (req.user.containerId) }, update, { new: true });
            if (!updated) {
                return res.status(404).send(responseCreator(4))
            }
            const { _id, __v, ...elasticUpdate } = updated._doc;
            const elasticUpdated = await client.update({
                index: 'raychat-tags',
                type: '_doc',
                id: (req.params.id),
                body: {
                    "doc": elasticUpdate
                }
            })

            return res.status(200).send(responseCreator(200, getKeys(updated, makeKeysFromFields(req.query, tags.responseKeys.update), tags.dataKeys, tags.illegalResponseKeys.update)))
        } catch (error) {
            console.log(error.message)
            const { status, result } = catchError(error.message);
            return res.status(status).send(result)
        }
    },
    // Find tag by id
    async findOneTag(req, res) {
        try {
            const elasticConnection = await checkElasticConnection();
            const elasticData = await client.search({
                index: 'raychat-tags',
                type: '_doc',
                body: {
                    query: {
                        bool: {
                            must: [
                                {
                                    match: {
                                        _id: (req.params.id)
                                    }
                                },
                                {
                                    match: {
                                        'containerId': (req.user.containerId)
                                    }
                                }
                            ]
                        }
                    }
                }
            })
            if ((elasticData.hits.hits).length == 0) {
                return res.status(404).send(responseCreator(4))
            }
            const data = (makeElasticQueryResult(elasticData))[0]
            return res.status(200).send(responseCreator(200, getKeys(data, makeKeysFromFields(req.query, tags.responseKeys.findOne), tags.dataKeys, tags.illegalResponseKeys.findOne)))
        } catch (esError) {
            console.log(esError.message)
            try {
                const data = await Tags.findOne({ _id: (req.params.id), 'containerId': (req.user.containerId) })
                if (!data) {
                    return res.status(404).send(responseCreator(4))
                }
                return res.status(200).send(responseCreator(200, getKeys(data, makeKeysFromFields(req.query, tags.responseKeys.findOne), tags.dataKeys, tags.illegalResponseKeys.findOne)))
            } catch (error) {
                console.log(error.message)
                const { status, result } = catchError(error.message);
                return res.status(status).send(result)
            }
        }
    },
    // Delete tag by id
    async removeTag(req, res) {
        try {
            const elasticConnection = await checkElasticConnection();
            const deleted = await Tags.deleteOne({ _id: (req.params.id), 'containerId': (req.user.containerId) })
            if (!deleted['n']) {
                return res.status(404).send(responseCreator(4))
            }
            const elasticDeleted = await client.delete({
                index: 'raychat-tags',
                type: '_doc',
                id: (req.params.id)
            })
            return res.status(200).send({ success: true })
        } catch (error) {
            console.log(error.message)
            return res.status(500).send(responseCreator(3))
        }
    },
    /**
    * [method for create ] 
    * @param  {type:mongoId,request:token,required:true} containerId
    * @param  {type:mongoId,request:body,required:true} channelId
    * @param  {type:mongoId,request:file,required:true} file
    * @returns {status:200,respons:data} []
    */
    async import(req, res) {
        try {
            const
                { channelId, type } = req.body,
                { containerId } = req.body,//user
                { filename, mimetype } = req.file
            let data = { type, containerId, channelId }
            if (mimetypes[mimetype].type === 'json') {
                const file = await fs.readFileSync(`${mimetypes[mimetype].address}/${filename}`)
                Object.assign(data, {
                    typeFile: 'json',
                    fields: JSON.parse(file.toString())
                })
            } else {
                Object.assign(data, {
                    typeFile: 'csv',
                    fields: await csv().fromFile(`${mimetypes[mimetype].address}/${filename}`)
                })
            }
            fs.unlinkSync(`${mimetypes[mimetype].address}/${filename}`)
            module.exports.syncData(data)
            return res.status(200).send(responseCreator(200))
        } catch (err) {
            fs.unlinkSync(`${mimetypes[mimetype].address}/${filename}`)
            return res.status(500).send(responseCreator(0))
        }
    },

    // [method for sync-data]
    async syncData(data = {}) {
        const
            { fields, containerId, channelId, typeFile, type } = data,
            selectData = syncDataConfig[type],
            startSearch = typeFile === 'json' ? fields[selectData.json.index] : fields
        let syncData = { containerId, channelId }

        for (let resultItem of startSearch) {
            Object.assign(syncData, {
                meta: resultItem,
                name: selectFields(selectData, 'name', resultItem, typeFile),
                email: selectFields(selectData, 'email', resultItem, typeFile)
            })
            Raychat.create(syncData)
        }
    },
    // Add code to redis
    async login(req, res) {
        try {
            const { code, key } = req.body;
            if (!key || key != process.env.LOGIN_LOGOUT_SECRET_KEY) return res.status(403).send(responseCreator(11))
            await setKeyInRedis(code, true)
            return res.status(200).send({ success: true })
        } catch (error) {
            console.log(error)
            return res.status(500).send(responseCreator(3))
        }
    },
    // Remove code to redis
    async logout(req, res) {
        try {
            const { code, key } = req.body;
            if (!key || key != process.env.LOGIN_LOGOUT_SECRET_KEY) return res.status(403).send(responseCreator(11));
            await removeKeyFromRedis(code)
            return res.status(200).send({ success: true })
        } catch (error) {
            console.log(error)
            return res.status(500).send(responseCreator(3))
        }
    },
    async count(req, res) {
        console.log(req.query)
        try {
            const elasticConnection = await checkElasticConnection();
            const body = await makeElasticQueryCount(req.query, illegalQueryKeys);
            body.query.bool.must.push({
                match: {
                    'containerId': (req.user.containerId)
                }
            })
            const result = await client.count({
                index: 'raychat-users',
                type: '_doc',
                body
            })
            return res.status(200).send(responseCreator(200, { count: result.count }))
        } catch (esError) {
            console.log(esError.message)
            try {
                const where = makeInitialMongoWhereCount(req.query, illegalQueryKeys);
                Object.assign(where, {
                    containerId: (req.user.containerId)
                })
                const count = await Raychat.count(where);
                return res.status(200).send(responseCreator(200, { count }))
            } catch (error) {
                console.log(error.message)
                const { status, result } = catchError(error.message);
                return res.status(status).send(result)
            }
        }
    },
    async findStatistic(req, res) {
        try {
            const elasticConnection = await checkElasticConnection();
            const body = await makeElasticQuery(req.query, statistic.illegalQueryKeys, statistic.dataKeys)
            body.query.bool.must.push({
                match: {
                    'containerId': (req.user.containerId)
                }
            })
            const result = await client.search({
                index: 'raychat-users-statistic',
                type: '_doc',
                body
            })
            return res.status(200).send(responseCreator(200, getKeys(makeElasticQueryResult(result), makeKeysFromFields(req.query, statistic.responseKeys.find), statistic.dataKeys, statistic.illegalResponseKeys.find)))
        } catch (esError) {
            console.log(esError.message)
            try {
                const where = makeInitialMongoWhere(req.query, statistic.illegalQueryKeys);
                const options = makeInitialMongoOption(req.query);
                Object.assign(where, {
                    containerId: (req.user.containerId)
                })
                const result = await Statistic.paginate(where, options);
                return res.status(200).send(responseCreator(200, getKeys(result.docs, makeKeysFromFields(req.query, statistic.responseKeys.find), statistic.dataKeys, statistic.illegalResponseKeys.find)))
            } catch (error) {
                console.log(error.message)
                const { status, result } = catchError(error.message);
                return res.status(status).send(result)
            }
        }
    },
    async findOneStatistic(req, res) {
        try {
            const elasticConnection = await checkElasticConnection();
            const elasticData = await client.search({
                index: 'raychat-users-statistic',
                type: '_doc',
                body: {
                    query: {
                        bool: {
                            must: [
                                {
                                    match: {
                                        _id: (req.params.id)
                                    }
                                },
                                {
                                    match: {
                                        'containerId': (req.user.containerId)
                                    }
                                }
                            ]
                        }
                    }
                }
            })
            if ((elasticData.hits.hits).length == 0) {
                return res.status(404).send(responseCreator(4))
            }
            const data = (makeElasticQueryResult(elasticData))[0]
            return res.status(200).send(responseCreator(200, getKeys(data, makeKeysFromFields(req.query, statistic.responseKeys.findOne), statistic.dataKeys, statistic.illegalResponseKeys.findOne)))
        } catch (esError) {
            console.log(esError.message)
            try {
                const data = await Statistic.findOne({ _id: (req.params.id), 'containerId': (req.user.containerId) })
                if (!data) {
                    return res.status(404).send(responseCreator(4))
                }
                return res.status(200).send(responseCreator(200, getKeys(data, makeKeysFromFields(req.query, statistic.responseKeys.findOne), statistic.dataKeys, statistic.illegalResponseKeys.findOne)))
            } catch (error) {
                console.log(error.message)
                const { status, result } = catchError(error.message);
                return res.status(status).send(result)
            }
        }
    }
}


