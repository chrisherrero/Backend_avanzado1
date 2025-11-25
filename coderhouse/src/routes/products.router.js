const { Router } = require('express');
const ProductManager = require('../managers/ProductManager');

const router = Router();


const manager = new ProductManager('./data/products.json');


router.get('/', async (req, res) => {
    try {
        const products = await manager.getProducts();
        const limit = req.query.limit;
        
        if (limit) {
           
            return res.send(products.slice(0, limit));
        }
        res.send(products);
    } catch (error) {
        res.status(500).send({ status: "error", message: "Error al obtener productos" });
    }
});


router.get('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid); 
        const product = await manager.getProductById(pid);
        
        if (!product) {
            return res.status(404).send({ status: "error", message: "Producto no encontrado" });
        }
        res.send(product);
    } catch (error) {
        res.status(500).send({ status: "error", message: "Error al buscar el producto" });
    }
});


router.post('/', async (req, res) => {
    try {
        const newProduct = req.body; 
        const addedProduct = await manager.addProduct(newProduct);
        
        if (!addedProduct) {
            return res.status(400).send({ status: "error", message: "Faltan campos o el código ya existe" });
        }
        
        res.status(201).send({ status: "success", payload: addedProduct });
    } catch (error) {
        res.status(500).send({ status: "error", message: "Error al guardar el producto" });
    }
});


router.put('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const updates = req.body;
        const updatedProduct = await manager.updateProduct(pid, updates);
        
        if (!updatedProduct) {
            return res.status(404).send({ status: "error", message: "Producto no encontrado" });
        }
        
        res.send({ status: "success", payload: updatedProduct });
    } catch (error) {
        res.status(500).send({ status: "error", message: "Error al actualizar el producto" });
    }
});


router.delete('/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const result = await manager.deleteProduct(pid);
        
        if (!result) {
            return res.status(404).send({ status: "error", message: "Producto no encontrado" });
        }
        
        res.send({ status: "success", message: "Producto eliminado" });
    } catch (error) {
        res.status(500).send({ status: "error", message: "Error al eliminar el producto" });
    }
});

module.exports = router;
