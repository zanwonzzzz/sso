import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import type {
  OidcModuleOptions,
  OidcModuleOptionsFactory,
  AdapterFactory,
} from 'nest-oidc-provider';
import { TypeOrmAdapter } from './adapter/typeorm-adapter';
import { Usuario, Estado } from '../usuarios/entities/usuario.entity';

@Injectable()
export class OidcConfigService implements OidcModuleOptionsFactory {
  // ===================================================================
  // 1) CONSTRUCTOR: aqui inyectas lo que necesitas.
  //    - dataSource: para el adapter
  //    - usuariosRepo: para que el findAccount pueda buscar usuarios
  // ===================================================================
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(Usuario) private readonly usuariosRepo: Repository<Usuario>,
  ) {}

  createModuleOptions(): OidcModuleOptions {
    return {
      proxy: true,
      issuer: process.env.ISSUER_URL ?? 'http://192.168.1.12:3000',
      path: '/oidc',
      oidc: {
        jwks: JSON.parse(process.env.OIDC_JWKS as string),

        cookies: {
            keys: ['una-llave-secreta-cualquiera', 'otra-llave-secreta'],
            short: { secure: process.env.NODE_ENV === 'production' },
            long: { secure: process.env.NODE_ENV === 'production' },
        },

        interactions: {
            url(ctx, interaction) {
                return `/oidc/interaction/${interaction.uid}`;
            },
        },

        renderError: async (ctx, out, error) => {
            console.error('========== ERROR OIDC REAL ==========');
            console.error(error);
            console.error('=====================================');
            ctx.type = 'html';
            ctx.body = `<pre>${error?.stack || JSON.stringify(error, null, 2)}</pre>`;
        },

        clients: [
          {
            client_id: 'prueba',
            client_secret: 'un-secreto-cualquiera',
            grant_types: ['authorization_code', 'refresh_token'],
            response_types: ['code'],
            redirect_uris: [`${process.env.API_TRACE_URL}/auth/callback`],
            token_endpoint_auth_method: 'client_secret_post',
            // scope: que grupos de datos puede pedir este client
            scope: 'openid profile offline_access',
          },
          {
            client_id: 'movil-trace-ios',
            application_type: 'native', 
            grant_types: ['authorization_code', 'refresh_token'],
            response_types: ['code'],
            redirect_uris: ['movil-trace://callback'],
            token_endpoint_auth_method: 'none',
            scope: 'openid profile offline_access',
          },
        ],

        ttl: {
          AccessToken: 300,
          AuthorizationCode: 60,
          IdToken: 3600,
          RefreshToken: 86400,
          Session: 1209600,
        },

        // ===============================================================
        // 2) CLAIMS: el "menu" de que datos existen y en que scope van.
        //    Va DENTRO del objeto oidc.
        // ===============================================================
        claims: {
          openid: ['sub'],
          profile: ['username', 'name', 'rol', 'celular'],
        },

        // ===============================================================
        // 3) FIND ACCOUNT: la funcion que trae los datos del usuario.
        //    Tambien va DENTRO del objeto oidc.
        //    NO valida password (eso es en las interactions);
        //    solo encuentra al usuario y devuelve sus claims.
        // ===============================================================
        findAccount: async (ctx, id) => {
            const idNum = Number(id);
            if (!Number.isInteger(idNum)) {
                console.log('>>> id no es entero, devolviendo undefined');
                return undefined;
            }

          const usuario = await this.usuariosRepo.findOne({
            where: { id: Number(id) },
          });

           console.log('>>> findAccount recibió id:', JSON.stringify(id), 'tipo:', typeof id);

         
          if (!usuario || usuario.estado !== Estado.ACTIVO) {
            return undefined;
          }

          return {
            accountId: id,
            claims: async () => ({
              sub: id,
              username: usuario.username,
              name: usuario.username,
              rol: usuario.rol?.nombre,
              celular: usuario.celular,
            }),
          };
        },

        issueRefreshToken: async (ctx, client, code) => {
            return client.grantTypeAllowed('refresh_token');
        },

        features: {
          devInteractions: { enabled: false }, // quitar al montar tu Vue
        },
      },
    };
  }

  // ===================================================================
  // 4) ADAPTER FACTORY: entrega tu adapter a la libreria.
  // ===================================================================
  createAdapterFactory(): AdapterFactory {
    return (modelName: string) => new TypeOrmAdapter(modelName, this.dataSource);
  }
}
