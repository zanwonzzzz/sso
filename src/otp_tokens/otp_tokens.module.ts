import { Module } from '@nestjs/common';
import { OtpTokensService } from './otp_tokens.service';
import { OtpTokensController } from './otp_tokens.controller';

@Module({
  controllers: [OtpTokensController],
  providers: [OtpTokensService],
})
export class OtpTokensModule {}
