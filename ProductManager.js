// Desafio Entregable

// Realizar una clase de nombre “ProductManager”, el cual permitirá trabajar con múltiples productos. Éste debe poder agregar, consultar, modificar y eliminar un producto y manejarlo en persistencia de archivos (basado en entregable 1).

// La clase debe contar con una variable this.path, el cual se inicializará desde el constructor y debe recibir la ruta a trabajar desde el momento de generar su instancia.

// Debe guardar objetos con el siguiente formato:
// id (se debe incrementar automáticamente, no enviarse desde el cuerpo)
// title (nombre del producto)
// description (descripción del producto)
// price (precio)
// thumbnail (ruta de imagen)
// code (código identificador)
// stock (número de piezas disponibles)

// Debe tener un método addProduct el cual debe recibir un objeto con el formato previamente especificado, asignarle un id autoincrementable y guardarlo en el arreglo (recuerda siempre guardarlo como un array en el archivo).

// Debe tener un método getProducts, el cual debe leer el archivo de productos y devolver todos los productos en formato de arreglo.

// Debe tener un método getProductById, el cual debe recibir un id, y tras leer el archivo, debe buscar el producto con el id especificado y devolverlo en formato objeto

// Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID 

// Debe tener un método deleteProduct, el cual debe recibir un id y debe eliminar el producto que tenga ese id en el archivo.


import fs from 'fs';

class ProductManager {

    #products 
    path

    constructor (path){
        this.#products = []
        this.path = path
        this.#loadProducts()
    };

    #loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf-8');
            this.#products = JSON.parse(data);
        } catch (err) {
            console.error(`Error al leer el archivo: ${err}`);
            this.#products = [];
        }
    }

    #saveProducts() {
        try {
            const data = JSON.stringify(this.#products, null, 2); 
            fs.writeFileSync(this.path, data);
        } catch (err) {
            console.error(`Error al guardar el archivo: ${err}`);
        }
    }

    getProducts () {
        return this.#products
    };

    getProductById (id) {
        return this.#products.find((product) => product.id === id);
    };

    #areFieldComplete (title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Por favor completa todos los campos");
            return false; 
            
        } else { 
            return true; 
        };
    };

    #isNotDuplicate (code) {
        if(this.#products.find((product) => product.code === code) !== undefined){
            console.error("El codigo ya existe, posible producto duplicado.");
            return false;
        } else {
            return true;
        };
    };

    #idGenerator () {
        let id = 0;
        if(this.#products.length === 0){
            id = 1;
        } else {
            id = this.#products[this.#products.length-1].id + 1;
        };
        return id;
    };

    addProduct (title, description, price, thumbnail, code, stock) {
        
        if(this.#areFieldComplete(title, description, price, thumbnail, code, stock) && this.#isNotDuplicate(code)){
            const newProduct = {
                id: this.#idGenerator(),
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock
            }
            this.#products.push(newProduct);
            this.#saveProducts();
        };
    };

    updateProduct (id, updatedProduct) {
        const index = this.#products.findIndex((product) => product.id === id);
        if (index !== -1) {
            this.#products[index] = {...this.#products[index], ...updatedProduct};
            this.#saveProducts();
        } else {
            console.error(`No se encontró el producto con id ${id}`);
        }
    };

    deleteProduct (id) {
        const index = this.#products.findIndex((product) => product.id === id);
        if (index !== -1) {
            this.#products.splice(index, 1);
            this.#saveProducts();
        } else {
            console.error(`No se encontró el producto con id ${id}`);
        }
    };
};

const productManager = new ProductManager('./products.json');

// Agregar producto 
productManager.addProduct("producto prueba 1", "Este es un producto prueba 1", 100, "Sin imagen", "abc121", 25);
console.log(productManager.getProducts());


/* Sacar comentarios para ver mas pruebas

// Eliminar producto
productManager.addProduct("producto prueba 2", "Este es un producto prueba 2", 200, "Sin imagen", "abc122", 26);
productManager.deleteProduct(2)
console.log(productManager.getProducts());

// Evitar repetidos
productManager.addProduct("producto prueba 3", "Este es un producto prueba 3", 300, "Sin imagen", "abc123", 27);
productManager.addProduct("producto prueba 3", "Este es un producto prueba 3", 300, "Sin imagen", "abc123", 27);
console.log(productManager.getProducts());

*/

// Actualizar campo de un producto en especifico
productManager.updateProduct(1, { price: 111 });
console.log(productManager.getProducts());

// Ver producto por ID
productManager.getProductById(3);
