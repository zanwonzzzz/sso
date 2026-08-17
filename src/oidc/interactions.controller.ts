import { Controller, Get, Post, Param, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { OidcInteraction, InjectOidcProvider } from 'nest-oidc-provider';
import type { InteractionHelper } from 'nest-oidc-provider';
import type Provider from 'oidc-provider';
import { UsuariosService } from '../usuarios/usuarios.service';
import { OtpTokensService } from '../otp_tokens/otp_tokens.service';
import { AppException } from 'src/common/errors/app.exception';

const VUE_URL = 'http://localhost:5173';

@Controller('oidc/interaction')
export class InteractionsController {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly otpService: OtpTokensService,
    @InjectOidcProvider() private readonly provider: Provider,
  ) {}

  // ============================================================
  // GET: redirige a tu Vue segun el estado
  // ============================================================
  @Get(':uid')
  async showLogin(
    @Param('uid') uid: string,
    @OidcInteraction() interaction: InteractionHelper,
    @Res() res: Response,
  ) {
    const details = await interaction.details();
    const { prompt, result } = details as any;

    // Si ya paso password pero falta MFA -> pantalla de codigo en Vue
    if (result?.mfaPendiente) {
      return res.redirect(`${VUE_URL}/mfa?uid=${uid}`);
    }

    if (prompt.name === 'login') {
      return res.redirect(`${VUE_URL}/login?uid=${uid}`);
    }

    if (prompt.name === 'consent') {
  // Auto-aprobar: creamos el grant y continuamos SIN mostrar pantalla
  const { params, session } = details as any;
  const promptDetails = prompt.details;

  let grant;
  if (details.grantId) {
    grant = await this.provider.Grant.find(details.grantId);
  } else {
    grant = new this.provider.Grant({
      accountId: session.accountId,
      clientId: params.client_id as string,
    });
  }

  if (promptDetails.missingOIDCScope) {
    grant.addOIDCScope(promptDetails.missingOIDCScope.join(' '));
  }
  if (promptDetails.missingOIDCClaims) {
    grant.addOIDCClaims(promptDetails.missingOIDCClaims);
  }

  const grantId = await grant.save();

  const returnTo = await interaction.result(
    { consent: { grantId } },
    { mergeWithLastSubmission: true },
  );

  return res.redirect(returnTo);   // continúa el flujo directo (sin Vue)
}

    return res.status(400).json({ error: 'Interaction no soportada' });
  }

  // ============================================================
  // POST login: valida password, genera OTP -> responde JSON
  // ============================================================
  @Post(':uid/login')
  async submitLogin(
    @Param('uid') uid: string,
    @Body() body: { username: string; password: string },
    @OidcInteraction() interaction: InteractionHelper,
    @Res() res: Response,
  ) {
    const usuario = await this.usuariosService.validarCredenciales(
      body.username,
      body.password,
    );

    if (!usuario) {
      throw new AppException('AUTH_INCORRECT_CREDENTIALS');
    }

    await this.otpService.generarOtp(usuario);

    await interaction.result(
      { mfaPendiente: { usuarioId: usuario.id } } as any,
      { mergeWithLastSubmission: false },
    );

    // Le decimos a Vue "password ok, ahora pide el codigo"
    return res.json({ step: 'mfa' });
  }

  // ============================================================
  // POST otp: valida el codigo -> responde con la URL de redireccion
  // ============================================================
  @Post(':uid/otp')
  async submitOtp(
    @Param('uid') uid: string,
    @Body() body: { codigo: string },
    @OidcInteraction() interaction: InteractionHelper,
    @Res() res: Response,
  ) {
    const details = await interaction.details();
    const { result } = details as any;

    const usuarioId = result?.mfaPendiente?.usuarioId;
    if (!usuarioId) {
      throw new AppException('AUTH_INVALID');
    }

    const usuario = await this.usuariosService.findById(usuarioId);
    if (!usuario) {
      throw new AppException('VAL_RECORD_NOT_FOUND', { record: 'usuario'});
    }

    const valido = await this.otpService.validarOtp(usuario, body.codigo);
    if (!valido) {
      throw new AppException('OTP_INVALID');
    }

    // result() nos da la URL a donde debe ir el navegador para continuar
    const returnTo = await interaction.result(
      { login: { accountId: String(usuario.id) } },
      { mergeWithLastSubmission: true },
    );

    // Le damos esa URL a Vue para que redirija el navegador
    return res.json({ redirectTo: returnTo });
  }

  // ============================================================
  // POST confirm: consentimiento -> responde con URL de redireccion
  // ============================================================
  @Post(':uid/confirm')
  async confirmConsent(
    @Param('uid') uid: string,
    @OidcInteraction() interaction: InteractionHelper,
    @Res() res: Response,
  ) {
    const details = await interaction.details();
    const { params, session, prompt } = details as any;
    const promptDetails = prompt.details;

    let grant;
    if (details.grantId) {
      grant = await this.provider.Grant.find(details.grantId);
    } else {
      grant = new this.provider.Grant({
        accountId: session.accountId,
        clientId: params.client_id as string,
      });
    }

    if (promptDetails.missingOIDCScope) {
      grant.addOIDCScope(promptDetails.missingOIDCScope.join(' '));
    }
    if (promptDetails.missingOIDCClaims) {
      grant.addOIDCClaims(promptDetails.missingOIDCClaims);
    }

    const grantId = await grant.save();

    const returnTo = await interaction.result(
      { consent: { grantId } },
      { mergeWithLastSubmission: true },
    );

    return res.json({ redirectTo: returnTo });
  }
}