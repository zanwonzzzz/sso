import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpTokensService } from './otp_tokens.service';
import { OtpTokensController } from './otp_tokens.controller';
import { OtpToken } from './entities/otp_token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OtpToken]),   // <- ESTA línea es la que falta
  ],
  controllers: [OtpTokensController],
  providers: [OtpTokensService],
  exports: [OtpTokensService],   // <- para usarlo en interactions
})
export class OtpTokensModule {}