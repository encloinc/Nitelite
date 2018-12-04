// The beginning of somethng great
const robot = require("robotjs");
const hook = require("iohook");
const fs = require("fs")
const path = require("path")
let data = JSON.parse(fs.readFileSync(path.join(__dirname,"..", "/config/positions.json"), 'utf8'));
let config = null;
let altPressed = false;
let setupVariables = []
let noAltSetup = [2, 5,8,9,10]
let step = 0;

hook.on("mouseclick", event => {
	if (altPressed){
		
		let currentMousePosition = robot.getMousePos()
		setupVariables.push({"x": currentMousePosition.x, "y": currentMousePosition.y})
		step++;
		setup()
	}
})


hook.on("keydown", event => {
	if (event.keycode == 56 && !altPressed){
		altPressed = true;
	}


})

hook.on("keyup", event => {
	if (event.keycode == 56 && altPressed){
		altPressed = false;
	}
	if (event.keycode == 46 && !altPressed && noAltSetup.includes(step)){
		if (step == 8){
			step += 2;
		}else{
			step++;
		}
		setup()
	}
})


hook.start()

function construct(tree){
		Object.entries(tree).forEach(entry =>{
			let key1 = entry[0];
  			let value1 = entry[1];

	  		Object.entries(value1).forEach(entry =>{
				let key2 = entry[0];
	  			let value2 = entry[1];
	  			
	  			Object.entries(value2).forEach(entry =>{
					let key3 = entry[0];
					let value3 = entry[1];
					let address = null;

					if (key3 != "after_userprofile_click"){
	  					address = tree[key1][key2][key3]
		  			}else{		  				value3 = entry[1]["signout_button"];
		  				address = tree[key1][key2][key3]["signout_button"]
		  			}
		  			let bx = 0;
		  			let by = 0;
		  			let wtype = null;
		  			switch (key2){
		  				case "signin":
  							wtype = "launcher"
  							break;
  						case "main":
  							wtype = "launcher"
  							break;
  						case "authenticate":
  							wtype = "launcher"
  							break;
  						case "main_friends_box":
  							wtype = "friendWindow"
  							break;
  						case "add_friends_window":
  							wtype = "addFriendWindow"
  							break;
  					}
		  			switch (value3["position_type"]){
		  				case "nostatic":
	  						bx = parseFloat(value3.xsPercentage) * config[wtype].width + config[wtype].topLeft.x;
	  						by = parseFloat(value3.ysPercentage) * config[wtype].height + config[wtype].topLeft.y;
	  						break;

		  				case "y-static":
		  					bx = parseFloat(value3.xsPercentage) * config[wtype].width + config[wtype].topLeft.x;
		  					by = config[wtype].topLeft.y + parseFloat(value3.ys);
		  					break;

		  				case "x-static":
		  					bx = config[wtype].topLeft.x + parseFloat(value3.xs);
		  					by = parseFloat(value3.ysPercentage) * config[wtype].height + config[wtype].topLeft.y;
		  					break;

		  				case "static":
		  					bx = config[wtype].topLeft.x + parseFloat(value3.xs);
		  					by = config[wtype].topLeft.y + parseFloat(value3.ys);
		  					break;

		  				case "flx-static":
		  					bx = config[wtype].topRight.x - parseFloat(value3.xs);
		  					by = config[wtype].topLeft.y + parseFloat(value3.ys);
		  					break;

		  				case "fly-static":
		  					bx = config[wtype].topLeft.x + parseFloat(value3.xs);
		  					by = config[wtype].bottomLeft.y - parseFloat(value3.ys);
		  					break;
		  				case "calc":
		  					bx = (parseFloat(value3.xsCalc[0]) * config[wtype].width + config[wtype].topLeft.x)  + parseFloat(value3.xsCalc[1]);
	  						by = (parseFloat(value3.ysCalc[0]) * config[wtype].height + config[wtype].topLeft.y) + parseFloat(value3.ysCalc[1]);
	  						break;

		  				}
		  				console.log(`${key3}: x:${bx}, y:${by}`)
		  				switch(value3["size_type"]){
		  					case "static":
		  						address["x"] = (bx + (parseFloat(value3.width) / 2));
		  						address["y"] = (by + (parseFloat(value3.height) / 2));
		  						break;

		  					case "y-static":
		  						address["x"] = (bx + ((parseFloat(value3.width) * config[wtype].width) / 2));
		  						address["y"] = (by + (parseFloat(value3.height) / 2));
		  						break;

		  					case "x-static":
		  						address["x"] = (bx + (parseFloat(value3.width) / 2));
		  						address["y"] = (by + ((parseFloat(value3.height) * config[wtype].height)/ 2));
		  						break;
		  					case "nostatic":
		  						address["x"] = (bx + ((parseFloat(value3.width) * config[wtype].width) / 2));
		  						address["y"] = (by + ((parseFloat(value3.height) * config[wtype].height)/ 2));
		  						break;

		  				}

		  			
				})
			})
		})
		return tree;
}

function setup (){
	switch(step){
		case 0:
			console.log(`Setup will now begin. Please make sure you are logged out of your epicgames account. \n\n
			After the setup is complete, avoid moving the window as that will offset the configurations and will
			require you to go through this process again\n\n\n`)

			console.log("STEP 1: Please alt+click the top left of your window.\n")
			break;
		case 1:
			console.log("STEP 2: Please alt+click the bottom right of your window.\n")
			break;
		
		case 2:
			console.log("STEP 3: Now please login and click friends, press c when finished\n")
			break;

		case 3:
			console.log("STEP 4: Please alt+click the top left of your friends window\n")
			break;

		case 4:
			console.log("STEP 5: Please alt+click the bottom left of your friends window\n")
			break;

		case 5:
			console.log("STEP 6: Now click the add friends button, press c when finished\n")
			break;

		case 6:
			console.log("STEP 7: Please alt+click the top left of your add friends window\n")
			break;

		case 7:
			console.log("STEP 8: Please alt+click the bottom left of your add friends window\n")
			break;

		case 8:
			console.log("STEP 9: Now close your add friends window and your friends window, press c when finished\n")
			break;

		case 10:
			console.log("STEP 10: Now open fortnite and wait for the game to load, press c when loaded\n")
			break;

		case 11:
			console.log("STEP 11: Please alt+click the top left of your game window\n")
			break;

		case 12:
			console.log("STEP 12: Please alt+click the bottom left of your game window\n")
			break;

		case 13:
			console.log(setupVariables)
			let payload = {
						"launcher": 
							{
							"topLeft":setupVariables[0],
							"topRight": {
								"x": setupVariables[1]["x"],
								"y": setupVariables[0]["y"]
							},
							"bottomLeft": {
							 	"x": setupVariables[0]["x"],
							 	"y": setupVariables[1]["y"]
							},
							"bottomRight":setupVariables[1],
							"width": setupVariables[1]["x"] - setupVariables[0]["x"],
							"height": setupVariables[1]["y"] - setupVariables[0]["y"]

							},
						"friendWindow":

							{
							"topLeft":setupVariables[2],
							"topRight": {
								"x": setupVariables[3]["x"],
								"y": setupVariables[2]["y"]
							},
							"bottomLeft": {
							 	"x": setupVariables[2]["x"],
							 	"y": setupVariables[3]["y"]
							},
							"bottomRight":setupVariables[3],
							"width": setupVariables[3]["x"] - setupVariables[2]["x"],
							"height": setupVariables[3]["y"] - setupVariables[2]["y"]
							},
						"addFriendWindow":

							{
							"topLeft":setupVariables[4],
							"topRight": {
								"x": setupVariables[5]["x"],
								"y": setupVariables[4]["y"]
							},
							"bottomLeft": {
							 	"x": setupVariables[4]["x"],
							 	"y": setupVariables[5]["y"]
							},
							"bottomRight":setupVariables[5],
							"width": setupVariables[5]["x"] - setupVariables[4]["x"],
							"height": setupVariables[5]["y"] - setupVariables[4]["y"]
							},
						"gameWindow":

							{
							"topLeft":setupVariables[6],
							"topRight": {
								"x": setupVariables[7]["x"],
								"y": setupVariables[6]["y"]
							},
							"bottomLeft": {
							 	"x": setupVariables[6]["x"],
							 	"y": setupVariables[7]["y"]
							},
							"bottomRight":setupVariables[7],
							"width": setupVariables[7]["x"] - setupVariables[6]["x"],
							"height": setupVariables[7]["y"] - setupVariables[6]["y"]
							}
						}

			fs.writeFile(path.join(__dirname,"..", "/config/config.json"), JSON.stringify(payload), (error) => {});
			config = payload;
			fs.writeFile(path.join(__dirname,"..", "/config/tree.json"), JSON.stringify(construct(data)), (error) => {});

			console.log("STEP 13: Setup finished. Please close the game and the epic games launcher and restart the program\n")
			hook.stop()
			break;

	}

}
setup()