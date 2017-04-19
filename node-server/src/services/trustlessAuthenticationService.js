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

const EthCrypto = require('eth-crypto'),
    authenticationServerPostService = require('./authenticationServerPostService.js'),
    randomChallengeService = require('./randomChallengeService.js'),
    ethereumRegistryServiceWrapper = require('./wrappers/ethereumRegistryServiceWrapper.js'),
    ethCrypto = new EthCrypto();


module.exports = (function init() {
        return {
            authenticate: function authenticate(email, endpoint) {
                var authenticationState = {};
                return randomChallengeService.generateSecureRandomString()
                    .then(function sendChallengeToServer(challenge) {
                        authenticationState.challenge = challenge;
                        return authenticationServerPostService.sendPost({email: email, challenge: challenge}, endpoint);
                    })
                    .then(function validateEthereumAddresses(response) {
                        var primaryAddress = response.primaryAddress;
                        console.log("Validating address: " + primaryAddress + " " + authenticationState.secondaryAddress);
                        authenticationState.secondaryAddress = ethereumRegistryServiceWrapper.getAuthenticationKey(primaryAddress);
                        if(authenticationState.secondaryAddress === '0x') {
                            throw new Error("The primary address is not mapped in the Mapper smart contract!");
                        }
                        authenticationState.signature = response.signature;
                        return response.signature;
                    })
                    .then(function validateSignature(signature) {
                        console.log("Validating signature: "+ signature);
                        return ethCrypto.validateSignature(authenticationState.challenge, signature, authenticationState.secondaryAddress);
                    })
                    .then(function checkResult(result) {
                        console.log("Validation result: "+ result);
                        if(!result) {
                            throw new Error("Signature is invalid!");
                        }
                        return authenticationState;
                    });
            }
        }
    })();
