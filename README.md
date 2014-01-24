# angular-responsive-parallax

Parallax backgrounds with responsive images.

**Demo:** http://marcorei.github.io/example/angular-responsive-parallax/example.html

## How it works

<a href="https://github.com/scottjehl/picturefill">picturefill.js</a> provides a great way to deliver different images for different screen sizes. **angular-responsive-parallax** uses these images to create a scrolling parallax.

If the screen size changes <a href="https://github.com/scottjehl/picturefill">picturefill.js</a> and **angular-responsive-parallax** react and ajust the parallax effect.


## How to use

Example files are included in the repository. Anyway, i will show you around.

### HTML

First you need to build your HTML like you are used to from picturefill.js

```html
<span data-picture data-alt="nasa" class="mr-px-img" mr-px-parallax mr-px-max-px="0.1">
	<span data-src="assets/img/hs-2007-16-a-500x768.jpg" mr-px-size="500,768" mr-px-no-px="true"></span>
	<span data-src="assets/img/hs-2007-16-a-1280x960.jpg" mr-px-size="1280,960" data-media="(min-width: 500px)" ></span>
	<span data-src="assets/img/hs-2007-16-a-1920x1200.jpg" mr-px-size="1920,1200" data-media="(min-width: 1400px)" ></span>
</span>
```

Here is a list of attributes you'll need in addition to those from picturefill.js

On the container span element:
- **mr-px-parallax**
- **mr-px-max-px** set a value between 0 to 1 
	- 0 means the image does not move at all
	- 1 means the image will move at scroll speed

On the child span elements:
- **mr-px-size** the size of the image
- [optional] **mr-px-no-px** set this value to "true" if you want to disable the effect for this particular image size.
- [optional] **mr-px-focal** set the vertical focal point of the image. default ist 0, value ranges from 1 to -1.

### CSS

You'll need a few css rules to make your layout work without javascript and if you use mr-px-no-px. Take a look at the example.css for further info.

### JS

List **mrResponsiveParallax** as dependency.
<pre>
var app = angular.module('testApp', [
	'mrResponsiveParallax'
]);
</pre>



## Thanks

- https://gist.github.com/lorenzopolidori/3794226#file-has3d-js here's where i got the translate3d detection method.
- http://ejohn.org/blog/getboundingclientrect-is-awesome/ for the introduction to the getBoundingClientRect function.
- http://hubblesite.org Picture from Nasa! Yay!
