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

var Texture = Class.create({
	initialize: function(image_src) {
		this.image = new Image();
		this.image.src = image_src;
	},

	loaded: function() {
		return this.image.complete;
	},

	draw: function(x, y) {
		draw_to_canvas(context, x, y, this.image, 20, 10);
	}
});

