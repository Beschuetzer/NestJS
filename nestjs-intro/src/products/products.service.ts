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
    const foundProduct = this.products.find(
      (product) => product.id === productId,
    );
    if (!foundProduct) {
      throw new NotFoundException(`Product ID: ${productId} not found!`);
    }
    return { ...foundProduct };
  }
}
