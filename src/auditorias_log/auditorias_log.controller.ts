import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuditoriasLogService } from './auditorias_log.service';
import { CreateAuditoriasLogDto } from './dto/create-auditorias_log.dto';
import { UpdateAuditoriasLogDto } from './dto/update-auditorias_log.dto';

@Controller('auditorias-log')
export class AuditoriasLogController {
  constructor(private readonly auditoriasLogService: AuditoriasLogService) {}

  @Post()
  create(@Body() createAuditoriasLogDto: CreateAuditoriasLogDto) {
    return this.auditoriasLogService.create(createAuditoriasLogDto);
  }

  @Get()
  findAll() {
    return this.auditoriasLogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auditoriasLogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuditoriasLogDto: UpdateAuditoriasLogDto) {
    return this.auditoriasLogService.update(+id, updateAuditoriasLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auditoriasLogService.remove(+id);
  }
}
