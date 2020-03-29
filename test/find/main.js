// Packages
const { expect } = require('chai')
const jwt = require('jsonwebtoken')

// Functions
const { requestToService, generateRandomString } = require('./../help/functions')

// configs
const { containerId, SECRET_KEY } = require('./../help/configs')

describe('Test sending all params', () => {
    it('test all params', async () => {
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try{
            const result = await requestToService('GET', '/?fields=_id,name,email&createdAtFrom=2019-01-01& createdAtTo=2019-10-10&limit=1&skip=1', true, authorization, 200, true)
            return true
        }catch(error){
            throw Error(error)
            return;
        }
    })
})