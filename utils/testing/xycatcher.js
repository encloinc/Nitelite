// The beginning of somethng great
const robot = require("robotjs");
const hook = require("iohook");
const fs = require("fs")
const path = require("path")
altPressed = false;


hook.on("keyup", event => {
	if (event.keycode == 56 && altPressed){
		altPressed = false;
	}else if (event.keycode == 56 && !altPressed){
		altPressed = true;

	}
})

hook.on("mousemove", event => {
	if (!(altPressed)){
		let currentMousePosition = robot.getMousePos()
		console.log({"x": currentMousePosition.x, "y": currentMousePosition.y})
	}
})

hook.start()
