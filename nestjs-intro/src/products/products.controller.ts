import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('products')
export class ProductsController {
  //injecting service into controller
  constructor(
    private readonly productsService: ProductsService,
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  @Post()
  //@Body magically takes the request's body and converts the json key given to the argument that follows ()
  async addProduct(
    //NOTE: could also just put all of the body into one object like body-parser does:
    //@Body() completeBody: {title: string, description: string, price: number}
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('price') price: number,
  ) {
    return {
      id: await this.productsService.insertProduct(title, description, price),
    };
  }

  @Get()
  async getProducts() {
    console.log('get------------------------------------------------');
    return await this.productsService.getProducts();
  }

  // GET '/products/:id'
  @Get(':id')
  getProduct(
    //getting all params as one obj
    //@Param() allParams: {id: string, ... }
    @Param('id') id: string,
  ) {
    return this.productsService.getProduct(id);
  }

  //PATCH 'products/:id'
  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    // @Body()
    // body: {
    //   title: string;
    //   description: string;
    //   price: number;
    // },
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('price') price: number,
  ) {
    console.log('title =', title);
    this.productsService.updateProduct(id, title, description, price);
    return { message: 'Update Successful!' };
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    this.productsService.deleteProduct(id);
    return { message: `Deletion of product with id of ${id} successful!` };
  }
}
