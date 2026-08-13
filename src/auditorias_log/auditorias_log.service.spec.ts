import { Test, TestingModule } from '@nestjs/testing';
import { AuditoriasLogService } from './auditorias_log.service';

describe('AuditoriasLogService', () => {
  let service: AuditoriasLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditoriasLogService],
    }).compile();

    service = module.get<AuditoriasLogService>(AuditoriasLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
