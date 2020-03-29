// Packages
const { expect } = require('chai');
const jwt = require('jsonwebtoken');

// Functions
const { requestToService, generateRandomString } = require('./../help/functions')

// configs
const { containerId, SECRET_KEY, userId,notFoundId } = require('./../help/configs')


describe('Test sending wrong Id in params', () => {
    it('test sending invalid id', async () => {
        try {
            const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
            const result = await requestToService('DELETE', `/wrongId`, true, authorization, 422, false)
            expect(result).have.to.have.property('error')
            expect(result.error).have.to.have.property('code')
            expect(result.error.code).have.to.equal(2)
            return true
        } catch (error) {
            throw Error(error)
            return
        }
    })
})


describe('Test not found Id', () => {
    it('test sending id not exist id', async () => {
        try{
            const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
            const result = await requestToService('DELETE', `/${notFoundId}`, true, authorization, 404, false)
            expect(result).have.to.have.property('error')
            expect(result.error).have.to.have.property('code')
            expect(result.error.code).have.to.equal(4)
            return true          

        }catch(error){
            throw Error(error)
            return
        }
    })
})