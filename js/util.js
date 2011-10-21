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

Array.prototype.remove=function(s){
	for (i=0; i < this.length; i++){
		if (s == this[i]) this.splice(i, 1);
	}
}

function translate_pos(xPos, yPos) {
	return {x: ((xPos + view_pos.x) * 20) + ((yPos + view_pos.y) * 20), y: (yPos + view_pos.y) * 10 - (xPos + view_pos.x) * 10};
}

function screen_pos2game_pos(xPos, yPos) {
	return {x: parseInt((xPos / 40) - (yPos / 20)) - view_pos.x, y: parseInt((yPos / 20) + (xPos / 40)) - view_pos.y - 1};
}

function translate_refined_pos(x, y) {
	return {x: x + y + 20, y: (y - x) * 0.5};
}

function draw_to_canvas(context, x, y, image, w, h) {
	var screen_pos = translate_pos(x, y);
	if(screen_pos.x > -40 && screen_pos.y > -40 && screen_pos.x + w < context.canvas.width + 40 && screen_pos.y + h < context.canvas.height + 40) {
		if(image.complete)
			context.drawImage(image, screen_pos.x, screen_pos.y);
	}
}

function rect_to_canvas(context, x, y, w, h, style, correction_x, correction_y) {
	var screen_pos = translate_pos(x, y);

	if(correction_x == null)
		correction_x = 0;
	if(correction_y == null)
		correction_y = 0;

	if(screen_pos.x > -40 && screen_pos.y > -40 && screen_pos.x + w < context.canvas.width + 40 && screen_pos.y + h < context.canvas.height + 40) {
		context.fillStyle = style;
		context.fillRect(screen_pos.x + correction_x, screen_pos.y + correction_y, w, h);
	}
}


function distance_heuristic(from, goal) {
	var xDistance = (from.x < goal.x ? goal.x - from.x : from.x - goal.x);
	var yDistance = (from.y < goal.y ? goal.y - from.y : from.y - goal.y);
	var h = 0;
	if(xDistance > yDistance)
  	return 14*yDistance + 10*(xDistance-yDistance);
	else
   	return 14*xDistance + 10*(yDistance-xDistance);
}
