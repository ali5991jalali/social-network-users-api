// Packages
const express = require('express')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const validator = require('validator')

// // Connect project to apm
// var apm = require('elastic-apm-node').start({
//     serviceName: 'raychat-users',
//     serverUrl: 'http://45.92.95.83:8200'
// })

// Set env
dotenv.config();

// Functions
const { serverSetting, Connections, responseCreator } = require('./functions/global')
const { checkCodeExistance } = require('./functions/redis')


// Controllers
const raychatController = require('./controllers/raychat')
const { errorhandler, authorization, checkDB } = require('./controllers/index')
const { createIndex, createNoteIndex, createTagIndex, createStatisticIndex } = require('./functions/elastic')

// Validator
const raychatValidator = require('./configs/paramValidation')

// app settings
const app = serverSetting(express())

// Connections to server port and databases
Connections(app)

// create index in elasticsearch
createIndex()
createNoteIndex()
createTagIndex()
createStatisticIndex()

// Routes don't need authorization
app.post('/login', raychatValidator.login, raychatController.login)
app.post('/logout', raychatValidator.logout, raychatController.logout)

// Middlewares
app.use(authorization)
app.use(checkDB)

// Note routes
app
    // Find note by query
    .get('/notes', raychatValidator.findNote, raychatController.findNote)
    // Create note new document
    .post('/notes/', raychatValidator.createNote, raychatController.createNote)
    // Find note by id
    .get('/notes/:id', raychatValidator.findOneNote, raychatController.findOneNote)
    // Update note document by id
    .put('/notes/:id', raychatValidator.updateNote, raychatController.updateNote)
    // Delete note document by id
    .delete('/notes/:id', raychatValidator.removeNote, raychatController.removeNote)

// Tag routes
app
    // Find tag by query
    .get('/tags', raychatValidator.findTag, raychatController.findTag)
    // Create tag
    .post('/tags/', raychatValidator.createTag, raychatController.createTag)
    // Find tag by id
    .get('/tags/:id', raychatValidator.findOneTag, raychatController.findOneTag)
    // Update tag by id
    .put('/tags/:id', raychatValidator.updateTag, raychatController.updateTag)
    // Delete tag by id
    .delete('/tags/:id', raychatValidator.removeTag, raychatController.removeTag)

// Tag routes
app
    // Find tag by query
    .get('/statistic', raychatValidator.findStatistic, raychatController.findStatistic)
    // Find tag by id
    .get('/statistic/:id', raychatValidator.findOneStatistic, raychatController.findOneStatistic)

// Routes
app
    // Find count of data
    .get('/count', raychatValidator.count, raychatController.count)
    // Find by query
    .get('/', raychatValidator.find, raychatController.find)
    // Create new document
    .post('/', raychatValidator.create, raychatController.create)
    // Find by id
    .get('/:id', raychatValidator.findOne, raychatController.findOne)
    // Update document by id
    .put('/:id', raychatValidator.update, raychatController.update)
    // Delete document by id
    .delete('/:id', raychatValidator.remove, raychatController.remove)
    // Import file
    .post('/import', raychatValidator.import, raychatController.import)

// Handling error for routes not available in project    
app.use(errorhandler)
