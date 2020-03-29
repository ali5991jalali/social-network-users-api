// Packages
const { expect } = require('chai');
const jwt = require('jsonwebtoken');

// Functions
const { requestToService, generateRandomString } = require('./../help/functions')

// configs
const { containerId, SECRET_KEY, deleteId } = require('./../help/configs')


describe('Test sending all needed params', () => {
    it('test sending required params', async () => {
        try {
            const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
            const result = await requestToService('DELETE', `/${deleteId}`, true, authorization, 200, true)
            return true
        } catch (error) {
            throw Error(error)
            return
        }
    })
})