import { Type } from 'class-transformer';
import {
	IsArray,
	IsEnum,
	IsInt,
	IsNumber,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	Min,
} from 'class-validator';
import { FacilitiesType, PropertyType } from '../entities/property.entity.js';

export class CreatePropertyDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsEnum(PropertyType)
	type: PropertyType;

	@IsString()
	@IsNotEmpty()
	description: string;

	@IsString()
	@IsNotEmpty()
	address: string;

	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	price: number;

	@IsNumber()
	@Min(0)
	area: number;

	@IsInt()
	@Min(0)
	bedrooms: number;

	@IsInt()
	@Min(0)
	bathrooms: number;

	@IsOptional()
	@IsArray()
	@IsEnum(FacilitiesType, { each: true })
	facilities?: FacilitiesType[];

	@IsString()
	@IsNotEmpty()
	image: string;

	@IsArray()
	@IsString({ each: true })
	galleries: string[];

	@IsString()
	@IsNotEmpty()
	geolocation: string;

	@IsUUID()
	agentId: string;
}
