/**
 *    Please take this brilliant html5 webgame off my hands
 *    For details see: http://opendatachallenge.kbresearch.nl/
 *    Copyright (C) 2011  R. van der Ark, r.van.der.ark@gmail.com
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * DrawBuffer: Handles drawing images to the canvas and overlap of images
 *  - the draw buffer is emptied at every iteration
 *  - all the sprites to be drawn in current iteration are added by using the add method
 *  	o the sprites are expected to be translated to the actual screen position in pixels
 *    o to resolve overlay, width and height are also expected
 *  - the run method draws all the sprites buffered at the end of the iteration
 */
var DrawBuffer = new Class.create({
	/**
	 * Constructor: the draw buffer only has an empty images array
   */
	initialize: function() {
		this.images = [];
	},

	/**
	 * Add an image to the buffer at the correct overlap
	 * img(Image):													the image to be drawn to the canvas
	 * dims({x:int, y:int, w:int, h:int}):	the dimensions of the image to be drawn
   */
	add: function(img, dims) {
		// Check whether the image falls inside the visible canvas
		if(dims.x > -40 && dims.y > -20 && dims.x + dims.w < context.canvas.width + 40 && dims.y + dims.h < context.canvas.height +20) {
			// Toggle true when the image gets inserted in loop below
			var inserted = false;
			// Loop through all the images currently in the buffer:
			// - if this image's 'bottom' position is higher (in pixels) than the current image, insert it in the buffer
			for(var i = 0; i < this.images.length; ++i) {
				if(this.images[i].y + this.images[i].h > dims.y + dims.h) {
		      inserted = true;
					this.images.splice(i, 0, {image: img, x: dims.x, y: dims.y, w: dims.w, h: dims.h});
					break;
				}
			}
			// If the image has not yet been inserted, insert it at the end of the buffer,
			if(!inserted)
				this.images[this.images.length] = {image: img, x: dims.x, y: dims.y, w: dims.w, h: dims.h};
		}
	},

	/**
	 * Draw the images in the buffer to the screen, empty the buffer for the next iteration
	 */
	run: function() {
		for(var i = 0; i < this.images.length; ++i) {
			if(this.images[i].image.complete)
				context.drawImage(this.images[i].image, this.images[i].x, this.images[i].y);
		}

		this.images = [];
	}
});

