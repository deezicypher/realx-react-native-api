import { IsNotEmpty } from "class-validator/types/decorator/common/IsNotEmpty.js";
import { IsEmail } from "class-validator/types/decorator/string/IsEmail.js";
import { IsString } from "class-validator/types/decorator/typechecker/IsString.js";

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

}
