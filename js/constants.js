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
 * Interface modes
 */
var cDEFAULT_MODE = 0;
var cBUILD_HOME = 1;

/**
 * Texture/LandscapeTile types
 */
var cGRASS = 0;
var cWATER = 1;
var cHIGHLIGHT = 2;

/**
 * Resource types
 */
var cNORESOURCE = 0;
var cFISH = 1;
var cFRUIT = 2;
var cGAME = cMEAT = 3;

/**
 * Skill types
 */
var cHUNTING = 0;
var cGATHERING = 1;
var cFISHING = 2;

/**
 * Guy States
 */
var IDLE = 0;
var WALK = 1;
var EAT = 2;
var FISH = 3;
var FIND_FISH = 4;
var HUNT = 5;
var PICK_APPLES = 6;

/**
 * Guy settings
 */
var cINIT_DIET = 3500;
var cINIT_STRENGTH = 5;
var cINIT_ENERGY_LEVEL = 5000;
var cWALK_DELAY = 20;
var cWALK_ENERGY_COST = 50;
var cMAX_NUTRITION = 10000;
var cADDED_NUTRITION_BY_EATING = 100;
var cNUTRITION_DETERIORATION_RATE_FISH = 2;
var cNUTRITION_DETERIORATION_RATE_MEAT = 3;
var cNUTRITION_DETERIORATION_RATE_FRUIT = 4;
var cEXPERIENCE_DIVISOR_FOR_LEVEL_UP = 5;
var cSKILL_EXPERIENCE_NEEDED_FOR_NEXT_SKILL_LEVEL = 250;

/**
 * Energy costs
 */
var aENERGY_COST = [];
aENERGY_COST[cHUNTING] = 10;
aENERGY_COST[cGATHERING] = 6;
aENERGY_COST[cFISHING] = 3;


/**
 * Building prices;
 */
var cHOME_COST = 50;

/**
 * Things to do at home
 */
var cHOME_ENOUGH_FOOD = 0.4;
var cHOME_EAT_FOOD_REDUCTION = 0.1;

/**
 * TODO: add all magic numbers here!
 */
