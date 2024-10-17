import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MakeModule } from './make/make.module';
import { VehicleTypeModule } from './vehicle-type/vehicle-type.module';
import { ProcessorModule } from './processor/processor.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // type: 'postgres',
      // host: 'localhost',
      // port: 5432,
      // username: 'user',
      // password: 'password',
      // database: 'appdb',
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      include: [MakeModule],
    }),
    MakeModule,
    VehicleTypeModule,
    ProcessorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
