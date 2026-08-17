import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { RolesModule } from './roles/roles.module';
import { OtpTokensModule } from './otp_tokens/otp_tokens.module';
import { AuditoriasModule } from './auditorias/auditorias.module';
import { Auditoria } from './auditorias/entities/auditoria.entity';
import { ConfigModule } from '@nestjs/config';
import { OidcModule } from 'nest-oidc-provider';
import { OidcConfigService } from './oidc/oidc.config';
import { OidcInteractionsModule } from './oidc/oidc.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {OidcPayload} from './oidc/entities/oidc-payload.entity';
import {OtpToken} from './otp_tokens/entities/otp_token.entity';
import {Usuario} from './usuarios/entities/usuario.entity';
import {Role} from './roles/entities/role.entity';
import {Empleado} from './empleados/entities/empleado.entity';

@Module({
  imports: [UsuariosModule, EmpleadosModule, RolesModule, OtpTokensModule, AuditoriasModule,OidcPayload,
            OidcInteractionsModule,
            ConfigModule.forRoot({ isGlobal: true }),
            OidcModule.forRootAsync({imports: [TypeOrmModule.forFeature([Usuario, OidcPayload])],
            useClass: OidcConfigService,}),
            TypeOrmModule.forRoot({
              type: 'mysql',
              host: 'localhost',
              port: 3306,
              username: 'root',
              password: 'root',
              database: 'trace',
              entities: [Auditoria, OtpToken, Usuario, Role,Empleado, OidcPayload],
              autoLoadEntities: true,
              synchronize: true,
            }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
