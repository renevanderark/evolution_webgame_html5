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

var ResourceSet = Class.create({
	initialize: function(resource_type, resources, x, y, can_move, sprite, sprite_reduced, sprite_depleted) {
		this.resources = resources;
		this.resource_type = resource_type;
		this.x = x;
		this.y = y;
		this.inner_x_pos = 0;
		this.inner_y_pos = 0;
		this.target_tile = null;
		this.can_move = can_move;
		this.sprite = sprite;
		this.sprite_reduced = sprite_reduced;
		this.sprite_depleted = sprite_depleted;
		this.bbox = {x:0, y:0, w:0, h:0};
		this.selected = false;
		this.move_delay = 0;
	},

	deplete_resource: function(skill) {
		if(skill < 30) {
			if(Math.floor(Math.random() * (30 - skill)) == 0) {
				this.resources -= 1;
				return 1;
			}
		} else {
			this.resources -= 1;
			return 1;
		}
		return 0;
	},

	increment_resources: function() {
		if(this.resources < 8 && this.resource_type == cFISH)
			this.resources += 0.005;
		else if(this.resources < 5 && this.resource_type == cFRUIT)
			this.resources += 0.005;
		else if(this.resources < 10 && this.resource_type == cGAME)
			this.resources += 0.005;

	},

	draw: function() {
		if(this.sprite && this.resources > 3.0)
			this.bbox = this.sprite.draw_at(this.x, this.y, this.inner_x_pos, this.inner_y_pos);
		else if(this.sprite_reduced && this.resources > 0.5)
			this.bbox = this.sprite_reduced.draw_at(this.x, this.y, this.inner_x_pos, this.inner_y_pos);
		else if(this.sprite_depleted)
			this.bbox = this.sprite_depleted.draw_at(this.x, this.y, this.inner_x_pos, this.inner_y_pos);
	},

	sprite_loaded: function() {
		if(this.sprite)
			return this.sprite.loaded();
		else
			return true;
	},

	clicked_on: function(cursor) {
		this.selected = false;
		if(cursor.x >= this.bbox.x && cursor.y >= this.bbox.y && cursor.x <= this.bbox.x + this.bbox.w && cursor.y <= this.bbox.y + this.bbox.h)
			this.selected = true;
		return this.selected;
	},

	get_direction: function() {

	 if(this.target_tile)
			return {x: this.target_tile.x - this.x, y: this.target_tile.y - this.y};
		else
			return {x: 0, y: 0};
	},

	move: function() {
		if(this.can_move) {
			if(!this.target_tile)
				this.target_tile = world.landscape.random_adjecent_accessible_tile(this.x, this.y);

			var direction = this.get_direction();
			this.inner_x_pos += direction.x / 4;
			this.inner_y_pos += direction.y / 4;
			if(++this.move_delay >= 80) {
				this.move_delay = 0;
				this.inner_x_pos = 0;
				this.inner_y_pos = 0;
				this.x = this.target_tile.x;
				this.y = this.target_tile.y;
				tTile = this.target_tile;
				this.target_tile = null;
				return tTile;
			}
		}
		return null;
/*		if(this.can_move && ++this.move_delay >= 100) {
			var target_tile = world.landscape.random_adjecent_accessible_tile(this.x, this.y);

			this.move_delay = 0;
			this.x = target_tile.x;
			this.y = target_tile.y;
		}
		return target_tile;*/
	}

});
