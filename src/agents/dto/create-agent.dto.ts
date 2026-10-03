import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAgentDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    avatar: string;

    @IsString()
    @IsNotEmpty()
    userId: string;

}
