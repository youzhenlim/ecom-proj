const express = require('express');
const bodyParser = require('body-parser');
const usersRepo = require('./repositories/users');

const app = express();

//For app.use() allows all our different route handlers to have access to the middleware function
app.use(bodyParser.urlencoded({extended: true}));

//Req stands for incoming request from a browser to web server
//Res stands for the response that the web server sends back to the browser
app.get('/', (req, res) =>{
    res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email">
                <input name="password" placeholder="password">
                <input name="passwordConfirmation" placeholder="password confirmation">
                <button>Sign Up</button>
            </form>
        </div>
    `);
});

app.post('/', async (req, res) => {
    //Destructuring
    const {email, password, passwordConfirmation} = req.body;

    const existingUser = await usersRepo.getOneBy( {email: email});

    if (existingUser){
        return res.send('Email in use');
    }

    if (password !== passwordConfirmation){
        return res.send('Passwords must match');
    }

    res.send('Account created!')

});

//Listen for incoming network requests on specified port 
app.listen(3001, () => {
    console.log('Listening');
});