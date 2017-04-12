/**
* The MIT License (MIT)
*
* Copyright (c) 2016 Auth0, Inc. <support@auth0.com> (http://auth0.com)
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
'use strict';

const primaryAddress = "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe".toLowerCase(),
      secondaryAddress = "0xDa4a4626d3E16e094De3225A751aAb7128e96526".toLowerCase(),
      token = "token",
      email = "someone@gmail.com",
      signature = "blablebla",
      EthCryptoMock = require('./mocks/ethCryptoMock.js'),
      EthRegistrationServiceMock = require('./mocks/ethRegistrationServiceMock.js'),
      RequestMock = require('./mocks/requestMock.js'),
      ApplicationConfigurationServiceMock = require('./mocks/applicationConfigurationServiceMock.js'),
      JwtServiceMock = require('./mocks/jwtServiceMock.js'),
      proxyquire = require('proxyquire');

var ethCryptoMock = EthCryptoMock(undefined,signature,true);
var ethRegistrationServiceMock = EthRegistrationServiceMock(secondaryAddress);
var requestMock = new (RequestMock({primaryAddress : primaryAddress, signature : signature}));
requestMock.sendPost['@global'] = true;
var applicationConfigurationServiceMock = ApplicationConfigurationServiceMock("auth-server-url",undefined,undefined,100000);
var jwtServiceMock = new JwtServiceMock(true, token);
jwtServiceMock['@global'] = true;

applicationConfigurationServiceMock['@global'] = true;

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should();

chai.use(chaiHttp);

var stubs = {
	"eth-registration-service" : ethRegistrationServiceMock,
	"eth-crypto" : ethCryptoMock,
	'./applicationConfigurationService.js' : applicationConfigurationServiceMock,
    '../configuration/applicationConfigurationService.js' : applicationConfigurationServiceMock,
    './configuration/applicationConfigurationService.js' : applicationConfigurationServiceMock,
    './src/services/configuration/applicationConfigurationService.js' : applicationConfigurationServiceMock,
    './src/services/wrappers/ethereumRegistryServiceWrapper.js' : ethRegistrationServiceMock,
    './src/services/jwtService.js' : jwtServiceMock,
    'request' : requestMock.sendPost
};

var server = proxyquire('../app.js',stubs);

function sendTrustlessAuthenticationRequest(endpoint) {
    return chai.request(server)
    .post(endpoint)
    .send({
        email : email
    });
}

describe('/login',function test() {

	it('should return a token after trustless authentication request',function(done) {
        sendTrustlessAuthenticationRequest('/login/trustless')
		.end(function(err,res) {
           res.body.should.contain(token);
           res.should.have.status(200);
           done();
        });
	});
});
 
