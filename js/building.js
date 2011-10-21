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
 * Building: represents all types of buildings in the game
 */
var Building = new Class.create({

	/**
	 * Constructor 
	 * x(int): 						the x position on the map
	 * y(int): 						the y position on the map
	 * type(string): 			the type of building (TODO: make int)
	 * image(SpriteSet):	the sprites for this building (defaults to animation)
	 */
	initialize: function(x, y, type, img) {
		this.xPos = x;
		this.yPos = y;
		this.type = type;
		this.image = img;

		// Resources contained in the building
		this.fish = 0.0;
		this.fruit = 0.0;
		this.meat = 0.0;
		this.money = 0;
		// The Individual object that 'owns' the building
		this.owner = null;
		// The bounding box of the on screen image of this building
		this.bbox = {x: 0, y: 0, w: 0, h: 0};
		// Toggles to true when building is clicked on
		this.selected = false;
	},

	/** 
	 * Returns true if there is enough food to eat in this building
   */
	food: function() {
		return this.meat > cHOME_ENOUGH_FOOD || this.fish > cHOME_ENOUGH_FOOD || this.fruit > cHOME_ENOUGH_FOOD;
	},

	/**
	 * Decrement the amount of food in store; return nutritional value of chosen food
	 * (TODO: convert to int)
	 * diet(struct({meat:int, fish:int, fruit:int})):	The current nutritional saturation for the individual eating from the food store
	 */ 
	eat_food_available: function(diet) {
		// Create an array of foodtypes sorted by the nutritional need of the individual's diet
		var diet_a = [{type: cFISH, amount: diet.fish}, {type: cMEAT, amount: diet.meat}, {type: cFRUIT, amount: diet.fruit}];
		diet_a = diet_a.sortBy(function(d) {return d.amount});

		// Loop through the diet array:
		//  - choose the first food type that is in store
		//  - decrement the amount of food
		//	- return the type and nutritional value of the food
		for(var i = 0; i < diet_a.length; ++i) {
			if(diet_a[i].type == cMEAT && this.meat > cHOME_ENOUGH_FOOD) {
				this.meat -= cHOME_EAT_FOOD_REDUCTION;
				return { type: cMEAT, amount: 100};
			}
			if(diet_a[i].type == cFRUIT && this.fruit > cHOME_ENOUGH_FOOD) {
				this.fruit -= cHOME_EAT_FOOD_REDUCTION;
				return { type: cFRUIT, amount: 50};
			}
			if(diet_a[i].type == cFISH && this.fish > cHOME_ENOUGH_FOOD) {
				this.fish -= cHOME_EAT_FOOD_REDUCTION;
				return { type: cFISH, amount: 70};
			}
		}
		// If there is not enough food of any type in store, return null
		return null;
	},

	/**
	 * Draw the sprite of this building to the canvas
	 */
	draw: function() {
		this.bbox = this.image.draw_at(this.xPos, this.yPos);
	},

	/**
	 * Called when user clicks the canvas: toggle selected when mouse cursor is within bbox; return selected state
	 * cursor(struct({x:int,y:int})):	The mouse cursor position
	 */
	clicked_on: function(cursor) {
		this.selected = false;
		if(cursor.x >= this.bbox.x && cursor.y >= this.bbox.y && cursor.x <= this.bbox.x + this.bbox.w && cursor.y <= this.bbox.y + this.bbox.h)
			this.selected = true;
		return this.selected;
	}
});
