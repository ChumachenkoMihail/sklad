import { Controller, Get, Post, Req,Res ,  Request,} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get('/')
  main(@Req() req: Request, @Res() res) {
    console.log('bla-bla');
return res.render('login.hbs')
  }

}
