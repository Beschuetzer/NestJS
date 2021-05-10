import { Injectable } from '@nestjs/common';

//@Injectable ensure that the class is injectable into an @Module
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
