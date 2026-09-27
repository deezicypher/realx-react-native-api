import { IsNotEmpty, IsString } from "class-validator";

export class ActivateDTO {
    @IsString()
    @IsNotEmpty()
    token:string;
}