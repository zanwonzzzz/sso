import { Test, TestingModule } from '@nestjs/testing';
import { AuditoriasLogController } from './auditorias_log.controller';
import { AuditoriasLogService } from './auditorias_log.service';

describe('AuditoriasLogController', () => {
  let controller: AuditoriasLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditoriasLogController],
      providers: [AuditoriasLogService],
    }).compile();

    controller = module.get<AuditoriasLogController>(AuditoriasLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
