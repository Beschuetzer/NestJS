import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.model';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  insertProduct(product: Product) {
    this.products.push(product);
    return product.id;
  }

  getProducts() {
    //making sure to return a new array with same values rather than the pointer to the private products instance property (JS returns references for arrays and objects rather than values)
    //alternatively:
    //return [...this.products];
    return JSON.parse(JSON.stringify(this.products));
  }

  getProduct(productId: string) {
    return { ...this.findProduct(productId).product };
  }

  updateProduct(id: string, title: string, description: string, price: number) {
    const { product, index } = this.findProduct(id);
    const productCopy = { ...product };
    if (title) productCopy.title = title;
    if (description) productCopy.description = description;
    if (price && price > 0) productCopy.price = price;
    this.products[index] = productCopy;
  }

  deleteProduct(id: string) {
    const { index } = this.findProduct(id);
    this.products.splice(index, 1);
  }

  //NOTE: any time you are return an object or array, return a copy instead of the reference to prevent unintentional changing of the original
  private findProduct(id) {
    const foundProductIndex = this.products.findIndex(
      (product) => product.id === id,
    );
    const foundProduct = this.products[foundProductIndex];
    if (!foundProduct) {
      throw new NotFoundException(`Product ID: ${id} not found!`);
    }
    return { product: foundProduct, index: foundProductIndex };
  }
}
