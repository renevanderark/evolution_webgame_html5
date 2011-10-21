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

var home_sprites = new SpriteSet(9);
var home_ghost = new SpriteSet();
var man_sprites = new SpriteSet();
var man_selector = new SpriteSet(3);
var fish_sprites = new SpriteSet(5, -7, -9);
var fish_reduced_sprites = new SpriteSet(5, -10, -10);
var game_sprites = new SpriteSet(15, -10, -10);
var game_reduced_sprites = new SpriteSet(15, -10, -10);

var fruit_sprites = new SpriteSet(1000, 20, -35);
var fruit_reduced_sprites = new SpriteSet(1000, 20, -35);
var fruit_depleted_sprites = new SpriteSet(1000, 20, -35);


function load_sprites() {
	for(var i = 0; i < 7; i++)
		home_sprites.add("home" + i, "img/home" + i + ".png");
	home_ghost.add("ghost", "img/home_ghost.png");

//	home_sprites.add("home" + i, "img/home_big1.png");
	man_sprites.add("IDLE", "img/man_idle.png");
	man_sprites.add("fish_sw", "img/man_fish_sw.png");
	man_sprites.add("fish_ne", "img/man_fish_ne.png");
	man_sprites.add("fish_nw", "img/man_fish_nw.png");
	man_sprites.add("fish_se", "img/man_fish_se.png");
	man_sprites.add("pick_fruit", "img/man_pick_fruit.png");
	man_sprites.add("hunt", "img/man_hunt.png");
	for(var i = 1; i < 4; i++)
		man_selector.add("man_selector" + i, "img/man_selector" + i + ".png");

	for(var i = 0; i < 10; i++)
		fish_sprites.add("fish" + i, "img/fish" + i + ".png");

	for(var i = 0; i < 10; i++)
		fish_reduced_sprites.add("fish_reduced" + i, "img/fish" + i + "_reduced.png");


	fruit_sprites.add("tree", "img/spooky_tree_lots_o_fruit.png");
	fruit_reduced_sprites.add("tree", "img/spooky_tree_some_fruit.png");
	fruit_depleted_sprites.add("tree", "img/spooky_tree_no_fruit.png");
	game_sprites.add("bunnies", "img/bunnies.png");
	game_reduced_sprites.add("bunny", "img/bunny.png");
}

function sprites_loaded() {
	return home_sprites.loaded() && man_sprites.loaded() && man_selector.loaded() && fish_sprites.loaded()  && fish_reduced_sprites.loaded()  &&  fruit_reduced_sprites.loaded()  && fruit_depleted_sprites.loaded()  && fruit_sprites.loaded() && home_ghost.loaded();
}

