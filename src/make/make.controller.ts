import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MakeService } from './make.service';
import { CreateMakeDto } from './dto/create-make.dto';
import { UpdateMakeDto } from './dto/update-make.dto';

@Controller('make')
export class MakeController {
  constructor(private readonly makeService: MakeService) {}

  @Post()
  create(@Body() createMakeDto: CreateMakeDto) {
    return this.makeService.create(createMakeDto);
  }

  @Get()
  findAll(@Query('skip') skip?: number, @Query('take') take?: number) {
    return this.makeService.findAll({ skip, take });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.makeService.findOneById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMakeDto: UpdateMakeDto) {
    return this.makeService.update(+id, updateMakeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.makeService.remove(+id);
  }
}
