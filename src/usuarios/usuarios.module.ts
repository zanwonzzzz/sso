import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),   // <- ESTA línea es la que falta
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],   // <- y esta, para usarlo en interactions
})
export class UsuariosModule {}