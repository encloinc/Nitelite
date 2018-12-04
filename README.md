<p align="center">
  <img src="https://raw.githubusercontent.com/encloinc/Nitelite/master/github_data/logo.png" />
</p>

## What is Nitelite?
Nitelite is an Epic Games Launcher and a Fortnite automation tool. This is the ideal way to send any, for example, friend requests since those HTTP endpoints are encrypted by epic games. What this api lets you do is control your profile programatically so that you can make those requests as once intended. It makes use of Tesseract-OCR and robotjs to control the epic games launcher and feedsback what it traces. Nitelite is also a callback based api which means it'll work with most other apis you decide to use it with.

### Awesome! How do I set it up
Setup is extremley simple! First install the library by using
##### `npm install --save Nitelite`
then navigate to the library directory (node_modules/Nitelite), go to utils and run setup.js. It will prompt you to open the Epic Games launcher and alt+click on your
* Epicgames launcer top left and bottom right corners
* Friends window top left and bottom right corners
* Add Friends window top left and bottom right corners
* Fortnites top left and bottom right corners
Once those are done it will prompt you to close fortnite and logout of the Epic Games launcer (do not close it, Nitelite will not work unless it has an unaltered window (by that I mean you havent changed its size or position which you described in setup.js), its logged out and the epic games launcher is open. The epic games launcher also has to be the focused window as Nitelite will control the system mouse to login/logout of the launcher).

## This uses the Beta Launcher, please opt-in to the beta launcher

```js
///Example
const Nitelite = require('Nitelite')
const launcher = new Nitelite();


///This will sign you in to epic games
launcher.signin('your-email','your-password', function(e){
  if (!e.state){
    e.authenticationWindow.insertCode('your-auth-code-if-prompted', function(e){
      if (e.state){console.log("signed in")}
    })
  }else{
    console.log("signed in")
  }
});
```

### Docs

#### State object
`stateObj.state: (Boolean) returns if the operation was completed sucessfully or not`
`stateObj.whatever-window-it-opened: returns the window object from what it opened`

#### Launcher object
### Methods
`signin(email, password, callback)`
* email: (String) your epic games email
* password: (String) your epic games password
* callback:(Function) returns state object
 
 
