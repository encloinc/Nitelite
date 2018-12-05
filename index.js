
//Library imports

const robot = require('robotjs');
const path = require('path')
const fs = require('fs')
const screenshot = require('screenshot-node');
const tesseract = require('node-tesseract-ocr-fixed');
const { exec } = require('child_process');
const setup = require(path.join(__dirname, './lib/setup.js'))


//Global Variables

const rawObject = setup.setup()

const config = rawObject.config;

const tree = rawObject.tree;




function waitForThreshold(threshold, time, timesRepeatedAllowed){
		//If a page wont load (for example the add friends page) it will return false

		return new Promise((resolve, reject) => {
			
			let length = 0;		
			let timesRepeated = 0;

			let interval = setInterval(function(){

				//Save screenshot of window to pass to tesseract
				screenshot.saveScreenshot(config.launcher.topLeft.x, config.launcher.topLeft.y, config.launcher.width, config.launcher.height, path.join(__dirname, './tmp/snapshot.png'), function(err){
	    			
					/*
					Option 12 of tesseract which instructs to find as many word possible in no order (In this case desirable since the page status is measured by the amount
					of words on the page)
					*/

	    			var options = {
				   		psm: 12,
				   		binary: path.join(__dirname, "./utils/bin/tesseract.exe")
					};

					//Instantiates tesseract from snapshot.png
					tesseract.process(path.join(__dirname,'./tmp/snapshot.png'), options,function(err, text) {
					    if(err) {

					    	//If tesseract throws an error, show it
					        console.error(err);

					        //The amount of text data tesseract returned, in this case its 0 since an error was caused
					        length = 0;
					    } else {

					    	//The amount of text data tesseract returned
					        length = text.split('\n\n').length;
					    }

					    if (length > threshold){

					    	clearInterval(interval)
					    	resolve(true)
					    
					    }else if(timesRepeated > timesRepeatedAllowed){

					    	clearInterval(interval)
					    	resolve(false)
					    }
					});
				
				})

				timesRepeated++;
			
			}, time)
		})

}




function type(parent, name, string, callback){

	const pos = {
		x : parent.address[name].x,
		y : parent.address[name].y
	}


	exec(`node ${path.join(__dirname, './lib/robotjswrapper.js ')} -t 1 -s ${string} -x ${pos.x} -y ${pos.y}`, (error, stdout, stderr) => {
		if (error) {
			return callback(false);

		}else if (stdout.startsWith("finished")){

			return callback(true);
		}
	});

}

function click(parent, name, callback){
	const pos = {
		x : parent.address[name].x,
		y : parent.address[name].y
	}


	exec(`node ${path.join(__dirname, './lib/robotjswrapper.js ')} -t 2 -s null -x ${pos.x} -y ${pos.y}`, (error, stdout, stderr) => {
		if (error) {
			return callback(false)

		}else if (stdout.startsWith("finished")){
			
			return callback(true)
		}
	});
}


class Launcher {
	
	constructor(){


		if(config[0] == false){
			throw new Error(`This is an error. Errors are bad. Please report this error on the github repository and tell us how to reproduce it: 1`);

		}else{

			this.address = tree.launcher.signin;
			this.signinDisabled = false;
			this.window = null;
			this.screen = 'signInWindow'
		}
	
	}


	signin(email, password, callback){
		if (!this.signinDisabled){

			this.window = new signInWindow(this, email, password, false, callback);
		}else{

			throw 'LauncherError: Launcher isnt in sign in state. Please use corresponding object'
		}
	}



}

class signInWindow {

	constructor(__parent, __email, __password, __ignore, __callback){

		this.name = 'signInWindow'
		this.ignore = __ignore;
		this.parent = __parent;
		this.parent.screen = this.name;
		this.email = __email;
		this.password = __password;
		this.callback = __callback;

		if(!(this.ignore)){
			this.signin(this.email, this.password, this.callback);
		}
	}

	signin(email, password, callback){

		if (this.parent.screen != this.name){
			throw 'LauncherError: Cannot call methods from unfocused windows'
			return callback({state: false})
		}
		
		//Calls robot wrapper to type the email
		const __this = this;

		type(__this.parent, 'email_input_box', email, function(state){
			
			//Calls robot wrapper to type the password
			type(__this.parent, 'password_input_box', password, function(state){

				//Clicks signin button to instantiate signin
				click(__this.parent, 'signin_button', function(state){

					__this.__cfc(callback)
				
				})
			});

		})
	}
		

	close(callback){

		//Since there is no way to check if a window is overlapping another, only allow methods from windows that were called last or the 'focused window'
		if (this.parent.screen != this.name){
			
			throw 'LauncherError: Cannot call methods from unfocused windows'
			return callback({state: false})
		}
		

		//This method should not be called at all on the signInWindow or the mainWindowLauncher as that closes the Epic Games Launcer
		
		throw 'LauncherError: Cannot close signInWindow or mainWindowLauncher'
		return callback({state: false})
	}

	__cfc(callback){

		//Saves this variable for later use and to avoid overlapping with the setInterval function
		const __this = this;

		waitForThreshold(30, 5000, 2).then( function(e){
			if (e){

				//Notify parent (which will always be the Launcher object on all classes) of the window change
				
				__this.parent.window = new mainWindowLauncher(__this.parent);

				return callback({state: true, mainWindowLauncher: __this.parent.window})
			}else{

				//If unable to load the window, return false
				
				__this.parent.window = new authenticationWindow(__this.parent);
				return callback({state: false, authenticationWindow: __this.parent.window})
			}
		
		})

	}
}

class authenticationWindow{
	
	constructor(p){

		this.name = 'authenticationWindow'
		this.parent = p;
		this.parent.screen = this.name
		this.parent.address = tree.launcher.authenticate;
	
	}

	insertCode(code, callback){
		const __this = this;

		type(__this.parent, "code_input_box", code, function(state){
			
			click(__this.parent, "continue_button", function(state){

				__this.__cfc(callback)
			})

		});




	}


	close(callback){

		//Since there is no way to check if a window is overlapping another, only allow methods from windows that were called last or the 'focused window'
		if (this.parent.screen != this.name){
			
			throw 'LauncherError: Cannot call methods from unfocused windows'
			return callback({state: false})
		}

		const __this = this;

		click(__this.parent, 'close', function(state){

			setTimeout(function(){

				__this.parent.window = new signInWindow(__this.parent)
				
				return callback({state: true, signInWindow: __this.parent.window})

			}, 500)
		})
		
	}


	__cfc(callback){

		const __this = this;

		waitForThreshold(30, 5000, 3).then( function(e){
			if (e){

				//Notify parent (which will always be the Launcher object on all classes) of the window change
				
				__this.parent.window = new mainWindowLauncher(__this.parent);

				return callback({state: true, mainWindowLauncher: __this.parent.window})
			}else{

				//If unable to load the window, return false
				
				return callback({state: false})
			}
		
		})
	}
}

class mainWindowLauncher {

	constructor(p){

		this.name = 'mainWindowLauncher'
		this.parent = p;
		this.parent.screen = this.name
		this.parent.address = tree.launcher.main;
	
	}

	openFriendsWindow(callback){
		//Since there is no way to check if a window is overlapping another, only allow methods from windows that were called last or the 'focused window'

		if (this.parent.screen != this.name){
			throw 'LauncherError: Cannot call methods from unfocused windows'
			return callback({state: false})
		}

		//Clicks the friends button
		const __this = this;
		
		click(this.parent, 'friends_button', function(status){

			//Function waits 200ms to alow any opening window animations to complete
			setTimeout(function(){
				
				//Notify parent (which will always be the Launcher object on all classes) of the window change

				__this.parent.window = new friendsWindow(__this.parent)

				return callback({state: true, friendsWindow: __this.parent.window})
			}, 1000)
		})
		
		

	}

	signout(callback){
		//Since there is no way to check if a window is overlapping another, only allow methods from windows that were called last or the 'focused window'

		if (this.parent.screen != this.name){
			throw 'LauncherError: Cannot call methods from unfocused windows'
			return callback({state: false})
		}

		//Clicks the user profile button

		const __this = this;

		click(__this.parent, 'user_profile_button', function(state){

			//Since the signout button is located under a different higherarchy than all of the other ui elements, it is necessary to update the parent address
			__this.parent.address = tree.launcher.main.after_userprofile_click;

			setTimeout(function(){

				click(__this.parent, 'signout_button', function(state){
					__this.__cfc(callback)
				})

			}, 100)

		})

	}

	close(callback){

		//Since there is no way to check if a window is overlapping another, only allow methods from windows that were called last or the 'focused window'
		if (this.parent.screen != this.name){
			
			throw 'LauncherError: Cannot call methods from unfocused windows'
			return callback({state: false})
		}
		

		//This method should not be called at all on the signInWindow or the mainWindowLauncher as that closes the Epic Games Launcer
		
		throw 'LauncherError: Cannot close signInWindow or mainWindowLauncher'
		return callback({state: false})
	}

	__cfc(callback){
		const __this = this;

		waitForThreshold(3, 5000, 10).then( function(e){
			//Reset parent address

			__this.parent.address = tree.launcher.main;

			if (e){

				//Notify parent (which will always be the Launcher object on all classes) of the window change
				
				__this.parent.window = new signInWindow(__this.parent, '', '', true, null);

				return callback({state: true, signInWindow: __this.parent.window})
			}else{

				//If unable to load the window, return false
				

				return callback({state: false})
			}
		})
	}
}



class friendsWindow {

	constructor(p){

		this.name = 'friendsWindow'
		this.parent = p;
		this.parent.screen = this.name
		this.parent.address = tree.launcher.main_friends_box;
	
	}

	openAddFriendsWindow(callback){
		//Since there is no way to check if a window is overlapping another, only allow methods from windows that were called last or the 'focused window'

		if (this.parent.screen != this.name){
			throw 'LauncherError: Cannot call methods from unfocused windows'
			return callback({state: false})
		}

		const __this = this;

		click(this.parent, 'add_friend_button', function(state){

			__this.__cfc(callback)
		})

	}

	close(callback){

		//Since there is no way to check if a window is overlapping another, only allow methods from windows that were called last or the 'focused window'
		if (this.parent.screen != this.name){
			
			throw 'LauncherError: Cannot call methods from unfocused windows'
			return callback({state: false})
		}

		const __this = this;

		click(__this.parent,'close', function(state){

			

			setTimeout(function(){

				__this.parent.window = new mainWindowLauncher(__this.parent)
				
				return callback({state: true, mainWindowLauncher: __this.parent.window})

			}, 500)
		})

	}

	__cfc(callback){

		const __this = this;

		waitForThreshold(10, 2500, 5).then( function(e){

			if (e){

				//Notify parent (which will always be the Launcher object on all classes) of the window change
				
				__this.parent.window = new addFriendsWindow(__this.parent, '', '', true, null);

				return callback({state: true, addFriendsWindow: __this.parent.window})
			}else{

				//If unable to load the window, return false
				let temp = new addFriendsWindow(__this.parent, '', '', true, null);
				
				addFriendsWindow.close(function(e){
					return callback({state: false})

				})

				}
		
		});
	}
}

class addFriendsWindow {

	constructor(p){

		this.name = 'addFriendsWindow'
		this.parent = p;
		this.parent.screen = this.name
		this.parent.address = tree.launcher.add_friends_window;
	
	}

	addFriend(friend, callback){


		//Since there is no way to check if a window is overlapping another, only allow methods from windows that were called last or the 'focused window'
		if (this.parent.screen != this.name){
			
			throw 'LauncherError: Cannot call methods from unfocused windows'
			return callback({state: false})
		}

		const __this = this;

		type(__this.parent, 'add_friend_input', friend, function(state){

			click(__this.parent, 'send_friend_request_button', function(state){

				setTimeout(function(){

					return callback({state: true})
				}, 2500)
			})

		})

		
	}
	
	checkFriend(){

		//Function that will soon be added to detect if a user has a friend or not
	}

	close(callback){

		//Since there is no way to check if a window is overlapping another, only allow methods from windows that were called last or the 'focused window'
		if (this.parent.screen != this.name){
			
			throw 'LauncherError: Cannot call methods from unfocused windows'
			return callback({state: false})
		}

		const __this = this;

		click(this.parent, 'close', function(state){

			setTimeout(function(){

				__this.parent.window = new friendsWindow(__this.parent)
				
				return callback({state: true, friendsWindow: __this.parent.window})

			}, 500)
		})

	}
}

//Export launcher object
module.exports = Launcher;

