// Packages
const fs = require('fs')
const multer = require('multer')

// Configs
const { paramValidation, dataConverts, mimetypes, notes, tags, statistic } = require('./config')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, mimetypes[file.mimetype].address)
    }
})
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if (mimetypes[file.mimetype] === undefined) {
            callback(null, false)
        } else {
            callback(null, true)
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024
    }
}).single('import')

// Functions
const { checkValidation, responseCreator, convertData } = require('./../functions/global')


module.exports = {
    // Find by query
    find(req, res, next) {
        let { success, code } = checkValidation(req, paramValidation.find)
        if (!success) {
            return res.status(422).send(responseCreator(code))
        }
        req.query = convertData(req.query, dataConverts.find)
        next();
    },
    // Create new documnet
    create(req, res, next) {
        console.log
        let { success, code } = checkValidation(req, paramValidation.create)
        if (!success) {
            return res.status(422).send(responseCreator(code))
        }
        req.body = convertData(req.body, dataConverts.create);
        next();
    },
    // Update document by id
    update(req, res, next) {
        let { success, code } = checkValidation(req, paramValidation.update)
        if (!success) {
            return res.status(422).send(responseCreator(code))
        }
        req.body = convertData(req.body, dataConverts.update);
        next();
    },
    // Find by id
    findOne(req, res, next) {
        let { success, code } = checkValidation(req, paramValidation.findOne)
        if (!success) {
            return res.status(422).send(responseCreator(code))
        }
        next();
    },
    // Delete by id
    remove(req, res, next) {
        let { success, code } = checkValidation(req, paramValidation.remove)
        if (!success) {
            return res.status(422).send(responseCreator(code))
        }
        next();
    },
    // Find note by query
    findNote(req, res, next) {
        let { success, code } = checkValidation(req, notes.paramValidation.find)
        if (!success) {
            return res.status(422).send(responseCreator(code))
        }
        next();
    },
    // Create note new documnet
    createNote(req, res, next) {
        console.log(req.body)
        let { success, code } = checkValidation(req, notes.paramValidation.create)
        if (!success) {
            return res.status(422).send(responseCreator(code))
        }
        next();
    },
    // Update note document by id
    updateNote(req, res, next) {
        let { success, code } = checkValidation(req, notes.paramValidation.update)
        if (!success) {
            return res.status(422).send(responseCreator(code))
        }
        next();
    },
    // Find note by id
    findOneNote(req, res, next) {
        let { success, code } = checkValidation(req, notes.paramValidation.findOne)
        if (!success) {
            return res.status(422).send(responseCreator(code))
        }
        next();
    },
    // Delete note by id
    removeNote(req, res, next) {
        let { success, code } = checkValidation(req, notes.paramValidation.remove)
        if (!success) {
            return res.status(422).send(responseCreator(code))
        }
        next();
    },
    // Find tag by query
    findTag(req, res, next) {
        let { success, code } = checkValidation(req, tags.paramValidation.find)
        if (!success) {
            return res.status(422).send(responseCreator(code))
        }
        next();
    },
    // Create new tag
    createTag(req, res, next) {
        console.log(req.body)
        let { success, code } = checkValidation(req, tags.paramValidation.create)
        if (!success) {
            return res.status(422).send(responseCreator(code))
        }
        next();
    },
    // Update tag by id
    updateTag(req, res, next) {
        let { success, code } = checkValidation(req, tags.paramValidation.update)
        if (!success) {
            return res.status(422).send(responseCreator(code))
        }
        next();
    },
    // Find tag by id
    findOneTag(req, res, next) {
        let { success, code } = checkValidation(req, tags.paramValidation.findOne)
        if (!success) {
            return res.status(422).send(responseCreator(code))
        }
        next();
    },
    // Delete tag by id
    removeTag(req, res, next) {
        let { success, code } = checkValidation(req, tags.paramValidation.remove)
        if (!success) {
            return res.status(422).send(responseCreator(code))
        }
        next();
    },
    findStatistic(req, res, next) {
        let { success, code } = checkValidation(req, statistic.paramValidation.find)
        if (!success) {
            return res.status(422).send(responseCreator(code))
        }
        next();
    },
    findOneStatistic(req, res, next) {
        let { success, code } = checkValidation(req, statistic.paramValidation.findOne)
        if (!success) {
            return res.status(422).send(responseCreator(code))
        }
        next();
    },
    // import
    import(req, res, next) {
        console.log(req.form)
        upload(req, res, function (err) {
            if (err || err instanceof multer.MulterError) {
                return res.status(422).send(responseCreator(2))
            }
            if (req.file === undefined) {
                return res.status(422).send(responseCreator(2))
            }
            if (req.file.size > mimetypes[req.file.mimetype].size * 1024 * 1024) {
                fs.unlinkSync(`${mimetypes[req.file.mimetype].address}/${req.file.filename}`)
                return res.status(422).send(responseCreator(2))
            }
            const { channelId, type } = req.body
            let datas = { body: {} }
            channelId ? Object.assign(datas.body, { channelId }) : false
            type ? Object.assign(datas.body, { type }) : false
            let { success, code } = checkValidation(datas, paramValidation.import)
            if (!success) {
                fs.unlinkSync(`${mimetypes[req.file.mimetype].address}/${req.file.filename}`)
                return res.status(422).send(responseCreator(code))
            }
            next();
        })
    },
    // Add code to database
    login(req, res, next) {
        console.log(req.headers)
        let { success, code } = checkValidation(req, paramValidation.login)
        if (!success) {
            return res.status(422).send(responseCreator(code))
        }
        next();
    },
    // Remove code from database
    logout(req, res, next) {
        let { success, code } = checkValidation(req, paramValidation.logout)
        if (!success) {
            return res.status(422).send(responseCreator(code))
        }
        next();
    },
    // Find count of data for each condition
    count(req, res, next) {
        let { success, code } = checkValidation(req, paramValidation.count)
        if (!success) {
            return res.status(422).send(responseCreator(code))
        }
        req.query = convertData(req.query, dataConverts.count)
        next();
    }
}