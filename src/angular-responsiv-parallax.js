// Test for the adaptation of the mr-responsive-parallax

// requires picturefill.js and it's dom architecture


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
					img,
					pxMulti;




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
					console.log(img);
					pxMulti = scope.mrPxMaxPx;

					// only listen to scroll event if parallaxe is enabled for this picture size

					if( img.noPx ){
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

					// get the size of the reference element
					var refRect = refElem[0].getBoundingClientRect();

					// ajust the height so we have enough for the parallaxe
					refRect.height = refRect.height * ( 1 + pxMulti );

					var refRatio = refRect.width / refRect.height,
						imgRatio = img.oWidth / img.oHeight;

					// scale to fill this rectangle
					if( imgRatio > refRatio ){

						img.height = refRect.height;
						img.width = img.height * imgRatio;

					}else{

						img.width = refRect.width;
						img.height = img.width / imgRatio;

					}

					// apply
					img.elem.css('width', img.width+'px');
					img.elem.css('height', img.height+'px');

				}



				/*
				 * Image positioning routine
				 */

				var positionImg = function(){

					// get the size and position of the reference element
					var refRect = refElem[0].getBoundingClientRect(),
						vp = {
							width: window.innerWidth || document.documentElement.clientWidth,
							height: window.innerHeight || document.documentElement.clientHeight
						},
						tY,
						relRefPos,
						posMulti,
						maxOff,
						imgTop;


					// Calculate max offset (in both directions)
					maxOff = (vp.height * 0.5) + (refRect.height * 0.5);

					// calculate zero point / target coordinate
					tY = (vp.height * 0.5) - (refRect.height * 0.5);

					// reRect position relative to tY
					relRefPos = refRect.top - tY;

					// calculate multiplier that derives from reRefPos
					posMulti = -relRefPos / maxOff;

					// and finally the top position
					imgTop = (-refRect.height * pxMulti) + (refRect.height * pxMulti * posMulti);


					


					//apply
					img.elem.css('top', imgTop+'px');


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