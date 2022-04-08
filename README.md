# nestjs-typegoose

[![NPM](https://nodei.co/npm/nestjs-typegoose.png)](https://nodei.co/npm/nestjs-typegoose/)

[![npm version](https://badge.fury.io/js/@hirasawa_au%2Fnestjs-typegoose.svg)](https://badge.fury.io/js/@hirasawa_au%2Fnestjs-typegoose)

## Description

Injects [typegoose](https://github.com/szokodiakos/typegoose) models for [nest](https://github.com/nestjs/nest) components and controllers. Typegoose equivalant for [@nestjs/mongoose.](https://docs.nestjs.com/techniques/mongodb)

Using Typegoose removes the need for having a Model interface.

## Installation

```bash
npm install --save @hirasawa_au/nestjs-typegoose
```

or

```
yarn add @hirasawa_au/nestjs-typegoose
```

## Documentation

[Here is the full documentation describing all basic and advanced features.](https://kpfromer.github.io/nestjs-typegoose/)

## Basic usage

You can checkout the `example` project for more details.

**app.module.ts**

```typescript
import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { CatsModule } from './cat.module.ts'

@Module({
  imports: [
    TypegooseModule.forRoot('mongodb://localhost:27017/nest', {
      useNewUrlParser: true,
    }),
    CatsModule,
  ],
})
export class ApplicationModule {}
```

Create class that describes your schema

**cat.model.ts**

```typescript
import { prop } from '@typegoose/typegoose'
import { IsString } from 'class-validator'

export class Cat {
  @IsString()
  @prop({ required: true })
  name: string
}
```

Inject Cat for `CatsModule`

**cat.module.ts**

```typescript
import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { Cat } from './cat.model'
import { CatsController } from './cats.controller'
import { CatsService } from './cats.service'

@Module({
  imports: [TypegooseModule.forFeature([Cat])],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```

Get the cat model in a service

**cats.service.ts**

```typescript
import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { Cat } from './cat.model'
import { ReturnModelType } from '@typegoose/typegoose'

@Injectable()
export class CatsService {
  constructor(
    @InjectModel(Cat) private readonly catModel: ReturnModelType<typeof Cat>,
  ) {}

  async create(createCatDto: { name: string }): Promise<Cat> {
    const createdCat = new this.catModel(createCatDto)
    return await createdCat.save()
  }

  async findAll(): Promise<Cat[] | null> {
    return await this.catModel.find().exec()
  }
}
```

Finally, use the service in a controller!

**cats.controller.ts**

```typescript
import { Controller, Get, Post, Body } from '@nestjs/common'
import { CatsService } from './cats.service'
import { Cat } from './cats.model.ts'

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  async getCats(): Promise<Cat[] | null> {
    return await this.catsService.findAll()
  }

  @Post()
  async create(@Body() cat: Cat): Promise<Cat> {
    return await this.catsService.create(cat)
  }
}
```

## Requirements

1.  @typegoose/typegoose +9.0.0
2.  @nestjs/common +8.4.4
3.  @nestjs/core +8.4.4
4.  mongoose +6.2.10

## License

nestjs-typegoose is [MIT licensed](LICENSE).
