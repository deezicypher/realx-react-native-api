import { Module } from '@nestjs/common';
import { MailService } from './mail.service.js';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: (config: ConfigService) => ({
        transport:{
          host: config.get<string>('mail_host'),
          port: config.get<number>('mail_port'),
          auth: {
            user: config.get<string>('mail_user'),
            pass: config.get<string>('mail_pass'),
          },
        },
        defaults:{
          from : `Realx  <${config.get<string>('sender_email')}>`
        },
        template:{
          dir: join(process.cwd(), 'src/mail/templates'), // path to .hbs files
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        }
      })

    })
  ],
  providers: [MailService],
  exports:[MailService]
})
export class MailModule {}
