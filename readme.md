# About: School project - A lightweight instagram application
#### School: LERNIA Javascript developer, YHJUST16, internship 2 (autumn 2017), ( Stockholm, Sweden )
##### Purpose: Compare with the prev. created React app (bvikingimgz). Pros / Cons etc.
##### Author: Mats Wikmar, mow-github, matwik@gmail.com

![bviking](img/bVikingFullBlack-logo-150x150.png)
![angular-logo-150x150](img/angular-logo-150x150.png)
![redux-logo-150x150](img/redux-logo-150x150.png)
![firebase-logo-150x150](img/firebase-logo-150x150.png)

##### Technologies:
* HTML5
* `CSS3`
* Bootstrap 4
* `Angular`
* Redux
* `Redux-thunk ( async request )`
* Firebase v3 ( realtime-DB )

###### Installation example:
<pre>git clone https://github.com/mow-github/bvikingimgz-angular5.git</pre>

###### Instructions localhost:
1. `npm install`
2. `npm run start-local`

###### Heroku app - live:
<pre>https://bvikingimgz-angular5.herokuapp.com</pre>



```

// angular - heroku setup

// git add . 
// git commit -m"msg"
// npm run deploy

1. Follow the (Reference):          "Angular - heroku setup" 
2. Add a heroku-repo connection:    heroku git:remote -a bvikingimgz-angular5
3. Modify the package.json:

      "engines": {
        "node": "8.9.4",
        "npm": "5.5.1"
      },
      "scripts": {
        "ng": "ng",
        "start-local": "ng serve",
        "build": "ng build",
        "test": "ng test",
        "lint": "ng lint",
        "e2e": "ng e2e",
        "postinstall": "ng build --prod --aot=false", // build for prod.
        "start": "node server.js"                     // run when we push to heroku
      },
      "dependencies": {
        "@angular/cli": "1.6.3",                      // moved from dev-depend...
        "express": "^4.16.2",                         // added so we can serve the files
        "@angular/compiler": "^5.0.0",                // moved from dev-depend...
        "@angular/compiler-cli": "^5.0.0"             // moved from dev-depend...
        "bootstrap": "4.0.0-beta.2",                  // bootstrap may give error, use this version atm
      },
      
4. Add a server.js that serves the heroku content


    const express = require('express');
    const app = express();
    const path = require('path');
    
    
    const forceSSL = function() {
      return function (req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
          return res.redirect(
            ['https://', req.get('Host'), req.url].join('')
          );
        }
        next();
      }
    };
    
    app.use(forceSSL());
    app.use(express.static(__dirname + '/dist'));
    
    
    app.get('/*', function(req, res) {
      res.sendFile(path.join(__dirname + '/dist/index.html'));
    });
    
    app.listen(process.env.PORT || 8080);
       

```


###### References:
* [Angular - doc](https://angular.io/)
* [Angular - heroku setup](https://medium.com/@ryanchenkie_40935/angular-cli-deployment-host-your-angular-2-app-on-heroku-3f266f13f352)

<hr>

> _"Failure is just a symptom for success"_

`          | Links          | My webpage                              |
---------- | -------------- | --------------------------------------- |
*Author(s)*| `Mats Wikmar`  | [bviking.se](https://www.bviking.se)    |
