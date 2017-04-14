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

const express = require('express'),
    path = require('path'),
    app = express(),
    configuration = require('./src/services/configuration/applicationConfigurationService.js'),
    trustlessAuthenticationService = require('./src/services/trustlessAuthenticationService.js'),
    ethereumRegistryServiceWrapper = require('./src/services/wrappers/ethereumRegistryServiceWrapper.js'),
    jwtService = require('./src/services/jwtService.js');

app.use(express.logger());
app.use(express.json());
app.use(express.urlencoded());

app.use("/dist", express.static(__dirname + '/dist'));
app.use("/styles", express.static(__dirname + '/dist/styles/'));
app.use("/scripts", express.static(__dirname + '/dist/scripts'));
app.use("/resources", express.static(__dirname + '/dist/resources'));
app.use("/components/home", express.static(__dirname + '/dist/components/home'));
app.use("/components/admin", express.static(__dirname + '/dist/components/admin'));
app.use("/components/login", express.static(__dirname + '/dist/components/login'));

app.get('/authzero', function (req, res) {
	res.sendfile(path.join(__dirname + '/dist/index.html'));
});

app.get('/authserver/url', function (req, res) {
	res.send(configuration.authServerBaseUrl);
});

app.post('/login', function(req, res) {
    var token = req.body.data;
	console.log('Received login token:' + token);
	if(jwtService.isTokenValid(token))
	    res.status(200).send(true);
	else
	    res.status(403).send(false);
});

app.post('/login/trustless', function(req, res) {
    var email = req.body.email;
    trustlessAuthenticationService.authenticate(email,'/authenticate/trustless')
    .then(function sendResponse(token) {
        res.status(200).send(true);
    }).fail(function handleError(error) {
    	console.log("Request failed! " + error);
	});
});

app.listen(3001, function () {
	console.log('3rd party webapp listening on port 3001');
});

module.exports = app; //for testing