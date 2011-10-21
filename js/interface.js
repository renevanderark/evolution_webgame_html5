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

var last_finished = true;
var mode = cDEFAULT_MODE;
var money = 100;

function start() {
	context = $('game').getContext("2d");
	load_sprites();
	load_textures();
	world = new World();
	wait_for_images();
	world.draw();
}

function wait_for_images() {
	if(sprites_loaded() && textures_loaded())
		main();
	else
		window.setTimeout("wait_for_images()", 200);
}

function main() {
	while(!last_finished)
		;
	last_finished = false;
	world.ai();
	world.draw();

	if(selected_individual) {
		$('name').innerHTML = selected_individual.my_name + " the hunter/gatherer";
		$('level').innerHTML = Math.floor(selected_individual.level);
		$('thought').innerHTML = selected_individual.thought;

		$('energy_level').style.width = (selected_individual.energy_level / 100) + "px";
		$('diet_fish').style.width = (selected_individual.diet.fish / 100) + "px";
		$('diet_meat').style.width = (selected_individual.diet.meat / 100) + "px";
		$('diet_fruit').style.width = (selected_individual.diet.fruit / 100) + "px";


		$('strength').innerHTML = selected_individual.strength;

		$('fish_carried').innerHTML = selected_individual.carried_resources.fish;
		$('fruit_carried').innerHTML = selected_individual.carried_resources.fruit;
		$('meat_carried').innerHTML = selected_individual.carried_resources.meat;

		$('fishing').innerHTML = selected_individual.skills.fishing;
		$('gathering').innerHTML = selected_individual.skills.gathering;
		$('hunting').innerHTML = selected_individual.skills.hunting;
		if(selected_individual.home) {
			$('fish_home').innerHTML = Math.floor(selected_individual.home.fish);
			$('fruit_home').innerHTML = Math.floor(selected_individual.home.fruit);
			$('meat_home').innerHTML = Math.floor(selected_individual.home.meat);
		}

	}

	if(scrolling)
		scroll();

	last_finished = true;
	window.setTimeout("main()", 35);
}

function start_scrolling(x, y) {
	scroll_dir.x = x;
	scroll_dir.y = y;
	scrolling = true;
}

function stop_scrolling() {
	scrolling = false;
}

function scroll() {
	view_pos.x += scroll_dir.x;
	view_pos.y += scroll_dir.y;
}

function mouseclick(elem, event) {
	var cursor = {x: event.clientX - elem.cumulativeOffset()[0], y: event.clientY - elem.cumulativeOffset()[1]};
	switch(mode) {
		case cDEFAULT_MODE: default_interaction(cursor); break;
		case cBUILD_HOME: build_home_interaction(cursor); break;
	}
}

function mousemove(elem, event) {
	var cursor = {x: event.clientX - elem.cumulativeOffset()[0], y: event.clientY - elem.cumulativeOffset()[1]};
	var translated_pos = screen_pos2game_pos(cursor.x, cursor.y);
	switch(mode) {
		case cDEFAULT_MODE: highlight_tile(translated_pos); break;
		case cBUILD_HOME: draw_ghost(translated_pos, home_ghost); break;
	}
}

function draw_ghost(pos, sprite_set) {
	var tile = world.landscape.tile_at(pos.x, pos.y);
	world.landscape.landscape_tiles.each(function(t) { t.clearGhost() });
	if(tile)
		tile.drawGhostOf(sprite_set);
}

function highlight_tile(pos) {
	var tile = world.landscape.tile_at(pos.x, pos.y);
	world.landscape.landscape_tiles.each(function(t) { t.unHighlight() });
	if(tile)
		tile.highlight();
}

function default_interaction(cursor) {
	var options = world.individuals.findAll(function(i) { return i.clicked_on(cursor) });
	if(options.length > 0) {
		selected_individual = options[0];
	} else {
		selected_individual = null;
		options = world.buildings.findAll(function(b) { return b.clicked_on(cursor) });
		if(options.length > 0)
			alert("you clicked on a building!!");
	}
	if(selected_individual)
		$('man_specs').show();
	else
		$('man_specs').hide();
}

function build_home_interaction(cursor) {
	var translated_pos = screen_pos2game_pos(cursor.x, cursor.y);
	world.landscape.landscape_tiles.each(function(t) { t.clearGhost() });
	if(money < cHOME_COST) {
		alert("You do not have enough money to build a home");
		mode = cDEFAULT_MODE;
		return false;
	}
	var tile = world.landscape.tile_at(translated_pos.x, translated_pos.y);
	if(tile && tile.accessible()) {
		money -= cHOME_COST;
		world.add_home_at(translated_pos.x, translated_pos.y);
	} else 
		alert("You cannot build a home here");
}

function set_mode(set_mode) {
	mode = set_mode;
}

