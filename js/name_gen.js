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

var consonants = ["b","c","d","f","g","h","j","k","l","m","n","p","q","r","s","t","v","w","x","z"];
var vowels = ["a","e","i","o","u","y"];

function generate_name() {
	var ln = Math.floor(Math.random() * 10) + 2;
	var nm = "";
	for(var i = 0; i < ln; ++i) {
		if(i % 2 == 0)
			nm += consonants[Math.floor(Math.random() * consonants.length)];
		else
			nm += vowels[Math.floor(Math.random() * vowels.length)];
	}
	return nm.substr(0, 1).toUpperCase() + nm.substr(1);
}
