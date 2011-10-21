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

var SpriteSet = new Class.create({

	initialize: function(max_delay, x_ref, y_ref) {
		this.images = [];
		this.rotation = 0;
		this.rotation_delay = 0;
		this.max_delay = max_delay;
		this.x_refine = x_ref;
		this.y_refine = y_ref;

		if(this.max_delay == null)
			this.max_delay = 10;
	},

	add: function(id, src) {
		this.images[this.images.length] = {id: id, img: new Image()};
		this.images[this.images.length-1].img.src = src;
	},

	get: function(id) {
		return this.images.detect(function(i) { return i.id == id}).img;
	},

	loaded: function() {
		for(var i = 0; i < this.images.length; i++)
			if(!this.images[i].img.complete)
				return false;

		return true;		
	},

	draw_at: function(x, y, x_refine, y_refine, id) {
		var draw_pos = translate_pos(x, y);
		var correction = {x: 0, y: 0};
		var current_image = null;
		if(x_refine != null && y_refine != null) {
			if(this.x_refine != null && this.y_refine != null)
				correction = translate_refined_pos(this.x_refine + x_refine, this.y_refine + y_refine);
			else
				correction = translate_refined_pos(x_refine, y_refine);
		} else if(this.x_refine != null && this.y_refine != null)
			correction = translate_refined_pos(this.x_refine, this.y_refine);

		if(id != null) {
			current_image = this.images.detect(function(i) { return i.id == id}).img;
		} else {
			current_image = this.images[this.rotation].img;
			if(++this.rotation_delay >= this.max_delay) {
				this.rotation++;
				this.rotation_delay = 0;
				if(this.rotation == this.images.length)
					this.rotation = 0;
			}
		}
//		context.drawImage(current_image, draw_pos.x + correction.x, draw_pos.y + correction.y);
		draw_buffer.add(current_image,  {x: draw_pos.x + correction.x, y: draw_pos.y + correction.y, w: current_image.width, h: current_image.height});
		return {x: draw_pos.x + correction.x, y: draw_pos.y + correction.y, w: current_image.width, h: current_image.height};
	}
});


