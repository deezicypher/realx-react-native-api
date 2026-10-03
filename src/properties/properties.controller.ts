import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PropertiesService } from './properties.service.js';
import { CreatePropertyDto } from './dto/create-property.dto.js';
import { UpdatePropertyDto } from './dto/update-property.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(createPropertyDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.propertiesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }



  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto, @Req() req: any) {
    return this.propertiesService.update(id, updatePropertyDto, req.user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.propertiesService.remove(id, req.user);
  }
}
