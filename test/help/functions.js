// Packages
const request = require('request');

// Configs
const { mainAddress } = require('./configs')

module.exports = {
    generateRandomString(number) {
        let str = '';
        for (var i = 0; i < number; ++i) {
            let number = Math.floor(Math.random() * (24) + 97);
            str += String.fromCharCode(number);
        }
        return str;
    },
    // Function to use in test files 
    requestToService(method, url, data, authorization, code, success) {
        return new Promise((resolve, reject) => {
            request({
                method,
                url: `${mainAddress}${url}`,
                json: data,
                headers: {
                    'content-type': 'application/json',
                    'authorization': authorization
                }
            }, (error, response, body) => {
                console.log(method,url,body)
                if (error) {
                    reject(`Error in getting response from service bcause of ${error}`);
                }
                if (response.statusCode != code) {
                    reject('Pridicted code is not true');
                }
                // if (body['success'] != success) {
                //     reject('Predicted success is not true');
                // }
                resolve(body);
            })
        })
    }
}