import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OtpTokensService } from './otp_tokens.service';
import { CreateOtpTokenDto } from './dto/create-otp_token.dto';
import { UpdateOtpTokenDto } from './dto/update-otp_token.dto';

@Controller('otp-tokens')
export class OtpTokensController {
  constructor(private readonly otpTokensService: OtpTokensService) {}

  @Post()
  create(@Body() createOtpTokenDto: CreateOtpTokenDto) {
    return this.otpTokensService.create(createOtpTokenDto);
  }

  @Get()
  findAll() {
    return this.otpTokensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.otpTokensService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOtpTokenDto: UpdateOtpTokenDto) {
    return this.otpTokensService.update(+id, updateOtpTokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.otpTokensService.remove(+id);
  }
}
