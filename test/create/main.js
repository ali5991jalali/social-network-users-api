// Packages
const { expect } = require('chai');
const jwt = require('jsonwebtoken');

// Functions
const { requestToService, generateRandomString } = require('./../help/functions')

// configs
const { containerId, SECRET_KEY } = require('./../help/configs')

describe('Test sending everything okay',()=>{
    it('Test sending everything okay',async ()=>{
        const data = {
            name: generateRandomString(5),
            email: `${generateRandomString(5)}.${generateRandomString(3)}@test.io`,
            type: 1
        }
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('POST', '/', data, authorization, 200, true)
            expect(result).have.to.have.property('data');
            expect(result.data).have.to.have.property('_id')
            expect(result.data).have.to.have.property('name')
            expect(result.data).have.to.have.property('email')
            expect(result.data).have.to.have.property('type')
            return true;
        } catch (error) {
            throw Error(error)
            return
        }
    })
})