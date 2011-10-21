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
 * Individual: here is where all the AI magic happens
 *  represents all the little guys in the world, their needs, their goals, their current state
 * TODO: 
 * - magic numbers!!
 * - floats to ints!!
 */
var Individual = Class.create({
	/**
	 * Constructor
	 * x(int): 									x position on the map
	 * y(int): 									y position on the map
	 * spriteset(SpriteSet):		the numerous sprites of the guy
	 * man_selector(SpriteSet):	the hovering selector animation when the guy is selected
	 * id(int):									just to know the guy's place in the world.individuals array
	 */
	initialize: function(x, y, spriteset, man_selector, id) {
		this.id = id;
		this.spriteset = spriteset;
		this.man_selector = man_selector;
		this.xPos = x;
		this.yPos = y;

		// Facilitates smooth movement of the guy within the landscape grid
		this.inner_x_pos = 0;
		this.inner_y_pos = 0;

		// The name of the guy
		this.my_name = generate_name();

		// The current state, used to call state handlers (TODO: make int!!)
		this.state = IDLE;
		// The current goal, used in some goal handlers (TODO: make int!!)
		this.goal = null;

		// The current energy level, decrements an x-amount every iteration, depending on state (TODO: make int!!)
		this.energy_level = cINIT_ENERGY_LEVEL;

		// The Path object containing the next LandscapeTiles the guy will walk
		this.path = null;

		// The building this guy has chosen for a home
		this.home = null;

		// What the guy thought of last (TODO: make thought-arrays for goals and states!!)
		this.thought = "";

		// The time the guy spent walking on the same LandscapeTile
		this.walk_delay = 0;

		// The LandscapeTile the guy is [doing/going to do] stuff with
		this.destination = null;

		// Toggle true when clicked on
		this.selected = false;

		// The time the guy has been idling (in other words: the AI has been failing)
		this.idle_time = 0;

		// The state of the guy's diet
		this.diet = {
			fish: cINIT_DIET,
			meat: cINIT_DIET,
			fruit: cINIT_DIET
		};

		// The resources the guy is carrying
		this.carried_resources = {
			fish: 0,
			meat: 0,
			fruit: 0
		};

		// The time it takes till a guy gains a skill point per skill type
		this.skill_experience = {
			fishing: 0,
			hunting: 0,
			gathering: 0
		};

		// The skills the guy has
		this.skills = {
			fishing: 0,
			hunting: 0,
			gathering: 0
		};

		// The on-screen bounding box of the image of the guy
		this.bbox = {x: 0, y: 0, w: 0, h: 0};

		// Some values we do not use yet, but look cool when we sometimes increment them
		this.strength = cINIT_STRENGTH;
		this.experience = 0;
		this.level = 0;
	},

	/**
	 * Return the movement-vector between the guy's position and the given LandscapeTile, or next node on the path
	 * tile_compared(LandscapeTile|{x:int,y:int}): the custom destination (may be ducktyped)
	 */
	get_direction: function(tile_compared) {
		if(tile_compared != null)
			return {x: tile_compared.x - this.xPos, y: tile_compared.y - this.yPos};
		else if(this.path && this.path.walk_list)
			return {x: this.path.walk_list.x - this.xPos, y: this.path.walk_list.y - this.yPos};
		else
			return {x: 0, y: 0};
	},

	/**
	 * Draw the guy to the screen
	 */
	draw: function() {
		// The sprite is chosen depending on which state the guy is in
		var sprite_id = "IDLE";
		// Some sprites take a little pixel correction to be drawn correctly (TODO: handle in SpriteSet)
		var x_correction = 0;
		var y_correction = 0;
		// Depending on the chosen sprite, the selector sprite also takes some pixel corrections
		var x_cor_selector = -7;
		var y_cor_selector = 4;

		if(this.state == FISH) {
			// When fishing, choose the correct sprite depending on the direction
			var dir = this.get_direction(this.destination);
			if((dir.x == -1 && dir.y == 0)) {
				sprite_id = "fish_sw";
				x_correction = -12;
			} else if(dir.x == 0 && dir.y == 1) {
				sprite_id = "fish_se";
				x_correction = -5;
				y_correction = 4;
			} else if(dir.x == 1 && dir.y == 0) {
				sprite_id = "fish_ne";
				x_correction = 0;
			} else /* if(dir.x = 0 && dir.y == -1)*/ {
				sprite_id = "fish_nw";
				x_correction = -5;
				y_correction = -8;
			}
		} else if(this.state == PICK_APPLES) {
			sprite_id = "pick_fruit";
			x_correction = 10;
			y_correction = -11;
			x_cor_selector = -18;
		} else if(this.state == HUNT || this.goal == "HUNT_GAME") 
			sprite_id = "hunt";

		// Move the sprite a little when the guy is on the same LandscapeTile as another guy
		for(var i = this.id + 1; i < world.individuals.length; ++i) {
			if(world.individuals[i].xPos == this.xPos && world.individuals[i].yPos == this.yPos)
				x_correction += 4;
		}

		// Draw the sprite, retrieve the bounding box
		this.bbox = this.spriteset.draw_at(this.xPos, this.yPos, this.inner_x_pos + x_correction, this.inner_y_pos + y_correction, sprite_id);

		// If the guy is selected, also draw the selector sprite
		if(this.selected)
			this.man_selector.draw_at(this.xPos, this.yPos, this.inner_x_pos + x_correction + x_cor_selector, this.inner_y_pos + y_cor_selector);
	},


	/** STATUS TESTS **/

	/**
	 * Called when user clicks the canvas: toggle selected when mouse cursor is within bbox; return selected state
	 * cursor(struct({x:int,y:int})):	The mouse cursor position
	 */
	clicked_on: function(cursor) {
		this.selected = false;
		if(cursor.x >= this.bbox.x && cursor.y >= this.bbox.y && cursor.x <= this.bbox.x + this.bbox.w && cursor.y <= this.bbox.y + this.bbox.h)
			this.selected = true;
		return this.selected;
	},

	/**
	 * Return true when the guy is at home
	 */
	at_home: function() {
		return (this.xPos == this.home.xPos && this.yPos == this.home.yPos);
	},

	/**
	 * Return true when the target of the guys walking path is his home
	 */
	walking_home: function() {
		return this.path && this.path.target.x == this.home.xPos && this.path.target.y == this.home.yPos;
	},

	/**
	 * Return true when the guy is at the place the guy wants to do stuff with
	 */
	at_destination: function() {
		if(this.destination)
			return this.destination.x == this.xPos && this.destination.y == this.yPos;
		return false;
	},

	/**
	 * Return true when the guy is actively depleting food resources 
	 */
	gathering_food: function() {
		return this.state == FISH  || this.state == PICK_APPLES || this.state == HUNT;
	},

	/**
	 * Return true when the guy is carrying as much as his strength allows
	 */
	max_carried: function() {
		return this.strength <= this.carried();
	},

	/**
	 * Return the sum of the carried resources
	 */
	carried: function() {
		return this.carried_resources.fish + this.carried_resources.meat + this.carried_resources.fruit;
	},

  /** GOAL HANDLERS **/

	/**
	 * Initiate walking to the given x y parameters on the map
	 * x(int): you know
	 * y(int): you dig
	 */
	walk_to: function(x, y) {
		// Test whether the guy is already on the destination and whether the destination is accessible
		if(!(x == this.xPos && y == this.yPos) && world.landscape.accessible(x, y)) {
			// Set the state 
			this.state = WALK;
			// Create a Path object to the chosen destination
			this.path = new Path({x: this.xPos, y: this.yPos}, {x: x, y: y});

			// If there is no path to the target, alas, the guy will have to idle around
			if(!this.path.available) {
				this.path = null;
				this.state = IDLE;
			}
		}
	},

	/**
	 * Initiate walking to the guy's home (the building of type "home" he owns)
	 */
	walk_home: function() {
		if(!this.walking_home())
			this.walk_to_object(this.home);
	},

	/**
	 * Initiate walking to an object on the map having an xPos and yPos property
	 * obj(DuckTypeMe): the target object
	 */
	walk_to_object: function(obj) {
		this.walk_to(obj.xPos, obj.yPos);
	},

	/**
	 * Initiate walking to the nearest LandscapeTile on the map of a certain type, containing a certain resource
	 * tile_type(int):	the LandscapeTile type
	 * test(int):				the type of resource which should be available (optional)
	 */
	walk_to_nearest_tile: function(tile_type, test) {
		// Try to find the nearest tile of this type ant (optionally) having this type of resource
		var nearest_tile = world.landscape.find_nearest_tile(this.xPos, this.yPos, tile_type, test);

		// If no tile was found, boohoo
		if(!nearest_tile)
			return null

		// If the guy couldn't possible access the tile found, select an adjacent alternative:
		//  --> guy can't walk on water, but guy wants fish from the water, so he must find an adjacent tile he can access
		//	    to fish from
		if(!world.landscape.accessible(nearest_tile.x, nearest_tile.y))
			nearest_tile = world.landscape.nearest_adjecent_accessible_tile(nearest_tile.x, nearest_tile.y, this.xPos, this.yPos);

		// If a tile was found start walking to it and return it!
		if(nearest_tile) {
			this.walk_to(nearest_tile.x, nearest_tile.y);
			return nearest_tile;
		}

		// No tile found again?? Boohoo again
		return null;
	},

	/**
	 * Find a building of type "home" which does not yet have an owner
	 */
	find_home: function() {
		var home = world.homes().detect(function(home) { return home.owner == null });
		if(home) {
			this.home = home;
			home.owner = this;
			this.thought = "Yay I found a home!";
		} else {
			this.thought = "I cannot find a home... where will I rest and eat?";
		}
	},

	/**
	 * If the guy is at home, set the state to EAT
	 * If not, initiate/continue walking home
	 */
	have_meal: function() {
		if(this.at_home()) {
			this.state = EAT;
			this.thought = "hmmm... crunch crunch";
		} else {
			this.walk_home();
			this.thought = "I am hungry as a horse, let's go home for diner";
		}
	},


	/**
	 * Find a resource on the map, go there and start depleting it
	 * Parameter examples:
	 * 	- Pick fruit: (PICK_APPLES, PICK_APPLES, cGRASS, cFRUIT, "Going to pick some fruit");
	 *	- Hunt game: ("HUNT_GAME", HUNT, cGRASS, cGAME, "Going to hunt for rabbits!")
	 *	- Fish: ("CATCH_FISH", FIND_FISH, cWATER, cFISH, "Going to catch fish!")
	 */
	find_resource: function(intended_goal, intended_state, target_tile_type, target_resource, accompanying_thought) {
		// Check whether we are already gathering/hunting/etc.
		if(this.state != intended_state) {
			// Check whether we are already at the intended spot
			if(this.state != WALK && !this.at_destination()) {
				// Find the nearest source for the resource we want and start walking there
				this.destination = this.walk_to_nearest_tile(target_tile_type, target_resource);
				if(!this.destination)
					// If there isn't a reachable source we can't do this, report our utter failure
					return false;
				else
					// Confirm that our intended goal is now current goal
					this.goal = intended_goal;
			} else if(this.at_destination() && this.goal == intended_goal) 
					// If we have reached our resource, we can the actual hunting/gathering/etc biz
					this.state = intended_state;
		}
		// Gay ass thought shit...
		this.thought = accompanying_thought;
		return true;	
	},

	determine_goal: function() {
		if(!this.home)
			this.find_home();
		else {
			if(this.at_home()) {
				this.home.fish += this.carried_resources.fish;
				this.carried_resources.fish = 0;
				this.home.fruit += this.carried_resources.fruit;
				this.carried_resources.fruit = 0;
				this.home.meat += this.carried_resources.meat;
				this.carried_resources.meat = 0;
			}

			if(this.home.food() && this.energy_level < 2000) {
				this.have_meal();
			} else if(this.carried() > 0 && this.energy_level < 500) {
				this.have_meal();
			} else if(this.state != EAT && !this.gathering_food() && !this.max_carried()) {

				var needed_foodstuffs = [{type: cFISH, amount: this.home.fish}, {type: cFRUIT, amount: this.home.fruit}, {type: cMEAT, amount: this.home.meat}]
				var success = false;
				needed_foodstuffs = needed_foodstuffs.sortBy(function(f) { return f.amount });
				for(var i = 0; i < needed_foodstuffs.length; ++i) {
					if(needed_foodstuffs[i].type == cFISH) {
						success = this.find_resource("CATCH_FISH", FIND_FISH, cWATER, cFISH, "Going to catch some fish!");
						if(success)
							break;
					} 
					if(needed_foodstuffs[i].type == cFRUIT) {
						success = this.find_resource(PICK_APPLES, PICK_APPLES, cGRASS, cFRUIT, "Going to pick some fruit");
						if(success)
							break;
					}
					if(needed_foodstuffs[i].type == cMEAT) {
						success = this.find_resource("HUNT_GAME", HUNT, cGRASS, cGAME, "Going to hunt for rabbits!");
						if(success)
							break;
					}
				}

				if(!success) {
					this.thought = "All the edible resources in this area are gone!";
					this.walk_home();
				}


			} else if(this.state == EAT && this.energy_level > 7000) {
					this.thought = "I have had enough";
					this.state = IDLE
			}
		}
	},


	/** State handlers **/
	idle: function() {
		this.energy_level -= 2;
		if(this.idle_time >= 100) {
			this.thought = "Forgot what I was going to do...";
			this.destination = null;
		}
	},

	walk: function() {
		var next = null;
		var direction = this.get_direction();
		this.inner_x_pos += direction.x;
		this.inner_y_pos += direction.y;

		if(++this.walk_delay >= cWALK_DELAY) {
			this.inner_x_pos = 0;
			this.inner_y_pos = 0;
			if(this.path && (next = this.path.next())) {
				this.walk_delay = 0;
				this.xPos = next.x;
				this.yPos = next.y;
				this.energy_level -= cWALK_ENERGY_COST;
				
			} else
				this.state = IDLE;
		}
	},

	eat: function() {
		if(this.home.food() > 0.0) {
			var eaten = this.home.eat_food_available(this.diet);
			if(eaten) {
				this.energy_level += eaten.amount;
				switch(eaten.type) {
					case cMEAT: if(this.diet.meat < cMAX_NUTRITION) this.diet.meat += cADDED_NUTRITION_BY_EATING; break;
					case cFISH: if(this.diet.fish < cMAX_NUTRITION) this.diet.fish += cADDED_NUTRITION_BY_EATING; break;
					case cFRUIT: if(this.diet.fruit < cMAX_NUTRITION) this.diet.fruit += cADDED_NUTRITION_BY_EATING; break;
				}
			}
		} else
			this.state = IDLE
	},

	/**
	 * Find a tile next to water containing fish, if found set the destination of the guy to that tile
	 */
	find_fishing_spot: function() {
		var fishing_spot = world.landscape.find_adjacent_tile(this.xPos, this.yPos, cWATER, cFISH);
		if(fishing_spot) {
			this.destination = fishing_spot;
			return true;
		} else {
			this.destination = null;
			return false;
		}
	},

	find_fish: function() {
		if(this.find_fishing_spot())
			this.state = FISH;
		else {
			this.state = IDLE;
			this.destination = null;
		}
	},

	gather_resource: function(resource_type, skill_type) {
		this.energy_level -= aENERGY_COST[skill_type];
		if(this.destination.has_resource(resource_type) && !this.max_carried()) {
			this.add_to_basket(resource_type, this.destination.deplete_resource(resource_type, this.skill_by_type(skill_type)));
		} else if(!this.max_carried()) {
			this.thought = "I have to find another spot.";
			this.state = IDLE
			this.destination = null;
		} else {
			this.thought = "I can carry no more, time to go home";
			this.walk_home();
		}

		this.increment_skill_experience(skill_type);
	},

	add_to_basket: function(resource_type, amount) {
		switch(resource_type) {
			case cMEAT: this.carried_resources.meat += amount; break;
			case cFISH: this.carried_resources.fish += amount; break;
			case cFRUIT: this.carried_resources.fruit += amount; break;
		}
	},

	handle_state: function() {
		if(this.diet.fish >= cNUTRITION_DETERIORATION_RATE_FISH)
			this.diet.fish -= cNUTRITION_DETERIORATION_RATE_FISH;
		if(this.diet.fruit >= cNUTRITION_DETERIORATION_RATE_FRUIT)
			this.diet.fruit -= cNUTRITION_DETERIORATION_RATE_FRUIT;
		if(this.diet.meat >= cNUTRITION_DETERIORATION_RATE_MEAT)
			this.diet.meat -= cNUTRITION_DETERIORATION_RATE_MEAT;

		switch(this.state) {
			case IDLE: this.idle_time++; this.idle(); break;
			case WALK: this.idle_time = 0; this.walk(); break;
			case EAT: this.idle_time = 0; this.eat(); break;
			case FISH: this.idle_time = 0; this.gather_resource(cFISH, cFISHING); break;
			case FIND_FISH: this.idle_time = 0; this.find_fish(); break;
			case HUNT: this.idle_time = 0; this.gather_resource(cGAME, cHUNTING); break;
			case PICK_APPLES: this.idle_time = 0; this.gather_resource(cFRUIT, cGATHERING); break;
		}
	},

	increment_experience: function() {
		this.experience++;
		if(this.experience % cEXPERIENCE_DIVISOR_FOR_LEVEL_UP == 0)
			this.level_up();
	},

	skill_by_type: function(skill_type) {
		switch(skill_type) {
			case cHUNTING: return this.skills.hunting;
			case cGATHERING: return this.skills.gathering;
			case cFISHING: return this.skills.fishing;
		}
	},

	increment_skill_experience: function(skill_type) {
		switch(skill_type) {
			case cHUNTING: 
				this.skill_experience.hunting++; 
				if(this.skill_experience.hunting >= cSKILL_EXPERIENCE_NEEDED_FOR_NEXT_SKILL_LEVEL) {
					this.skill_experience.hunting = 0;
					this.skills.hunting++; 
					this.increment_experience();
				}
				break;

			case cGATHERING:
				this.skill_experience.gathering++; 
				if(this.skill_experience.gathering >= cSKILL_EXPERIENCE_NEEDED_FOR_NEXT_SKILL_LEVEL) {
					this.skill_experience.gathering = 0;
					this.skills.gathering++; 
					this.increment_experience();
				}
				break;

			case cFISHING: 
				this.skill_experience.fishing++; 
				if(this.skill_experience.fishing >= cSKILL_EXPERIENCE_NEEDED_FOR_NEXT_SKILL_LEVEL) {
					this.skill_experience.fishing = 0;
					this.skills.fishing++; 
					this.increment_experience();
				}
				break;
		}
	},

	level_up: function() {
		this.level++;
		// switch random_number
		// case STRENGTH
		this.strength++;
		this.thought = "I feel stronger somehow";
		// case OTHER_PROP
		// this.other_prop++
	}
});
