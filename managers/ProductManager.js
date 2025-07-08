import fs from 'fs';

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async getProducts({ limit = 10, page = 1, sort = null, query = null } = {}) {
        const products = await this.getProducts();
        let filteredProducts = products;

        if (query) {
            filteredProducts = filteredProducts.filter(product => 
                product.category.includes(query) || 
                (query === 'available' && product.stock > 0) || 
                (query === 'unavailable' && product.stock === 0)
            );
        }

        if (sort) {
            filteredProducts.sort((a, b) => sort === 'asc' ? a.price - b.price : b.price - a.price);
        }

        const totalProducts = filteredProducts.length;
        const totalPages = Math.ceil(totalProducts / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        return {
            status: 'success',
            payload: paginatedProducts,
            totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `/products?page=${page - 1}&limit=${limit}&sort=${sort}&query=${query}` : null,
            nextLink: page < totalPages ? `/products?page=${page + 1}&limit=${limit}&sort=${sort}&query=${query}` : null
        };
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(product => product.id === id);
    }

    async addProduct(product) {
        const products = await this.getProducts();
        const newProduct = { id: Date.now().toString(), ...product };
        products.push(newProduct);
        await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async updateProduct(id, updatedFields) {
        const products = await this.getProducts();
        const productIndex = products.findIndex(product => product.id === id);
        if (productIndex === -1) return null;
        products[productIndex] = { ...products[productIndex], ...updatedFields };
        await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
        return products[productIndex];
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const productIndex = products.findIndex(product => product.id === id);
        if (productIndex === -1) return null;
        products.splice(productIndex, 1);
        await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
        return true;
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }
}

export default ProductManager;
