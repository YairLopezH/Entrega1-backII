import fs from 'fs';
import ProductManager from './ProductManager.js';

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.productManager = new ProductManager('./data/products.json');
    }

    async createCart() {
        const carts = await this.getCarts();
        const newCart = { id: Date.now().toString(), products: [] };
        carts.push(newCart);
        await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async getCarts() {
        try {
            const data = await fs.promises.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === id);
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) return null;

        const product = await this.productManager.getProductById(productId);
        if (!product) return null;

        const existingProductIndex = cart.products.findIndex(p => p.id === productId);
        if (existingProductIndex === -1) {
            cart.products.push({ id: productId, quantity: 1 });
        } else {
            cart.products[existingProductIndex].quantity += 1;
        }

        await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
        return cart;
    }

    async deleteProductFromCart(cartId, productId) {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) return null;

        cart.products = cart.products.filter(product => product.id !== productId);
        await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
        return cart;
    }

    async updateCart(cartId, products) {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) return null;

        cart.products = products;
        await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
        return cart;
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) return null;

        const product = cart.products.find(product => product.id === productId);
        if (product) {
            product.quantity = quantity;
        }
        await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
        return cart;
    }

    async clearCart(cartId) {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) return null;

        cart.products = [];
        await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
        return cart;
    }
}

export default CartManager;
