/**
 *    A* implementation for JS with prototype.js
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

var StepNode = new Class.create({
	initialize: function(x, y, next) {
		this.x = x;
		this.y = y;
		this.next = next;
	}

});

var PathNode = new Class.create({
	initialize: function(x, y, target, parent) {
		this.x = x;
		this.y = y;
		this.parent = parent;
		this.target = target;
		this.h = this.h_score();
		this.g = this.g_score();
		this.f = this.f_score();
	},

	h_score: function() {
		var xDistance = (this.x < this.target.x ? this.target.x - this.x : this.x - this.target.x);
		var yDistance = (this.y < this.target.y ? this.target.y - this.y : this.y - this.target.y);
		var h = 0;
		if(xDistance > yDistance)
    	return 14*yDistance + 10*(xDistance-yDistance);
		else
     	return 14*xDistance + 10*(yDistance-xDistance);

	},

	g_score: function(x, y) {
		if(this.parent) {
			var g1 = 0;
			if(x && y)
				g1 = (this.x < x ? x - this.x : this.x - x) + (this.y < y ? y - this.y : this.y - y);
			else
				g1 = (this.x < this.parent.x ? this.parent.x - this.x : this.x - this.parent.x) + 
						 (this.y < this.parent.y ? this.parent.y - this.y : this.y - this.parent.y);
			return (g1 > 1 ? 14 : 10) + this.parent.g_score();
		} else
			return 0;
	},

	f_score: function() {
		return this.h + this.g;
	},

	draw: function() {
		draw_pos = translate_pos(this.x, this.y);
		context.fillStyle = "rgb(255,0,0)";
		context.fillRect(9 + draw_pos.x, draw_pos.y + 3, 2, 2);
	},

	to_s: function() {
		return "{x: " + this.x + ", y: " + this.y + ", h: " + this.h_score() + ", g: " + this.g_score() + ", f: " + this.f_score() + "}";
	}
});

var Path = new Class.create({
	initialize: function(start, target) {
		this.start = start;
		this.target = target;
		this.closed_list = [];
		this.open_list = [];
		this.available = false;
		this.walk_list = null;
		this.calculate();
	},

	calculate: function() {
		this.open_list[0] = new PathNode(this.start.x, this.start.y, this.target);
		for(var x = this.start.x - 1; x <= this.start.x + 1; x++)
			for(var y = this.start.y - 1; y <= this.start.y + 1; y++)
				if(!(x == this.start.x && y == this.start.y) && world.landscape.accessible(x, y))
					this.open_list[this.open_list.length] = new PathNode(x, y, this.target, this.open_list[0])

		this.pop_to_closed_list(this.start.x, this.start.y);

		while(this.open_list.length > 0) {
			this.open_list = this.open_list.sortBy(function(node) { return node.f});

			var cur_x = this.open_list[0].x;
			var cur_y = this.open_list[0].y;

			this.pop_to_closed_list(this.open_list[0].x, this.open_list[0].y);

			if(this.target.x != this.closed_list[this.closed_list.length - 1].x || this.target.y != this.closed_list[this.closed_list.length - 1].y) {		
				for(var x = cur_x - 1; x <= cur_x + 1; x++) {
					for(var y = cur_y - 1; y <= cur_y + 1; y++) {
						if(!(x == cur_x && y == cur_y) && world.landscape.accessible(x, y) && !this.detect_existing_node(x, y, this.closed_list)) {
							var existing_node = this.detect_existing_node(x, y, this.open_list);
							if(existing_node) {
								if(existing_node.g > existing_node.g_score(x, y))
									existing_node.parent = this.closed_list[this.closed_list.length - 1];
							} else
								this.open_list[this.open_list.length] = new PathNode(x, y, this.target, this.closed_list[this.closed_list.length - 1]);
						}
					}
				}
			} else {
				var x = this.target.x;
				var y = this.target.y;
				var node = this.closed_list.detect(function(node) { return node.x == x && node.y == y});
				this.walk_list = new StepNode(x, y);
				while(node = node.parent) {
					this.walk_list = new StepNode(node.x, node.y, this.walk_list);
				}
				this.available = true;
				break;
			}
		}
	},

	next: function() {
		if(this.walk_list) {
			var x = this.walk_list.x;
			var y = this.walk_list.y; 
			this.walk_list = this.walk_list.next;
			return {x: x, y: y};
		} else
			return null;
	},

	detect_existing_node: function(x, y, list) {
		for(var i = 0; i < list.length; ++i)
			if(list[i].x == x && list[i].y == y)
				return list[i];

		return null;
	},

	pop_to_closed_list: function(x, y) {
		for(var i = 0; i < this.open_list.length; ++i) {
			if(this.open_list[i].x == x && this.open_list[i].y == y) {
				this.closed_list[this.closed_list.length] = this.open_list[i];
				this.open_list.splice(i, 1);
				break;
			}
		}
	},

	draw: function() {
		var x = this.target.x;
		var y = this.target.y;
		var node = this.closed_list.detect(function(node) { return node.x == x && node.y == y});
		while(node) {
			node.draw();
			node = node.parent;
		}
	}
});

