import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Mongoose } from 'mongoose';

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
    return this.getProductModelFromMongoDBResponse([
      await this.findProduct(productId),
    ])[0];
  }

  async updateProduct(
    id: string,
    title: string,
    description: string,
    price: number,
  ) {
    const updatedProduct = await this.findProduct(id);
    if (title) updatedProduct.title = title;
    if (description) updatedProduct.description = description;
    if (price && price > 0) updatedProduct.price = price;
    updatedProduct.save();
    let message = 'Update Successful!';
    if (!updatedProduct) message = 'Update UNSUCCESSFUL!';
    return { message };
  }

  deleteProduct(id: string) {
    // const { index } = this.findProduct(id);
    // this.products.splice(index, 1);
  }

  //NOTE: any time you are return an object or array, return a copy instead of the reference to prevent unintentional changing of the original
  private async findProduct(id): Promise<Product> {
    const errorToThrow = new NotFoundException(`Product ID: ${id} not found!`);
    let foundProduct;

    //NOTE: MongoDB has requirements for valid ids, so there are two possiblilities:
    //  1. Valid ID but not in DB (handled by !foundProduct logic)
    //  2. Invalid ID format (also not in DB);  this case throws a different exception which the try/catch handles
    try {
      foundProduct = await this.productModel.findById(id);
    } catch (err) {
      throw errorToThrow;
    }
    if (!foundProduct) {
      throw errorToThrow;
    }
    return foundProduct;
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
