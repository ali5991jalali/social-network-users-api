// Packages
const { expect } = require('chai')
const jwt = require('jsonwebtoken')

// Functions
const { requestToService, generateRandomString } = require('./../help/functions')

// configs
const { containerId, SECRET_KEY } = require('./../help/configs')

describe('Test sending wrong values in query', () => {
    it('test sening wrong limit', async () => {
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('GET', '/?limit=wrong', true, authorization, 422, false)
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

    it('test sening wrong skip', async () => {
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('GET', '/?skip=wrong', true, authorization, 422, false)
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

    it('test sening wrong email', async () => {
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('GET', '/?limit=10&skip=1&email=wrong', true, authorization, 422, false)
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

    it('test sening wrong type', async () => {
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('GET', '/?limit=10&skip=1&type=wrong', true, authorization, 422, false)
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

    it('test sening wrong createdAtFrom', async () => {
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('GET', '/?limit=10&skip=1&createdAtFrom=wrong', true, authorization, 422, false)
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

    it('test sening wrong updatedAtFrom', async () => {
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('GET', '/?limit=10&skip=1&updatedAtFrom=wrong', true, authorization, 422, false)
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

    it('test sening wrong createdAtTo', async () => {
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('GET', '/?limit=10&skip=1&createdAtTo=wrong', true, authorization, 422, false)
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

    it('test sening wrong updatedAtTo', async () => {
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('GET', '/?limit=10&skip=1&updatedAtTo=wrong', true, authorization, 422, false)
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

    it('test sening wrong createdAtFrom(wrong date)', async () => {
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('GET', '/?limit=10&skip=1&createdAtFrom=2019-00-0', true, authorization, 422, false)
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

    it('test sening wrong updatedAtFrom(wrong date)', async () => {
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('GET', '/?limit=10&skip=1&updatedAtFrom=2019-00-00', true, authorization, 422, false)
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

    it('test sening wrong createdAtTo(wrong date)', async () => {
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('GET', '/?limit=10&skip=1&createdAtTo=2019-03-00', true, authorization, 422, false)
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

    it('test sening wrong updatedAtTo(wrong date)', async () => {
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('GET', '/?limit=10&skip=1&updatedAtTo=2019-00-02', true, authorization, 422, false)
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

describe('Test seinding find query by illegal keys', () => {

    it('test sening request to find by createdAt', async () => {
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('GET', '/?createdAt=2019-12-02', true, authorization, 422, false)
            expect(result).have.to.have.property('error');
            expect(result.error).have.to.have.property('code')
            expect(result.error).have.to.have.property('message')
            expect(result.error.code).have.to.equal(10)
            return true;
        } catch (error) {
            throw Error(error)
            return
        }
    })
    it('test sening request to find by updatedAt', async () => {
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('GET', '/?updatedAt=2019-12-02', true, authorization, 422, false)
            expect(result).have.to.have.property('error');
            expect(result.error).have.to.have.property('code')
            expect(result.error).have.to.have.property('message')
            expect(result.error.code).have.to.equal(10)
            return true;
        } catch (error) {
            throw Error(error)
            return
        }
    })
    it('test sening request to find by meta', async () => {
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('GET', '/?meta=meteaData', true, authorization, 422, false)
            expect(result).have.to.have.property('error');
            expect(result.error).have.to.have.property('code')
            expect(result.error).have.to.have.property('message')
            expect(result.error.code).have.to.equal(10)
            return true;
        } catch (error) {
            throw Error(error)
            return
        }
    })
})

describe('Test sending illegal fields to recieve in response', () => {
    it('test sending createdAt as filed', async () => {
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('GET', '/?fields=_id,name,createdAt', true, authorization, 200, true)
            expect(result.data).have.to.be.an('array')
            if (result['data'][0]) {
                expect(result['data'][0]).have.to.be.an('object')
                expect(result['data'][0]).have.to.have.property('_id')
                expect(result['data'][0]).have.to.have.property('name')
                expect(result['data'][0]).not.have.property('createdAt')

            }
            return true;
        } catch (error) {
            throw Error(error)
            return
        }
    })
    it('test sending updatedAt as filed', async () => {
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('GET', '/?fields=_id,name,updatedAt', true, authorization, 200, true)
            expect(result.data).have.to.be.an('array')
            if (result['data'][0]) {
                expect(result['data'][0]).have.to.be.an('object')
                expect(result['data'][0]).have.to.have.property('_id')
                expect(result['data'][0]).have.to.have.property('name')
                expect(result['data'][0]).not.have.property('updatedAt')
            }
            return true;
        } catch (error) {
            throw Error(error)
            return
        }
    })
    it('test sending meta as filed', async () => {
        const authorization = jwt.sign({ containerId: containerId }, SECRET_KEY)
        try {
            result = await requestToService('GET', '/?fields=_id,name,meta', true, authorization, 200, true)
            expect(result.data).have.to.be.an('array')
            if (result['data'][0]) {
                expect(result['data'][0]).have.to.be.an('object')
                expect(result['data'][0]).have.to.have.property('_id')
                expect(result['data'][0]).have.to.have.property('name')
                expect(result['data'][0]).not.have.property('meta')

            }
            return true;
        } catch (error) {
            throw Error(error)
            return
        }
    })
})