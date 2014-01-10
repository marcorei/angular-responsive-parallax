// Test for the adaptation of the mr-responsive-parallax

// requires picturefill.js and it's dom architecture
// Only support for values between 0 and 1 at the moment


(function (window, angular, undefined) {

	var app = angular.module('mrResponsiveParallax', []);

	app.directive('mrPxParallax', [ '$timeout', function($timeout){
		return {
			restrict: 'A',
			scope: {
				mrPxMaxPx: '='
			},
			link: function(scope, elem, attr){

				// now this feels a bit jquery-like but whatever - get the elements!

				var refElem = elem.parent(),
					boundRect,
					img,
					pxMulti,
					vp;




				/*
				 * Queries the dom for the img element and the attributes
				 * @return object elem, width and height as base of the 
				 */

				var getImg = function(){

					var img = elem.find('img'),
						parent = img.parent(),
						dims = parent.attr('mr-px-size').split(',');

					// as there should be only one img element at a time, this should always give us the right image
					//img.elem = elem.find('img');

					//img.elem.parent().attr('mr-px-size').split(',');

					//console.log( (parent.attr('mr-px-no-px') === 'true') );

					return {
						elem: img,
						oWidth: parseInt(dims[0]),
						oHeight: parseInt(dims[1]),
						noPx: (parent.attr('mr-px-no-px') === 'true')
					};

				}



				/*
				 * Refreshes all data that cang if picutrefill.js changes the dom
				 * @return object elem, width and height as base of the 
				 */

				var refreshData = function(){

					img = getImg();
					pxMulti = parseFloat(scope.mrPxMaxPx);
					vp = {
						width: window.innerWidth || document.documentElement.clientWidth,
						height: window.innerHeight || document.documentElement.clientHeight
					};
						

					// only listen to scroll event if parallaxe is enabled for this picture size

					if( img.noPx === true ){
						pxMulti = 0;
						angular.element(window).unbind('scroll', onScrollHandler);
					}else{
						angular.element(window).bind('scroll', onScrollHandler);
					}	

				}


				/*
				 * Image scaling routing
				 */

				var scaleImg = function(){

					var refRect = refElem[0].getBoundingClientRect();

					boundRect = {
						width: vp.width,
						height: 0
					};


					// (1) calculate required size

					if( pxMulti >= 0 && pxMulti <= 1 ){

						boundRect.height = vp.height * (1-pxMulti) + refRect.height * pxMulti;

					}else{

					}


					// ???

					

					// (2) scale img
					
					scaleToFill(img, boundRect);


				}


				/*
				 * Scale to fill Verfahren
				 */

				var scaleToFill = function(img, targetRect){

					var targetRatio = targetRect.width / targetRect.height,
						imgRatio = img.oWidth / img.oHeight;

					if( imgRatio > targetRatio ){
						img.height = targetRect.height;
						img.width = img.height * imgRatio;

					}else{
						img.width = targetRect.width;
						img.height = img.width / imgRatio;

					}

					img.elem.css('width', img.width+'px');
					img.elem.css('height', img.height+'px');

				}



				/*
				 * Image positioning routine
				 */

				var positionImg = function(){

					var refRect = refElem[0].getBoundingClientRect(),
						p = 0,
						newY = 0,
						newX,
						m = pxMulti;


					if( img.noPx !== true )
					{

						// (1) Animation progress

						//p = (refRect.top + refRect.height) / (vp.height + refRect.height);
						p = refRect.top / (vp.height - refRect.height);


						// (2) Image Position relative to viewport

						if( pxMulti >= 0 && pxMulti <= 1 ){

							newY = (vp.height - boundRect.height)*p*(1-m) + refRect.top*m;

						}else{

						}


						// ???



						// (3) Calculate relative position. Refrences: refRect and BoundRect

						newY = newY - refRect.top - (img.height - boundRect.height)*0.5; //*0.5

					}else{

						newY = - (img.height - boundRect.height)*0.5;

					}

					
					newX = -(img.width - boundRect.width)*0.5;

					img.elem.css('top', newY+'px');
					img.elem.css('left', newX+'px');


				}
				


				/*
				 * onLoad Handler
				 */

				var onLoadHandler = function(){

					angular.element(window).unbind('load', onLoadHandler);

					angular.element(window).bind('resize', onResizeHandler);

					onResizeHandler();

				}


				/*
				 *
				 */

				var onResizeHandler = function(){

					refreshData();
					scaleImg();

					// kick the positioning routine manually once

					onScrollHandler();

				}


				/*
				 * onScroll / onResize Handler
				 */


				var onScrollHandler = function(){

					positionImg();

				}


				

				angular.element(window).bind('load', onLoadHandler);


			}
		}
	}]);

})(window, window.angular);