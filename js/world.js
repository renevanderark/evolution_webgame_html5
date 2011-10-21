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

var World = Class.create({
	initialize: function() {
		this.landscape = new Landscape(10, 10, [
				0,0,0,0,0,0,0,0,0,0, // Map
				0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,
				1,1,0,0,1,1,1,0,0,0,
				0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,1,1,1,1,
				0,0,0,0,0,0,1,0,0,0,
				0,0,0,0,0,0,1,1,1,0,
				0,0,0,0,0,0,0,0,0,0,
			], [
				0,0,0,0,0,0,3,0,0,0, // Resource Map
				0,0,0,0,0,0,0,0,2,0,
				0,0,0,0,0,0,0,0,2,0,
				0,0,2,2,2,0,0,0,0,0,
				1,0,0,0,1,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,0,0,0,
				0,0,3,0,0,0,1,1,0,0,
				0,0,0,0,0,0,0,0,0,0,
			]);


		this.individuals = [];
		this.buildings = [];
	},

	ai: function() {
		if(this.homes().length > this.individuals.length)
			this.individuals[this.individuals.length] = new Individual(0,0,man_sprites, man_selector, 0);

		for(var i = 0; i < this.individuals.length; i++) {
			this.individuals[i].determine_goal();
			this.individuals[i].handle_state();
		}

		this.landscape.landscape_tiles.each(function(t) { t.increment_resources(); t.move_resources(); });
	},

	homes: function() {
		return this.buildings.select(function(b) { return b.type == "home" });
	},

	add_home_at: function(x, y) {
		this.buildings[this.buildings.length] = new Building(x, y, "home", home_sprites);
	},

	draw: function () {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		this.landscape.draw(context);

		this.landscape.draw_resources();
		this.buildings.each(function(b) {b.draw()});
		this.individuals.each(function(i) {i.draw()});
		draw_buffer.run();
	}
});
