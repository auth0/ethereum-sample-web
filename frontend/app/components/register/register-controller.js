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

.controller('registerController',
	function ($log, RegisterFactory, InitConstants, growl, $state,$uibModal) {
		$log.debug('registerController loading');
		var self = this;
		self.page = 'register';

		self.download = false;
		self.inputType = 'password';
		self.showEye = false;
		self.loader=false;

		function activate() {
			self.downloadUrl = InitConstants.MOBILE_APP_URL;
		}
		activate();

		self.checkpass = function (num) {
			if (num == 0) {
				self.showEye = false;
			} else {
				self.showEye = true;
			}
		};

		self.passMouseDown = function () {
			self.inputType = 'text';
		}

		self.passMouseUp = function () {
			self.inputType = 'password';
		}

		self.registerEmail = function (item) {
			self.loader=true;
			item.primaryAddress = angular.lowercase(item.primaryAddress)
			RegisterFactory.postRegistration(item).then(function (result) {
				console.log('succes')
				growl.success("You are registered");
				self.loader=false;
				$state.go('login');
			}, function (error) {
				self.loader=false;
				growl.error(error.data);
				console.log('Error', error);
				self.download = true;
			});
		};
	
	});
