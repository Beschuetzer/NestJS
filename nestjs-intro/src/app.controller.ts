import { Controller, Get, Head, Header } from '@nestjs/common';
import { AppService } from './app.service';

//no params handles requests to 'your-domain.com/' or the root route ('/')
@Controller()
export class AppController {
  //this is telling nestJS that we need an instance of AppService (we specify this inside @Module's providers' array); called dependency injection
  constructor(private readonly appService: AppService) {}

  //@Get specifies what to do when a GET request hits this route ('/')
  @Get()
  //@Header is used to specify the header to use with this method
  @Header('Content-Type', 'text/html')
  getHello(): string {
    //No (req, res) object like in express, rather nestJS handles the header setting based on what you are returning (you can set extra/dif. headers if necessary)
    return this.appService.getHello();
  }

  //@Get takes a route too but it is added on to the @Controller route above, so since this controller handles '/' (empty) the below @Get would handle GET requests to '/test'
  @Get('test')
  getHello2(): string {
    return this.appService.getHello();
  }
}

//handles requests to 'your-domain.com/products'
@Controller('products')
export class AppController2 {
  constructor(private readonly appService: AppService) {}

  //handles GET requests to '/products/users ('/products' comes from the @Controller part)
  @Get('users')
  getHello(): string {
    return this.appService.getHello();
  }
}
