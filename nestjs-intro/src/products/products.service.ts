import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  //Injecting the Mongoose Product model for use in ProductsService;  access via 'this.modelName' or 'this.productModel' for below example:
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async insertProduct(title: string, description: string, price: number) {
    //projectModel is a constructor function (used like creating a class with 'new')

    //NOTE: One was to use the productModel
    const newProduct = new this.productModel({
      title,
      description,
      price,
    });
    await newProduct.save();

    //NOTE: The more vanilla-like way:
    // const newProduct2 = this.productModel.create({
    //   title: 'this was created separately',
    //   description,
    //   price,
    // });

    // const result = (await newProduct2).save();
    // console.log(result);

    //APIs generally return JSON data, so return {id} to tell nestJS to set header type to application/json; nestJS also sets header type to application/json if you return a list
    return newProduct.id as string;
  }

  async getProducts() {
    //making sure to return a new array with same values rather than the pointer to the private products instance property (JS returns references for arrays and objects rather than values)
    //alternatively:
    //return [...this.products];
    const products = await this.productModel.find().exec();

    //Mapping the MongoDB response object to an object that matches the Project Model
    return this.getProductModelFromMongoDBResponse(products);
  }

  async getProduct(productId: string) {
    return await this.findProduct(productId);
  }

  updateProduct(id: string, title: string, description: string, price: number) {
    // const { product, index } = this.findProduct(id);
    // const productCopy = { ...product };
    // if (title) productCopy.title = title;
    // if (description) productCopy.description = description;
    // if (price && price > 0) productCopy.price = price;
    // this.products[index] = productCopy;
  }

  deleteProduct(id: string) {
    // const { index } = this.findProduct(id);
    // this.products.splice(index, 1);
  }

  //NOTE: any time you are return an object or array, return a copy instead of the reference to prevent unintentional changing of the original
  private async findProduct(id) {
    const foundProduct = await this.productModel.findById(id);
    if (!foundProduct) {
      throw new NotFoundException(`Product ID: ${id} not found!`);
    }
    return this.getProductModelFromMongoDBResponse([foundProduct])[0];
  }

  private getProductModelFromMongoDBResponse(products: Product[]) {
    return products.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
    }));
  }
}
