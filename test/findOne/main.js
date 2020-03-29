// Packages
const { expect } = require('chai');
const jwt = require('jsonwebtoken');

// Functions
const { requestToService, generateRandomString } = require('./../help/functions')

// configs
const { containerId, SECRET_KEY, userId } = require('./../help/configs')


describe('Test sending all needed params', () => {
    it('test sending required params', async () => {
        try {
            const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
            const result = await requestToService('GET', `/${userId}?fields=_id,name,email,type,online`, true, authorization, 200, true)
            expect(result).have.to.have.property('data')
            expect(result.data).has.to.be.an('object')
            expect(result.data).have.to.have.property('_id')
            expect(result.data).have.to.have.property('name')
            expect(result.data).have.to.have.property('email')
            expect(result.data).have.to.have.property('online')
            expect(result.data).have.to.have.property('type')
            return true
        } catch (error) {
            throw Error(error)
            return
        }
    })
})