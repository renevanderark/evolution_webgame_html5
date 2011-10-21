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
 * Globals: all global variables should be mentioned in this file
 */

// Contains the World object (see: World).
var world = null;

// Contains the drawing context of the main canvas element
var context = null;

// The user's view position on the world map
var view_pos = {x: -9, y: 9};

// The direction of scrolling and the scrolling-flag
var scroll_dir = {x: 0, y: 0};
var scrolling = false;

// The individual currently selected
var selected_individual = null;

// The landscape_tile currently selected
var selected_tile = null;

// The draw buffer
var draw_buffer = new DrawBuffer();

