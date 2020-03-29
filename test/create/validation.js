// Packages
const { expect } = require('chai');
const jwt = require('jsonwebtoken');

// Functions
const { requestToService, generateRandomString } = require('./../help/functions')

// configs
const { containerId, SECRET_KEY } = require('./../help/configs')


describe('Test sending invalid params', () => {

    it('test sending wrong email', async () => {
        const data = {
            name: generateRandomString(5),
            email: `${generateRandomString(5)}.${generateRandomString(3)}`,
            type: 1
        }
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('POST', '/', data, authorization, 422, false)
            expect(result).have.to.have.property('error');
            expect(result.error).have.to.have.property('code')
            expect(result.error).have.to.have.property('message')
            expect(result.error.code).have.to.equal(2)
            return true;
        } catch (error) {
            throw Error(error)
            return
        }
    })

    it('test seinding wrong type', async () => {
        const data = {
            name: generateRandomString(5),
            email: `${generateRandomString(5)}.${generateRandomString(3)}@test.io`,
            type: 3
        }
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('POST', '/', data, authorization, 422, false)
            expect(result).have.to.have.property('error');
            expect(result.error).have.to.have.property('code')
            expect(result.error).have.to.have.property('message')
            expect(result.error.code).have.to.equal(2)
            return true;
        } catch (error) {
            throw Error(error)
            return
        }
    })

    it('test seinding wrong phone(string)', async () => {
        const data = {
            name: generateRandomString(5),
            email: `${generateRandomString(5)}.${generateRandomString(3)}@test.io`,
            type: 1,
            phone: generateRandomString(10)
        }
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('POST', '/', data, authorization, 422, false)
            expect(result).have.to.have.property('error');
            expect(result.error).have.to.have.property('code')
            expect(result.error).have.to.have.property('message')
            expect(result.error.code).have.to.equal(2)
            return true;
        } catch (error) {
            throw Error(error)
            return
        }
    })

    it('test seinding wrong phone(not in correct pattern)', async () => {
        const data = {
            name: generateRandomString(5),
            email: `${generateRandomString(5)}.${generateRandomString(3)}@test.io`,
            type: 1,
            phone: 090321120
        }
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('POST', '/', data, authorization, 422, false)
            expect(result).have.to.have.property('error');
            expect(result.error).have.to.have.property('code')
            expect(result.error).have.to.have.property('message')
            expect(result.error.code).have.to.equal(2)
            return true;
        } catch (error) {
            throw Error(error)
            return
        }
    })

    it('test seinding wrong hidden', async () => {
        const data = {
            name: generateRandomString(5),
            email: `${generateRandomString(5)}.${generateRandomString(3)}@test.io`,
            type: 1,
            hidden: 3
        }
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('POST', '/', data, authorization, 422, false)
            expect(result).have.to.have.property('error');
            expect(result.error).have.to.have.property('code')
            expect(result.error).have.to.have.property('message')
            expect(result.error.code).have.to.equal(2)
            return true;
        } catch (error) {
            throw Error(error)
            return
        }
    })

    it('test seinding wrong channelId', async () => {
        const data = {
            name: generateRandomString(5),
            email: `${generateRandomString(5)}.${generateRandomString(3)}@test.io`,
            type: 1,
            channelId: generateRandomString(10)
        }
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('POST', '/', data, authorization, 422, false)
            expect(result).have.to.have.property('error');
            expect(result.error).have.to.have.property('code')
            expect(result.error).have.to.have.property('message')
            expect(result.error.code).have.to.equal(2)
            return true;
        } catch (error) {
            throw Error(error)
            return
        }
    })

    it('test seinding wrong coonversationId', async () => {
        const data = {
            name: generateRandomString(5),
            email: `${generateRandomString(5)}.${generateRandomString(3)}@test.io`,
            type: 1,
            conversationId: generateRandomString(10)
        }
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('POST', '/', data, authorization, 422, false)
            expect(result).have.to.have.property('error');
            expect(result.error).have.to.have.property('code')
            expect(result.error).have.to.have.property('message')
            expect(result.error.code).have.to.equal(2)
            return true;
        } catch (error) {
            throw Error(error)
            return
        }
    })
})


describe('test sending illegal keys for response fields', () => {

    it('test sending createdAt in fields', async () => {
        const data = {
            name: generateRandomString(5),
            email: `${generateRandomString(5)}.${generateRandomString(3)}@test.io`,
            type: 1
        }
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('POST', '/?fields=_id,name,email,createdAt', data, authorization, 200, true)
            expect(result).have.to.have.property('data');
            expect(result.data).have.to.have.property('_id')
            expect(result.data).have.to.have.property('name')
            expect(result.data).have.to.have.property('email')
            expect(result.data).not.to.have.property('createdAt')
            return true;
        } catch (error) {
            throw Error(error)
            return
        }

    })
    it('test sending updatedAt in fields', async () => {
        const data = {
            name: generateRandomString(5),
            email: `${generateRandomString(5)}.${generateRandomString(3)}@test.io`,
            type: 1
        }
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('POST', '/?fields=_id,name,email,updatedAt', data, authorization, 200, true)
            expect(result).have.to.have.property('data');
            expect(result.data).have.to.have.property('_id')
            expect(result.data).have.to.have.property('name')
            expect(result.data).have.to.have.property('email')
            expect(result.data).not.to.have.property('updatedAt')
            return true;
        } catch (error) {
            throw Error(error)
            return
        }
    })
    it('test sending meta in fields', async () => {
        const data = {
            name: generateRandomString(5),
            email: `${generateRandomString(5)}.${generateRandomString(3)}@test.io`,
            type: 1
        }
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('POST', '/?fields=_id,name,email,meta', data, authorization, 200, true)
            expect(result).have.to.have.property('data');
            expect(result.data).have.to.have.property('_id')
            expect(result.data).have.to.have.property('name')
            expect(result.data).have.to.have.property('email')
            expect(result.data).not.to.have.property('meta')
            return true;
        } catch (error) {
            throw Error(error)
            return
        }
    })
})


describe('Test getting unKnown key in fields', () => {
    it('Test getting unKnown key in fields', async () => {
        const data = {
            name: generateRandomString(5),
            email: `${generateRandomString(5)}.${generateRandomString(3)}@test.io`,
            type: 1
        }
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('POST', '/?fields=_id,name,email,unknown', data, authorization, 200, true)
            expect(result).have.to.have.property('data');
            expect(result.data).have.to.have.property('_id')
            expect(result.data).have.to.have.property('name')
            expect(result.data).have.to.have.property('email')
            expect(result.data).not.to.have.property('unknown')
            return true;
        } catch (error) {
            throw Error(error)
            return
        }
    })
})


describe('Test sending unKnown key in query', () => {
    it('Test sending unKnown key in query', async () => {
        const data = {
            name: generateRandomString(5),
            email: `${generateRandomString(5)}.${generateRandomString(3)}@test.io`,
            type: 1
        }
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('POST', '/?fields=_id,name,email&unkonwnString=unknown', data, authorization, 200, true)
            expect(result).have.to.have.property('data');
            expect(result.data).have.to.have.property('_id')
            expect(result.data).have.to.have.property('name')
            expect(result.data).have.to.have.property('email')
            return true;
        } catch (error) {
            throw Error(error)
            return
        }
    })
})

describe('Test not sending any key for fields', () => {
    it('Test not sending any key for fields', async () => {
        const data = {
            name: generateRandomString(5),
            email: `${generateRandomString(5)}.${generateRandomString(3)}@test.io`,
            password: generateRandomString(4),
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


describe('Test getting inner fields in profile', () => {
    it('Test getting inner fields in profile', async () => {
        const data = {
            phone: 09032112028,
            avatar: `${generateRandomString(20)}`,
            title: generateRandomString(4)
        }
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('POST', '/?fields=phone,avatar,title,online', data, authorization, 200, true)
            expect(result).have.to.have.property('data');
            expect(result.data).have.to.have.property('phone')
            expect(result.data).have.to.have.property('avatar')
            expect(result.data).have.to.have.property('title')
            expect(result.data).have.to.have.property('online')
            return true;
        } catch (error) {
            throw Error(error)
            return
        }
    })
})
