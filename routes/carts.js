const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');

const router = express.Router();
  
// Receive post request to add item to cart
router.post('/cart/products', async (req,res) => {
    
    let cart;

    //Does user have existing cart?
    if(!req.session.cartId){
        cart = await cartsRepo.create({ items: [] });
        req.session.cartId = cart.id;
    }

    else{
        cart = await cartsRepo.getOne(req.session.cartId);
    }

    //Increment quantity or add new product to cart?
    const existingItem = cart.items.find(item => item.id === req.body.productId);
    
    if(existingItem){
        existingItem.quantity++;
    }

    else{
        cart.items.push({id: req.body.productId, quantity: 1}); 
    }

    await cartsRepo.update(cart.id, {
        items: cart.items
    });

    res.redirect('/cart');
});

// Receive get request to show all items in cart
router.get('/cart', async (req, res) => {
    if(!req.session.cartId){
        return res.redirect('/');
    }

    const cart = await cartsRepo.getOne(req.session.cartId);

    for (let item of cart.items){
        const product = await productsRepo.getOne(item.id);

        item.product = product;
    }

    res.send(cartShowTemplate({ items: cart.items }));

});

// Receive post request to delete item from cart
router.post('/cart/products/delete', async (req, res) => {
    const { itemId } = req.body;
    const cart = await cartsRepo.getOne(req.session.cartId);

    const items = cart.items.filter(item => item.id !== itemId);

    await cartsRepo.update(req.session.cartId, {items});

    res.redirect('/cart');
});

module.exports = router;