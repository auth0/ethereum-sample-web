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

const jwt = require('jsonwebtoken'),
    request = require('request'),
    Q = require('q'),
    configuration = require('./configuration/applicationConfigurationService.js');

function convertCertificate (cert) {
    //Certificate must be in this specific format or else the function won't accept it
    var beginCert = "-----BEGIN PUBLIC KEY-----";
    var endCert = "-----END PUBLIC KEY-----";

    while(cert.includes("\\n")){cert = cert.replace("\\n","");} 
    while(cert.includes("\"")){cert = cert.replace("\"","");} 
    cert = cert.replace(beginCert, "");
    cert = cert.replace(endCert, "");

    var result = beginCert;
    while (cert.length > 0) {

        if (cert.length > 64) {
            result += "\n" + cert.substring(0, 64);
            cert = cert.substring(64, cert.length);
        }
        else {
            result += "\n" + cert;
            cert = "";
        }
    }

    if (result[result.length ] != "\n")
        result += "\n";
    result += endCert + "\n";
    return result;
}


var authServerPublicKey;//Gets public key of authentication server
request(configuration.authServerBaseUrl + 'publickey', function (error, response, body) {
    if (!error && response.statusCode == 200) {
		var newCert = convertCertificate(body);
		authServerPublicKey = JSON.parse(JSON.stringify(newCert));
    }
});

module.exports = (function init(){
    return{
        isTokenValid : function isTokenValid(token){
            try{
                jwt.verify(token, authServerPublicKey, { algorithms: ['RS256'] });
                console.log('Token is valid');
                return true;
            }catch(err){
                console.log(err.toString());
                return false;
            }
        },
        getSignedTokenPromise : function getSignedToken(email, primaryAddress){
        	var deferred = Q.defer();
        	Q.fcall(function generateRandomBytes() {
                jwt.sign({email: req.body.email, primaryAddress: req.body.primaryAddress},
                    authServerPublicKey, {
                        algorithm: 'RS256',
                        expiresIn: configuration.jwtExpirationTime
                    }, function (err, token) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(token);
                        }
                    });
        	});
        	return deferred.promise;
        }
    }
})();