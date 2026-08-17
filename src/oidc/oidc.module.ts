// oidc.module.ts (o donde lo hayas puesto)
import { Module } from '@nestjs/common';
import { InteractionsController } from './interactions.controller';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { OtpTokensModule } from '../otp_tokens/otp_tokens.module';

@Module({
  imports: [UsuariosModule,OtpTokensModule],
  controllers: [InteractionsController],   // <- ¿está esto?
})
export class OidcInteractionsModule {}