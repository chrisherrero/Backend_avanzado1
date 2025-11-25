const fs = require('fs');

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(data);
            }
            return [];
        } catch (error) {
            return [];
        }
    }

    async createCart() {
        const carts = await this.getCarts();
        // ID autogenerado
        const id = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
        
        const newCart = {
            id: id,
            products: []
        };
        
        carts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(c => c.id === id) || null;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(c => c.id === cartId);

        if (cartIndex !== -1) {
            // Ver si el producto ya existe en el carrito
            const productIndex = carts[cartIndex].products.findIndex(p => p.product === productId);

            if (productIndex !== -1) {
                // Si existe, sumamos quantity
                carts[cartIndex].products[productIndex].quantity++;
            } else {
                // Si no, lo agregamos con quantity: 1
                carts[cartIndex].products.push({ product: productId, quantity: 1 });
            }

            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            return carts[cartIndex];
        }
        return null;
    }
}

module.exports = CartManager;