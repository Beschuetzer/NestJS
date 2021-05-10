import { Injectable } from '@nestjs/common';
import { Product } from './product.model';

@Injectable()
export class ProductsService {
  products: Product[] = [];

  insertProduct(product: Product) {
    this.products.push(product);
    return product.id;
  }
}