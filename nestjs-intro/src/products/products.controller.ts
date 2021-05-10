import { Controller, Post, Body } from "@nestjs/common"
import { ProductsService } from "./products.service";
import { Product } from './product.model';

@Controller('products')
export class ProductsController {
  //injecting service into controller
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  //@Body magically takes the request's body and converts the json key given to the argument that follows ()
  addProduct(
    //NOTE: could also just put all of the body into one object like body-parser does:
    //@Body() completeBody: {title: string, description: string, price: number}
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('price') price: number,
  ) {
    const uniqueID = new Date().toISOString();
    const newProduct = new Product(uniqueID, title, description, price);
    this.productsService.insertProduct(newProduct);

    //APIs generally return JSON data, so return {id} to tell nestJS to set header type to application/json; nestJS also sets header type to application/json if you return a list 
    return { id: newProduct.id };
  }
}
