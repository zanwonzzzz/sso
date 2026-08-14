import { Test, TestingModule } from '@nestjs/testing';
import { AuditoriasController } from './auditorias.controller';
import { AuditoriasService } from './auditorias.service';

describe('AuditoriasController', () => {
  let controller: AuditoriasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditoriasController],
      providers: [AuditoriasService],
    }).compile();

    controller = module.get<AuditoriasController>(AuditoriasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
