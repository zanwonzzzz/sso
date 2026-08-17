import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OtpTokensService } from './otp_tokens.service';
import { CreateOtpTokenDto } from './dto/create-otp_token.dto';
import { UpdateOtpTokenDto } from './dto/update-otp_token.dto';

@Controller('otp-tokens')
export class OtpTokensController {
  constructor(private readonly otpTokensService: OtpTokensService) {}

  @Get()
  findAll() {
    return this.otpTokensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.otpTokensService.findOne(+id);
  }
 
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.otpTokensService.remove(+id);
  }
}
