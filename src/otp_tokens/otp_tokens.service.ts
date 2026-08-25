import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { OtpToken } from './entities/otp_token.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { AppException } from 'src/common/errors/app.exception';

@Injectable()
export class OtpTokensService {
  constructor(
    @InjectRepository(OtpToken)
    private readonly otpRepo: Repository<OtpToken>,
  ) {}

  // ============================================================
  // 1) GENERAR: crea un OTP nuevo para un usuario y lo "envia"
  // ============================================================
  async generarOtp(usuario: Usuario): Promise<string> {
    // Borra cualquier OTP anterior de este usuario (por el OneToOne)
    await this.otpRepo.delete({ usuario: { id: usuario.id } });

    // Genera un codigo de 6 digitos (100000 - 999999)
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    // Expira en 5 minutos
    const fecha_expiracion = new Date(Date.now() + 5 * 60 * 1000);

    // Guarda el OTP en la BD
    const otp = this.otpRepo.create({
      usuario,
      codigo,
      fecha_expiracion,
    });
    await this.otpRepo.save(otp);

    // "Envia" el codigo (por ahora, console.log)
    await this.enviarOtp(codigo);

    return codigo;
  }

// ============================================================
// 2) ENVIAR: llama al servicio de WhatsApp de api-negocio
// ============================================================
private async enviarOtp(codigo: string): Promise<void> {
  console.log('==========================================');
  console.log(`>>> OTP para el celular ${codigo}`);
  console.log('==========================================');

  const negocioUrl = process.env.API_NEGOCIO_URL;
  console.log('==========================================');
  console.log(`>>> OTP para el celular ${negocioUrl}`);
  console.log('==========================================');

  try {
    const res = await fetch(`${negocioUrl}/auth/enviar/otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ codigo }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`>>> Error enviando OTP por WhatsApp: ${res.status} - ${err}`);
    }
  } catch (error) {
    console.error('>>> Error de red al llamar api-negocio:', error);
  }
}

  // ============================================================
  // 3) VALIDAR: revisa si el codigo es correcto y no expiro
  // ============================================================
  async validarOtp(usuario: Usuario, codigo: string): Promise<boolean> {
    const otp = await this.otpRepo.findOne({
      where: { usuario: { id: usuario.id } },
    });

    // No hay OTP para este usuario
    if (!otp) throw new AppException('OTP_INVALID');

    // Ya fue usado
    if (otp.fecha_uso) throw new AppException('OTP_EXPIRED');

    // Expiro
    if (otp.fecha_expiracion.getTime() < Date.now()) throw new AppException('OTP_EXPIRED');

    // El codigo no coincide
    if (otp.codigo !== codigo) throw new AppException('OTP_INVALID');

    // Todo bien: marcamos como usado y aceptamos
    otp.fecha_uso = new Date();
    await this.otpRepo.save(otp);

    return true;
  }

  findAll() {
    return `This action returns all otpTokens`;
  }

  findOne(id: number) {
    return `This action returns a #${id} otpToken`;
  }

  remove(id: number) {
    return `This action removes a #${id} otpToken`;
  }

}
