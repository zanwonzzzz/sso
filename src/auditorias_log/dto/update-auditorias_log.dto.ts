import { PartialType } from '@nestjs/mapped-types';
import { CreateAuditoriasLogDto } from './create-auditorias_log.dto';

export class UpdateAuditoriasLogDto extends PartialType(CreateAuditoriasLogDto) {}
