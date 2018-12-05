const robot = require("robotjs");
const path = require("path")
const fs = require("fs")
const config = JSON.parse(fs.readFileSync(path.join(__dirname,"..", "/config/config.json"), 'utf8'));
let data = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "/config/positions.json"), 'utf8'));


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
const tree = construct(data);
fs.writeFile(path.join(__dirname, ".." ,"/config/tree.json"), JSON.stringify(tree), (error) => {});
