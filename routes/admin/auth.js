const express = require('express');
const { check, validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { requireEmail, requirePassword, requirePasswordConfirmation } = require('./validators');

const router = express.Router();

//Req stands for incoming request from a browser to web server
//Res stands for the response that the web server sends back to the browser
router.get('/signup', (req, res) =>{
    res.send(signupTemplate( {req} ));
});

router.post('/signup', [
    requireEmail, 
    requirePassword, 
    requirePasswordConfirmation
    ], 
    async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.send(signupTemplate({req, errors}))
    }
 
    //Destructuring
    const {email, password, passwordConfirmation} = req.body;

    const user = await usersRepo.create({email, password});

    req.session.userId = user.id;

    res.send('Account Created!!!');
});

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are logged out');
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate());
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