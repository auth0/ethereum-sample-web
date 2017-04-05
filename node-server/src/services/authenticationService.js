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
'use strict'

const crypto = require('crypto'),
     request = require('request'),
     applicationConfigurationService = require('./src/services/configuration/applicationConfigurationService.js'),
     ethereumRegistryServiceWrapper = require('./src/services/wrappers/ethereumRegistryServiceWrapper.js'),
     randomChallengeService = require('./src/services/randomChallengeService.js');

const AUTH_SERVER_AUTHENTICATION_PATH = "trustless";
const RANDOM_CHALLENGE_PREFIX = "AUTH0_CHALLENGE_";

module.exports = (function init() {

	return {
		getAuthData : function generateChallengeAndGetPrimaryAddressSecondaryAddressAndSignatureFromAuthServer(email){
		    var challenge = null;
            var reqJson = {};
            var jsonToReturn = {};
            reqJson.email = email;
            randomChallengeService.generateRandomString().then(function(randomChallenge){
                challenge = RANDOM_CHALLENGE_PREFIX + randomChallenge;
                resJson.challenge = challenge;
                jsonToReturn.challenge = challenge;
            });
            console.log("Doing POST to " + applicationConfigurationService.authServerBaseUrl + AUTH_SERVER_AUTHENTICATION_PATH);
            request({
                url: applicationConfigurationService.authServerBaseUrl + AUTH_SERVER_AUTHENTICATION_PATH,
                method: "POST",
                json: true,
                body: reqJson
            }, function (error, response, body){
                if(error){
                    console.log(error);
                }
                else{
                    console.log("Received body.signature [" + body.signature + "]");
                    jsonToReturn.signature = body.signature;
                    console.log("Received body.secondaryAddress [" + body.secondaryAddress + "]");
                    jsonToReturn.secondaryAddress = body.secondaryAddress;
                    console.log("Received body.primaryAddress [" + body.primaryAddress + "]");
                    jsonToReturn.primaryAddress = body.primaryAddress;
                    return jsonToReturn;
                }
            });
		}
	}
})();
