const Nitelite = require('./index.js')
const launcher = new Nitelite();


function launcherSignIn(email, password, authCode, callback){
	launcher.signin(email, password, function(state){

		if(state.state){
			state.mainWindowLauncher.openFriendsWindow(function(state){
				
				state.friendsWindow.openAddFriendsWindow(function(state){
					return callback(state.addFriendsWindow);

				});
			});
		
		}else{
			
			state.authenticationWindow.insertCode(authCode, function(state){
				if(state.state){
					state.mainWindowLauncher.openFriendsWindow(function(state){
					
					state.friendsWindow.openAddFriendsWindow(function(state){
						return callback(state.addFriendsWindow);

					});
				});
				}else{
					console.log("Error? Did your authcode reset")
				}
			})
		}

	});
}

function logout(addFriendsWindow){
	addFriendsWindow.close(function(state){
		state.friendsWindow.close(function(state){
			state.mainWindowLauncher.signout(function(state){

				console.log("Logged out!")
			})
		})
	
	})
}

let i = 0;

const friends = ["friend1", "friend2", "friend3", "friend4", "friend5"]

launcherSignIn('your-epicgames-email', 'your-epicgames-password', 'your-auth-code-if-prompted', function(addFriendsWindow){
	addFriend(addFriendsWindow)
});

function addFriend(addFriendsWindow){
	if (i < friends.length){
		
		
		addFriendsWindow.addFriend(friends[i], function(e){
			i++;
			addFriend(addFriendsWindow);
		});
		
	
	}else{

		logout(addFriendsWindow)
	}
}