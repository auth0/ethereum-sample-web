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
//////////////////////////////////////////////////
// The main module configuration section shows  //
// how to define when (redirects) and otherwise //
// (invalid urls) to arrangesite navigation     //
// using ui-router.                             //
//////////////////////////////////////////////////

'use strict';

angular.module('auth0-login-webApp')
	.config(
    ['$stateProvider', '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {

				///////////////////////////////
				// 1-Redirects and Otherwise //
				///////////////////////////////

				// Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
				$urlRouterProvider

					.otherwise('/login');

				$stateProvider

					.state('login', {
						url: '/login',
						templateUrl: 'components/login/login.html',
						controller: 'loginController as login'
					})
					.state('admin', {
						url: '/admin',
						templateUrl: 'components/admin/admin.html',
						controller: 'adminController as admin',
						resolve: {
							security: function ($cookies, $state, $timeout, growl) {
								var token = $cookies.get('JWTtoken');
								if (token == null) {
									$timeout(function () {
										$state.go('login');
										growl.error("You not are logged");
									}, 0);
								}
							}
						}
					})
					.state('register', {
						url: '/register',
						templateUrl: 'components/register/register.html',
						controller: 'registerController as register'
					});
            }]);