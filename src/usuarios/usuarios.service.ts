import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario, Estado } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AppException } from 'src/common/errors/app.exception';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
  ) {}

  // ============================================================
  //  MÉTODOS PARA EL LOGIN
  // ============================================================

  // Busca un usuario por su username (para el login)
  async findByUsername(username: string): Promise<Usuario | null> {
    return this.usuariosRepo.findOne({ where: { username } });
  }

  // Busca por id numérico (para el findAccount del IdP)
  async findById(id: number): Promise<Usuario | null> {
    if (!Number.isInteger(id)) return null;
    return this.usuariosRepo.findOne({ where: { id } });
  }

  // Valida username + password. Devuelve el usuario si son correctos, o null.
  // NO deshashea: bcrypt.compare hashea lo que escribió el usuario y lo compara.
  async validarCredenciales(
    username: string,
    password: string,
  ): Promise<Usuario | null> {
    const usuario = await this.findByUsername(username);
    
    if (!usuario || usuario.estado !== Estado.ACTIVO) {
      throw new AppException('AUTH_INCORRECT_CREDENTIALS');
    }

    const coincide = await bcrypt.compare(password, usuario.password);
    if (!coincide) {
      throw new AppException('AUTH_INCORRECT_CREDENTIALS');
    }

    return usuario;
  }

  // Helper para hashear un password (úsalo al crear/actualizar usuarios)
  async hashPassword(passwordPlano: string): Promise<string> {
    return bcrypt.hash(passwordPlano, 10);
  }

  create(createUsuarioDto: CreateUsuarioDto) {
    return 'This action adds a new usuario';
  }

  findAll() {
    return `This action returns all usuarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
