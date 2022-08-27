This is trucks&loads app, created as a node.js homework in EPAM Frontend lab.

This app is created like an delivery app, where users can be shipper or driver. 
Drivers can create trucks, delete them, assign them for himself and control load, whick he is delivering now. 
Shippers cn create loads, delete them and see information about their loads. 
Both roles can see information about themselves in 'About' section.

Backend part of app created using express and mongoose libraries, mongoDB as database.
Also, in backend part I am using bcryptjs for password hashing, nodemailer to send emails to users and jsonwebtoken to add authorization with jwt-token.

Frontend part buil using React library.

If you want run the app, run followed commands in root directory:
    npm i;
    npm run client:install;
    npm run dev;