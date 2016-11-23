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
(function () {
	'use strict';
	agGrid.initialiseAgGridWithAngular1(angular);
	angular.module('App.Controllers', []);
	angular.module('App.Factories', []);
	angular.module('auth0-login-webApp', [
        'appverse.rest',
        'ngAnimate',
        'ui.bootstrap',
        'angularRipple',
        'ui.select',
        'ngSanitize',
        'rzModule',
        'rt.resize',
        'chart.js',
        'xeditable',
        'agGrid',
        'appverse.router',
        'App.Controllers',
        'appverse',
        'ngMdIcons',
        'angular-loading-bar',
		'App.Factories',
		'angular-growl',
		'ngCookies'
    ]).run(function ($log, editableOptions, InitConstants) {
		$log.debug('testAlphaApp run');
		editableOptions.theme = 'bs3';
		$('#menu-toggle').click(function (e) {
			e.preventDefault();
			$('#wrapper').toggleClass('toggled');
		});
	}).config(function (cfpLoadingBarProvider, growlProvider,$cookiesProvider) {
		//cfpLoadingBarProvider.includeSpinner = true;
		cfpLoadingBarProvider.includeBar = false;
		growlProvider.globalTimeToLive(3000);
		$cookiesProvider.secure = true;
	});
	AppInit.setConfig({
		environment: {
			'REST_CONFIG': {
				'BaseUrl': '/api',
				'RequestSuffix': ''
			}
		},
		appverseMobile: {},
		mobileBrowser: {}
	});
	angular.module('auth0-login-webApp').animation('.fade-in', function () {
		return {
			enter: function (element, done) {
				element.css({
					opacity: 0
				}).animate({
					opacity: 1
				}, 1000, done);
			},
			leave: function (element, done) {
				element.css({
					opacity: 0
				});
				done();
			}
		};
	});
}());