import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TriggersService } from './triggers.service';
import { CreateTriggerDto } from './dto/create-trigger.dto';
import { UpdateTriggerDto } from './dto/update-trigger.dto';

@Controller('triggers')
export class TriggersController {
  constructor(private readonly triggersService: TriggersService) {}

  @Post()
  create(@Body() createTriggerDto: CreateTriggerDto) {
    return this.triggersService.create(createTriggerDto);
  }

  @Get()
  findAll() {
    return this.triggersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.triggersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTriggerDto: UpdateTriggerDto) {
    return this.triggersService.update(+id, updateTriggerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.triggersService.remove(+id);
  }
}
