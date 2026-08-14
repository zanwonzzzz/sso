import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { RolesModule } from './roles/roles.module';
import { OtpTokensModule } from './otp_tokens/otp_tokens.module';
import { AuditoriasModule } from './auditorias/auditorias.module';

@Module({
  imports: [UsuariosModule, EmpleadosModule, RolesModule, OtpTokensModule, AuditoriasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
