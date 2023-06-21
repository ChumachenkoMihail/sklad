import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {AppModule} from './app.module';
import {NestExpressApplication} from "@nestjs/platform-express";
import * as path from "path";
import * as hbs from 'express-handlebars';
import {join} from 'path';


async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors({
        origin: [
            '*',
            'http://localhost:3000',
        ],
        credentials: true,
    });
    app.setViewEngine('hbs');
    app.set('view options', {layout: 'layout'});
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.engine('hbs', hbs({ extname: 'hbs',partialsDir: join(__dirname, '..', 'views/partials'), defaultLayout: 'layout.hbs',
        layoutsDir: join(__dirname, '..', 'views/layouts'),}));





    const config = new DocumentBuilder()
        .setTitle('Sklad')
        .setDescription('sklad')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);


    await app.listen(3000);
}

bootstrap();
