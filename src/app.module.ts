import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import {ConfigModule} from '@nestjs/config'
import configuration from './config/configuration.js';
import { validate } from './env.validation.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { typeOrmAsyncConfig } from './db/data-source.js';
import { TypeOrmModule } from '@nestjs/typeorm';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/.env.development`],
      isGlobal: true,
      override:true,
      skipProcessEnv:true,
      load:[configuration],
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validate
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    // ObserveModule.forRoot({
    //   appKey: 'YOUR_APP_KEY',
    //   appSecret: 'YOUR_APP_SECRET',
    //   serviceId: 'realx-react-native-api',
    // }), 
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
