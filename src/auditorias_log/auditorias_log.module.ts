import { Module } from '@nestjs/common';
import { AuditoriasLogService } from './auditorias_log.service';
import { AuditoriasLogController } from './auditorias_log.controller';

@Module({
  controllers: [AuditoriasLogController],
  providers: [AuditoriasLogService],
})
export class AuditoriasLogModule {}
