const express = require('express');
const usersRepo = require('../../repositories/users');

const router = express.Router();

//Req stands for incoming request from a browser to web server
//Res stands for the response that the web server sends back to the browser
router.get('/signup', (req, res) =>{
    res.send(`
        <div>
            Your ID is : ${req.session.userId}
            <form method="POST">
                <input name="email" placeholder="email">
                <input name="password" placeholder="password">
                <input name="passwordConfirmation" placeholder="password confirmation">
                <button>Sign Up</button>
            </form>
        </div>
    `);
});

router.post('/signup', async (req, res) => {
    //Destructuring
    const {email, password, passwordConfirmation} = req.body;

    const existingUser = await usersRepo.getOneBy( {email: email});

    if (existingUser){
        return res.send('Email in use');
    }

    if (password !== passwordConfirmation){
        return res.send('Passwords must match');
    }

    const user = await usersRepo.create({email, password});

    req.session.userId = user.id;

    res.send('Account Created!!!');
});

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are logged out');
});

router.get('/signin', (req, res) => {
    res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email">
                <input name="password" placeholder="password">
                <button>Sign In</button>
            </form>
        </div>
    `);
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    const user = await usersRepo.getOneBy({email});
    if(!user){
        return res.send('Email not found');
    }

    const validPassword = await usersRepo.comparePasswords(user.password, password);

    if(!validPassword){
        return res.send('Passwords do not match');
    }

    req.session.userId = user.id;

    res.send('You are signed in!');
});


module.exports = router;