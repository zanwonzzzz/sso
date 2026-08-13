import { Injectable } from '@nestjs/common';
import { CreateAuditoriasLogDto } from './dto/create-auditorias_log.dto';
import { UpdateAuditoriasLogDto } from './dto/update-auditorias_log.dto';

@Injectable()
export class AuditoriasLogService {
  create(createAuditoriasLogDto: CreateAuditoriasLogDto) {
    return 'This action adds a new auditoriasLog';
  }

  findAll() {
    return `This action returns all auditoriasLog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auditoriasLog`;
  }

  update(id: number, updateAuditoriasLogDto: UpdateAuditoriasLogDto) {
    return `This action updates a #${id} auditoriasLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} auditoriasLog`;
  }
}
