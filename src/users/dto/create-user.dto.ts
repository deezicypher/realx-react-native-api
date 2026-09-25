import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email:string;

    @IsString()
    @IsNotEmpty()
    name:string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
    @Matches(/(?=.*[a-z])/, { message: 'Password must contain at least one lowercase letter' })
    @Matches(/(?=.*\d)/, { message: 'Password must contain at least one number' })
    @Matches(/(?=.*[@$!%*?&])/, { message: 'Password must contain at least one special character' })
    password:string;
}
