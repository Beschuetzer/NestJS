import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';

//can have multiple modues;  they just bundle up controllers and providers (imports can be used to import other modules into one another);  modules typically split by features

//@module is a decorator for classes;  decorators can be attached to pretty much anything;  you pass in a config object as the 1st param
@Module({
  //inputs is how you put your app together
  imports: [ProductsModule],
  //controllers handle incoming requests, do some stuff (logic), then send a response
  controllers: [AppController],
  //providers are extra services/classses that you can inject into other providers or controllers to provide certain functionality (e.g. a service that reaches out to DB)
  providers: [AppService],
})
export class AppModule {}
