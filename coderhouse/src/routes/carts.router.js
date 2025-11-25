const { Router } = require('express');
const CartManager = require('../managers/CartManager');

const router = Router();

const manager = new CartManager('./data/carts.json');


router.post('/', async (req, res) => {
    try {
        const newCart = await manager.createCart();
        res.status(201).send({ status: "success", payload: newCart });
    } catch (error) {
        res.status(500).send({ status: "error", message: "Error al crear carrito" });
    }
});


router.get('/:cid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const cart = await manager.getCartById(cid);
        
        if (!cart) {
            return res.status(404).send({ status: "error", message: "Carrito no encontrado" });
        }
        
        res.send(cart.products); 
    } catch (error) {
        res.status(500).send({ status: "error", message: "Error al obtener el carrito" });
    }
});


router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);
        
        const cart = await manager.addProductToCart(cid, pid);
        
        if (!cart) {
            return res.status(404).send({ status: "error", message: "Carrito o Producto no encontrado" });
        }
        
        res.send({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).send({ status: "error", message: "Error al agregar producto al carrito" });
    }
});

module.exports = router;
