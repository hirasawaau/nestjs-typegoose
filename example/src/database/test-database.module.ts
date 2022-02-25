import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

@Module({
  imports: [
    TypegooseModule.forRootAsync({
      useFactory: async () => {
        const mongod = await MongoMemoryServer.create();
        return {
          uri: mongod.getUri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
        };
      },
    }),
  ],
})
export class TestDatabaseModule {}
