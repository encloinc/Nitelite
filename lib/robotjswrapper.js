const argv = require('minimist')(process.argv.slice(2));
const robot = require('robotjs');

const functionType = argv.t; //1 (type) or 2 (click)
const string = argv.s;

//Get these before calling wrapper
const x = argv.x;
const y = argv.y;


switch(functionType){
	case 1:
		type(x, y, string)
		break;
	case 2:
		click(x, y)
		break;
}

function type(x, y, string){

		//Moves mouse over to the input in a human-way-fashion so epic doesnt detect a bot being used
		robot.moveMouseSmooth(x, y);

		//Clicks the input
		robot.mouseClick();

		//Types the string in a human way fashion to, again, avoid epic detecting a bot being used
		robot.typeStringDelayed(string, 700);

		console.log("finished");
	}

function click(x, y){
		
		//Moves mouse over to the element so epic doesnt detect a bot being used
		robot.moveMouseSmooth(x, y);

		//Clicks the elemnt
		robot.mouseClick();

		console.log("finished");
	}
