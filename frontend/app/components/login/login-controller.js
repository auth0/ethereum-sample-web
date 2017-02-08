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

angular.module('App.Controllers')

.controller('loginController',
	function ($log, LoginFactory, growl, $state, $cookies) {
		$log.debug('loginController loading');
		var self = this;
		self.page = 'login';
		self.loader=false;

		self.loginUser = function (item) {
			self.loader=true;
			LoginFactory.postAuthentication(item).then(function (result) {
				LoginFactory.validateToken(result).then(function (resultValidate) {
						console.log(resultValidate)
						console.log('succes')
						growl.success("Succeful login. Received token:" + JSON.stringify(result));
						
						var now = new Date();
						var expiresValue = new Date(now);
						expiresValue.setSeconds(now.getSeconds() + 43200);
						$cookies.put('JWTtoken', result, {
							'expires': expiresValue
						});
						self.loader=false;
						$state.go('admin');
					},
					function (response) { // optional
						self.loader=false;
						growl.error(response.data);
					})
			}, function (error) {
				self.loader=false;
				growl.error(error.data);
				console.log('Error', error);
			});
		}

	});
