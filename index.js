const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const adminProductsRouter = require('./routes/admin/products');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();

//For app.use() allows all our different route handlers to have access to the middleware function
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(    // Note: The keys can be any random string
    cookieSession({keys: ['gfkdgkfwedsfsewwervcbcveswqd']
    })
);
app.use(authRouter);
app.use(adminProductsRouter);
app.use(productsRouter);
app.use(cartsRouter);

//Listen for incoming network requests on specified port 
app.listen(3001, () => {
    console.log('Listening');
});