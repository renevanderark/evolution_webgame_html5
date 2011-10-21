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

var Landscape = Class.create({
	initialize: function(w, h, t, resource_map) {
		this.width = w;
		this.height = h;
		this.landscape_tiles = [];

		for(var y = 0; y < this.height; y++) {
			for(var x = 0; x < this.width; x++) {
				this.landscape_tiles[(y*this.width)+x] = new LandscapeTile(t[(y*this.width)+x], x, y);

				switch(resource_map[(y*this.width)+x]) {
					case cFISH: 
						this.landscape_tiles[(y*this.width)+x].add_resource(new ResourceSet(cFISH, 5, x, y, false, fish_sprites, fish_reduced_sprites));
						break;
					case cFRUIT: 
						this.landscape_tiles[(y*this.width)+x].add_resource(new ResourceSet(cFRUIT, 5, x, y, false, fruit_sprites, fruit_reduced_sprites, fruit_depleted_sprites));
						break;
					case cGAME: 
						this.landscape_tiles[(y*this.width)+x].add_resource(new ResourceSet(cGAME, 5, x, y, true, game_sprites, game_reduced_sprites));
						break;
				}
			}
		}
	},

	draw: function(context) {
		for(y = 0; y < this.height; y++)
			for(x = 0; x < this.width; x++)
				this.landscape_tiles[(y*this.width)+x].draw();
	},

	draw_resources: function(context) {
		for(y = 0; y < this.height; y++)
			for(x = 0; x < this.width; x++) 
				this.landscape_tiles[(y*this.width)+x].draw_resources();
	},

	tile_at: function(x, y) {
		return this.landscape_tiles[(y*this.width)+x];
	},

	accessible: function(x, y) {
		if(x >= 0 && x < this.width && y >= 0 && y < this.width) {
			return this.tile_at(x, y).accessible();
		} else
			return false
	},
	
	find_nearest_tile: function(xPos, yPos, type, resource_type) {
		var options = []
		for(var y = 0; y < this.height; y++) {
			for(var x = 0; x < this.width; x++) {
				if(this.tile_at(x,y).type == type) {
					if(resource_type == null)
						options[options.length] = this.tile_at(x, y);
					else if(this.tile_at(x, y).has_resource(resource_type))
						options[options.length] = this.tile_at(x, y);
				}
			}
		}
		options = options.sortBy(function(o) { 
			return distance_heuristic(o, {x:xPos, y:yPos})
		});
		return options[0];
	},


	adjacent_accessible_tiles: function(xPos, yPos) {
		var options = [];
		if(this.accessible(xPos + 1, yPos))
			options[options.length] = this.tile_at(xPos + 1, yPos);
		if(this.accessible(xPos - 1, yPos))
			options[options.length] = this.tile_at(xPos - 1, yPos);
		if(this.accessible(xPos, yPos + 1))
			options[options.length] = this.tile_at(xPos, yPos + 1);
		if(this.accessible(xPos, yPos - 1))
			options[options.length] = this.tile_at(xPos, yPos - 1);
		return options
	},

	nearest_adjecent_accessible_tile: function(xPos, yPos, xFrom, yFrom) {
		var options = this.adjacent_accessible_tiles(xPos, yPos);

		if(options.length == 0)
			return false;
		else
			options = options.sortBy(function(o) {
				return distance_heuristic(o, {x:xFrom, y:yFrom})
			});
		return options[0];
	},

	random_adjecent_accessible_tile: function(xPos, yPos) {
		var options = this.adjacent_accessible_tiles(xPos, yPos);

		if(options.length == 0)
			return false;
		else
			return options[Math.floor(Math.random() * options.length)];
	},

	find_adjacent_tile: function(xPos, yPos, type, resource_type) {
		for(var y = yPos - 1; y <= yPos + 1; y++) {
			for(var x = xPos - 1; x <= xPos + 1; x++) {
				if(y < this.height && x < this.width && x >= 0 && y >= 0 && this.tile_at(x, y).type == type) {
					if(resource_type == null)
						return this.tile_at(x, y);
					else if(this.tile_at(x, y).has_resource(resource_type))
						return this.tile_at(x, y);
				}
			}
		}
		
		return null;
	}
});
