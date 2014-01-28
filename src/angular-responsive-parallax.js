/*
 * Angular responsive parallax
 * an angularJS directive for a parallax effect based on responsive images by picutrefill.js
 * 
 * Only supports parallax values from 0 to 1 at the moment
 *
 * @author Markus Riegel <riegel.markus@googlemail.com>
 */


(function (window, angular, undefined) {

	var app = angular.module('mrResponsiveParallax', []);

	app.value('containerDivId', 'mr-px-container');


	app.directive('mrPxParallax', [ 'containerDivId', function(containerDivId){
		return {
			restrict: 'A',
			scope: {
				mrPxMaxPx: '='
			},
			link: function(scope, elem, attr){


				var imgCont,
					imgContImg,
					refElem,
					boundRect,
					imgData,
					pxMulti,
					vp,
					t3d;



				/*
				 * Create container elements and query the dom for all infos about the image
				 * @return object with these attr: elem, oWidth, oHeight and noPx
				 */

				var getImgData = function(){


					// (1) Create the container image element in the background if it doesn't exist yet

					if( !imgCont ){

						// Check if the container-div exists, maybe created by another directive
						var divCont = document.getElementById(containerDivId);

						if(divCont === null) {
							divCont = angular.element('<div style="position:fixed;left:0;top:0;z-index:0;width:100%;height:100%;"></div>');
							divCont.attr('id',containerDivId);
							angular.element(document.body).prepend(divCont);
						}else{
							divCont = angular.element(divCont);
						}

						// Two containers, one for cropping, one for holding the image.
						imgCont = angular.element('<div style="position:fixed;left:0;top:0;width:100%;height:100%;overflow:hidden;"></div>');
						imgContImg = angular.element('<img style="position:absolute;">');

						divCont.append(imgCont);
						imgCont.append(imgContImg);

					}
					

					// (2) Find the original image element inserted by picturefill.js

					var img = elem.find('img'),
						parent = img.parent(),
						dims = parent.attr('mr-px-size').split(','),
						noPx = (parent.attr('mr-px-no-px') === 'true'),
						focal = (parseFloat(parent.attr('mr-px-focal')) >= -1 && parseFloat(parent.attr('mr-px-focal')) <= 1 ) ? parseFloat(parent.attr('mr-px-focal')) : 0;


					// (3) Change the source of the container img and hide the original

					if( !noPx ){

						imgCont.css('display','block');
						imgContImg.attr('src',img.attr('src'));
						elem.css('display','none');
						//parent.remove(img);

					}else{

						imgCont.css('display','none');
						imgContImg.attr('src','');
						elem.css('display','block');

					}

					
					// (4) Return new data

					return {
						elem: img,
						oWidth: parseInt(dims[0]),
						oHeight: parseInt(dims[1]),
						noPx: noPx,
						focal: focal
					};

				}


				/*
				 * Refreshes all data that changes if picutrefill.js changes the dom
				 */

				var refreshData = function(){

					angular.element(window).unbind('scroll', onScrollHandler);

					imgData = getImgData();
					pxMulti = parseFloat(scope.mrPxMaxPx);
					vp = {
						width: window.innerWidth || document.documentElement.clientWidth,
						height: window.innerHeight || document.documentElement.clientHeight
					};
						

					// only listen to scroll event if parallax is enabled for this picture size

					if( imgData.noPx === true ){
						pxMulti = 0;
					}else{
						angular.element(window).bind('scroll', onScrollHandler);
					}

				}


				/*
				 * Image scaling routine
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

						// TODO: implement more scroll speed modi

					}
					

					// (2) scale to fill precedure

					var targetRect = (imgData.noPx) ? refRect : boundRect,
						imgElem = (imgData.noPx) ? imgData.elem: imgContImg,
						targetRatio = targetRect.width / targetRect.height,
						imgRatio = imgData.oWidth / imgData.oHeight;

					if( imgRatio > targetRatio ){
						imgData.height = targetRect.height;
						imgData.width = imgData.height * imgRatio;
					}else{
						imgData.width = targetRect.width;
						imgData.height = imgData.width / imgRatio;
					}

					imgElem.css('width', imgData.width+'px');
					imgElem.css('height', imgData.height+'px');


					// (3) crop container

					imgCont.css('height', refRect.height+'px');


				}




				/*
				 * Image positioning routine
				 */

				var positionImg = function(){

					var refRect = refElem[0].getBoundingClientRect(),
						p = 0,
						newY = 0,
						newX,
						m = pxMulti,
						imgElem = (imgData.noPx) ? imgData.elem : imgContImg;


					newX = -(imgData.width - boundRect.width)*0.5;

					if( !imgData.noPx )
					{

						// (1) Get animation progress

						p = refRect.top / (vp.height - refRect.height);


						// (2) Image Position relative to viewport

						if( pxMulti >= 0 && pxMulti <= 1 ){

							newY = (vp.height - boundRect.height)*p*(1-m) + refRect.top*m;

						}else{

							// TODO: implement more scroll speed modi!

						}


						// (3) Calculate relative position. Refrences: refRect and boundRect

						newY = newY - refRect.top - (imgData.height - boundRect.height)*0.5*(1-imgData.focal);

					}else{

						newY = - (imgData.height - refRect.height)*0.5;

					}


					// use translate3d if it's available for hardware accellerated animation

					if(t3d !== 'none'){
						imgCont.css(t3d, 'translate3d(0px,'+refRect.top+'px,0)');
						imgElem.css(t3d, 'translate3d('+newX+'px, '+newY+'px,0px)');

					}else{

						imgCont.css('top', refRect.top+'px');
						imgElem.css('top', newY+'px');
						imgElem.css('left', newX+'px');

					}

				}



				/*
				 * Destroy routine
				 */

				var destroy = function(){

					angular.element(window).unbind('resize', onResizeHandler);
					angular.element(window).unbind('scroll', onScrollHandler);

					if( imgCont ){
						imgCont.parent().remove(imgCont);
						imgContImg = null;
					}

				}


				/*
				 * Check for transform and translate3d support
				 * based on https://gist.github.com/lorenzopolidori/3794226#file-has3d-js
				 * @returns string 'none' if no support, or the right transform css attribute
				 */

				var check3d = function(){

					var el = document.createElement('p'),
						has3d,
						transforms = {
							'webkitTransform':'-webkit-transform',
							'OTransform':'-o-transform',
							'msTransform':'-ms-transform',
							'MozTransform':'-moz-transform',
							'transform':'transform'
						},
						supportedTransform;

						document.body.insertBefore(el, null);

						for(var t in transforms){
							if( el.style[t] !== undefined ){
								el.style[t] = 'translate3d(1px,1px,1px)';
								has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
								supportedTransform = t;
							}
						}

						document.body.removeChild(el);

					return (has3d !== undefined && has3d.length > 0 && has3d !== "none") ? supportedTransform : 'none';
						
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
				 * onResize Handler
				 */

				var onResizeHandler = function(){

					refreshData();
					scaleImg();

					// kick the positioning routine manually once

					onScrollHandler();

				}


				/*
				 * onScroll Handler
				 */


				var onScrollHandler = function(){

					positionImg();

				}




				// Check for transform3d support
				t3d = check3d();

				// Get the reference element for the position relative to the viewport
				refElem = elem.parent();
				
				// fade out standard
				elem.css('display','none');

				// Add listeners for building and destroying
				angular.element(window).bind('load', onLoadHandler);
				
				scope.$on('$destroy', function(){
					destroy();
				});


			}
		}
	}]);

})(window, window.angular);