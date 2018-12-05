const ini = require("ini")
const fs = require('fs')
const {platform, homedir} = require("os");
const {join} = require("path");

function getPath() {
	let appDataPath = join(homedir(), "AppData", "Roaming");
	return join(appDataPath, '..', '/Local/EpicGamesLauncher/Saved/Config/Windows/GameUserSettings.ini')
}

function serialize(object){
	let __object = object;

	for (let i in __object){
		__object[i] = __object[i].split("=")[1]
	}

	return {
		topLeft:
		{
			x: Math.round(parseFloat(__object[0])),
			y: Math.round(parseFloat(__object[1]))
		},
		topRight:
		{
			x: Math.round(parseFloat(__object[2])),
			y: Math.round(parseFloat(__object[1]))

		},
		bottomLeft:
		{
			x: Math.round(parseFloat(__object[0])),
			y: Math.round(parseFloat(__object[3]))
		},
		bottomRight:
		{
			x: Math.round(parseFloat(__object[2])),
			y: Math.round(parseFloat(__object[3]))
		},
		width: Math.round(parseFloat(__object[2])) - Math.round(parseFloat(__object[0])),
		height: Math.round(parseFloat(__object[3])) - Math.round(parseFloat(__object[1]))

	}	
}

function getDataObject(){
	var config = ini.parse(fs.readFileSync(getPath(), 'utf-8'))

	let globalConfig = {};

	globalConfig["launcher"] = serialize(config.WindowSettings.MainLauncherWindow.split('"')[1].split(" "));
	globalConfig["friendWindow"] = serialize(config.WindowSettings.FriendsListWindow.split('"')[1].split(" "));
	globalConfig["addFriendWindow"] = serialize(config.WindowSettings["Add Friend"].split('"')[1].split(" "));
	globalConfig["gameWindow"] = serialize(config.WindowSettings.MainLauncherWindow.split('"')[3].split(" "));

	return globalConfig;
}


console.dir(getDataObject())

//MainLauncherWindow
//FriendListWindow
//Add Friend
