// Packages
const { expect } = require('chai');
const jwt = require('jsonwebtoken');

// Functions
const { requestToService, generateRandomString } = require('./../help/functions')

// configs
const { containerId, SECRET_KEY, userId, notFoundId } = require('./../help/configs')


describe('Test sending invalid params', () => {

    it('test sending wrong email', async () => {
        const data = {
            name: generateRandomString(5),
            email: `${generateRandomString(5)}.${generateRandomString(3)}`,
            type: 1
        }
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('PUT', `/${userId}`, data, authorization, 422, false)
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
            result = await requestToService('PUT', `/${userId}`, data, authorization, 422, false)
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
            result = await requestToService('PUT', `/${userId}`, data, authorization, 422, false)
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
            result = await requestToService('PUT', `/${userId}`, data, authorization, 422, false)
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
            result = await requestToService('PUT', `/${userId}`, data, authorization, 422, false)
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
            result = await requestToService('PUT', `/${userId}`, data, authorization, 422, false)
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

    it('test seinding wrong conversationId', async () => {
        const data = {
            name: generateRandomString(5),
            email: `${generateRandomString(5)}.${generateRandomString(3)}@test.io`,
            type: 1,
            conversationId: generateRandomString(10)
        }
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('PUT', `/${userId}`, data, authorization, 422, false)
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

    it('test seinding wrong live', async () => {
        const data = {
            name: generateRandomString(5),
            email: `${generateRandomString(5)}.${generateRandomString(3)}@test.io`,
            type: 1,
            live: generateRandomString(5)
        }
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('PUT', `/${userId}`, data, authorization, 422, false)
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
            result = await requestToService('PUT', `/${userId}?fields=_id,name,email,createdAt`, data, authorization, 200, true)
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
            result = await requestToService('PUT', `/${agentId}?fields=_id,name,email,updatedAt`, data, authorization, 200, true)
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
            result = await requestToService('PUT', `/${agentId}?fields=_id,name,email,meta`, data, authorization, 200, true)
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




describe('Test sending wrong Id in params', () => {
    it('test sending invalid id', async () => {
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            const result = await requestToService('PUT', '/wrongId', true, authorization, 422, false);
            expect(result).have.to.have.property('error')
            expect(result.error).have.to.have.property('code')
            expect(result.error).have.to.have.property('message')
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
        try {
            const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
            const result = await requestToService('PUT', `/${notFoundId}`, true, authorization, 404, false)
            expect(result).have.to.have.property('error')
            expect(result.error).have.to.have.property('code')
            expect(result.error.code).have.to.equal(4)
            return true

        } catch (error) {
            throw Error(error)
            return
        }
    })
})