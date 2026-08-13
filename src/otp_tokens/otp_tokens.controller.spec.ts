import { Test, TestingModule } from '@nestjs/testing';
import { OtpTokensController } from './otp_tokens.controller';
import { OtpTokensService } from './otp_tokens.service';

describe('OtpTokensController', () => {
  let controller: OtpTokensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtpTokensController],
      providers: [OtpTokensService],
    }).compile();

    controller = module.get<OtpTokensController>(OtpTokensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
