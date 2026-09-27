import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {

    constructor(
        private mailerService:MailerService
    ){}

    async sendActivationEmail(to: string, url: string, name: string) {
        return this.mailerService.sendMail({
        to,
        subject: 'Activate Your Account',
        template: 'activation', // activation.hbs
        context: {
            name,
            url,
            privacyUrl:    'https://yourapp.com/privacy',
            supportUrl:    'https://yourapp.com/support',
            year:          new Date().getFullYear(),
        },
        });
    }
}
