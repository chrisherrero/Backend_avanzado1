const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    // Leer todos los productos del archivo
    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(data);
            } else {
                return [];
            }
        } catch (error) {
            return [];
        }
    }

    // Agregar producto con validaciones e ID autoincremental
    async addProduct(product) {
        const products = await this.getProducts();

        // Validar campos obligatorios
        if (!product.title || !product.description || !product.price || !product.code || !product.stock || !product.category) {
            console.error("Todos los campos son obligatorios");
            return null;
        }

        // Validar que el código no se repita
        if (products.some(p => p.code === product.code)) {
            console.error("El código del producto ya existe");
            return null;
        }

        // Autogenerar ID
        const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

        const newProduct = {
            id: id,
            title: product.title,
            description: product.description,
            code: product.code,
            price: product.price,
            status: true, // Por defecto true según consigna
            stock: product.stock,
            category: product.category,
            thumbnails: product.thumbnails || [] // Array vacío si no viene nada
        };

        products.push(newProduct);

        // Escribir en el archivo
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        return newProduct;
    }

    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find(p => p.id === id);
        return product || null;
    }

    async updateProduct(id, updates) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);

        if (index !== -1) {
            // Actualizamos solo los campos enviados, manteniendo el ID original
            const updatedProduct = { ...products[index], ...updates, id: id };
            products[index] = updatedProduct;
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            return updatedProduct;
        }
        return null;
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const newProducts = products.filter(p => p.id !== id);
        
        if (products.length !== newProducts.length) {
            await fs.promises.writeFile(this.path, JSON.stringify(newProducts, null, '\t'));
            return true;
        }
        return false;
    }
}

module.exports = ProductManager;