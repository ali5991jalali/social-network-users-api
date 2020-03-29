// Packages
const { expect } = require('chai');
const jwt = require('jsonwebtoken');

// Functions
const { requestToService, generateRandomString } = require('./../help/functions')

// configs
const { containerId, SECRET_KEY, userId } = require('./../help/configs')

describe('Test sening all params and get needed params',()=>{
    it('test sending all required params',async ()=>{
        const data = {
            name: generateRandomString(5),
            email: `${generateRandomString(5)}.${generateRandomString(3)}@test.io`,
            type: 1
        }
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('PUT', `/${userId}`, data, authorization, 200, true)
            expect(result).have.to.have.property('data');
            expect(result.data).have.to.be.an('object')
            expect(result.data).have.to.have.property('_id')
            expect(result.data).have.to.have.property('name')
            expect(result.data).have.to.have.property('email')
            expect(result.data).have.to.have.property('type')
            expect(result.data.name).have.to.equal(data['name'])
            expect(result.data.email).have.to.equal(data['email'])   
            expect(result.data.type).have.to.equal(data['type'])         
            return true;
        } catch (error) {
            throw Error(error)
            return
        }
    })
    it('test updating inner data',async ()=>{
        const data = {
            name: generateRandomString(5),
            online: false,
            phone:09032112028
        }
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('PUT', `/${userId}?fields=_id,name,online,phone`, data, authorization, 200, true)
            expect(result).have.to.have.property('data');
            expect(result.data).have.to.be.an('object')
            expect(result.data).have.to.have.property('_id')
            expect(result.data).have.to.have.property('name')
            expect(result.data).have.to.have.property('online')
            expect(result.data).have.to.have.property('phone')
            expect(result.data.isEmailVerified).have.to.equal(data['name'])
            expect(result.data.online).have.to.equal(data['online'])
            expect(result.data.language).have.to.equal(data['phone'])           
            return true;
        } catch (error) {
            throw Error(error)
            return
        }
    })
})