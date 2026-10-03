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
import { MailModule } from './mail/mail.module.js';
import { PropertiesModule } from './properties/properties.module.js';
import { AgentsModule } from './agents/agents.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard.js';


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
    MailModule,
    PropertiesModule,
    AgentsModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService,
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard
        }
  ],
})
export class AppModule {}
