// agregamos file system al proyecto
import fs from "fs";

// clase constructora de productos
class ProductManager {
  constructor(path) {
    this.path = path;
  }

  // método para traer los productos del archivo
  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const products = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(products);
      } else {
        return [];
      }
    } catch (error) {
      return error;
    }
  }

  // método para agregar productos
  async addProduct(title, description, code, price, status, stock, category, thumbnail) {
    try {
      const products = await this.getProducts();
      if (!title || !description || !code || !price || !stock || !category) {
        return console.log("error: All fields are required");
      } else if (products.some((product) => product.code === code.trim())) {
        return console.log("error: Product code already exists");
      } else {
        const product = {
          id: products.length ? products[products.length - 1].id + 1 : 1,
          title: title.trim(),
          description: description.trim(),
          code: code.trim(),
          price: price,
          status: status,
          stock: stock,
          category: category.trim(),
          thumbnail: thumbnail.trim(),
        };
        products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(products));
      }
    } catch (error) {
      return error;
    }
  }
  
  

  // método para obtener un producto por su id
  async getProductById(id) {
    try {
      const products = await this.getProducts();
      return (
        products.find((product) => product.id == id) || {
          error: "Product Not Found",
        }
      );
    } catch (error) {
      return error;
    }
  }

 // Método para actualizar información del producto por su id
async updateProductById(id, data) {
  try {
    const products = await this.getProducts();
    const productIndex = products.findIndex((product) => product.id == id);
    if (productIndex === -1) {
      return { error: "Product Not Found" };
    }

    // Validación de que no se pueda modificar el id del producto
    if (data.id && data.id !== id) {
      throw new Error("Updating the product ID is not allowed");
    }

    // Actualiza solo los campos proporcionados en el cuerpo de la solicitud
    const updatedProduct = { ...products[productIndex], ...data };
    products[productIndex] = updatedProduct;
    await fs.promises.writeFile(this.path, JSON.stringify(products));
    return updatedProduct;
  } catch (error) {
    return error;
  }
}


  // método para eliminar un producto por su id
  async deleteProductById(id) {
    try {
      const products = await this.getProducts();
      const newProductsArray = products.filter((product) => product.id != id);
      await fs.promises.writeFile(this.path, JSON.stringify(newProductsArray));
    } catch (error) {
      return error;
    }
  }
}

// exportamos la clase
export const productManager = new ProductManager("productsAPI.json");
