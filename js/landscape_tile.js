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

var LandscapeTile = Class.create({
	initialize: function(type, x, y) {
		this.type = type;
		this.x = x;
		this.y = y;
		this.resources = [];
		this.highlighted = false;
		this.ghost = null;
	},

	accessible: function() {
		if(this.type == cGRASS)
			return true;
		else
			return false;
	},

	draw: function() {
		textures[this.type].draw(this.x, this.y);
		if(this.highlighted)
			textures[cHIGHLIGHT].draw(this.x, this.y);
		if(this.ghost)
			this.ghost.draw_at(this.x, this.y, null, null, "ghost");
	},

	drawGhostOf: function(sprite_set) {
		this.ghost = sprite_set;
	},

	clearGhost: function() {
		this.ghost = null;
	},

	highlight: function() {
		this.highlighted = true;
	},

	unHighlight: function() {
		this.highlighted = false;
	},

	draw_resources: function() {
		this.resources.each(function(r) {r.draw()});
	},

	add_resource: function(resource_set) {
		this.resources[this.resources.length] = resource_set;
	},

	has_resource: function(resource_type) {
		resource = this.resources.detect(function(r) { return r.resource_type == resource_type });
		if(resource)
			return resource.resources > 0.5;
		else
			return false;
	},

	deplete_resource: function(resource_type, skill_level) {
		resource = this.resources.detect(function(r) { return r.resource_type == resource_type });
		if(resource)
			return resource.deplete_resource(skill_level);
		else
			return 0;
	},

	increment_resources: function() {
		this.resources.each(function(r) { r.increment_resources() });
	},

	move_resources: function() {
		for(var i = 0; i < this.resources.length; ++i) {
			var target_tile = this.resources[i].move();
			if(target_tile && (target_tile.x != this.x || target_tile.y != this.y)) {
				target_tile.add_resource(this.resources[i]);
				this.resources.splice(i, 1);
			}
		}
	}
});
