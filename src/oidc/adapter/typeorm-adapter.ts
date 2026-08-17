import { DataSource, Repository } from 'typeorm';
import { OidcPayload } from '../entities/oidc-payload.entity';

/**
 * EL PUENTE (Camino A).
 *
 * Problema: node-oidc-provider instancia el adapter por su cuenta, asi:
 *   new TypeOrmAdapter('Session')
 * O sea, SOLO le pasa el nombre del modelo (el type), NO el DataSource.
 * Pero el adapter necesita el DataSource para hablar con MySQL.
 *
 * Solucion: guardamos el DataSource en una variable de este modulo. Al arrancar
 * la app, llamamos initOidcAdapter(dataSource) UNA vez, y a partir de ahi todas
 * las instancias que cree la libreria pueden usarlo.
 */
let dataSourceRef: DataSource | null = null;

export function initOidcAdapter(ds: DataSource): void {
  dataSourceRef = ds;
}

export class TypeOrmAdapter {
  private repo: Repository<OidcPayload>;

  // La libreria pasa solo 'name' (el type). El DataSource lo tomamos del puente.
  constructor(
    private name: string,
    private dataSource: DataSource,
  ) {
    this.repo = this.dataSource.getRepository(OidcPayload);
  }

  async upsert(id: string, payload: any, expiresIn?: number): Promise<void> {
    const expiresAt =
      typeof expiresIn === 'number'
        ? new Date(Date.now() + expiresIn * 1000)
        : null;

    await this.repo.save({
      id,
      type: this.name,
      payload, // objeto directo: la columna 'json' lo serializa sola
      grantId: payload.grantId ?? null,
      userCode: payload.userCode ?? null,
      uid: payload.uid ?? null,
      consumedAt: payload.consumed ? new Date(payload.consumed * 1000) : null,
      expiresAt,
    } as Partial<OidcPayload>);
  }

  async find(id: string): Promise<any | undefined> {
    const row = await this.repo.findOneBy({ id, type: this.name });
    if (!row) return undefined;

    // Si expiro, lo borramos y hacemos como que no existe.
    if (row.expiresAt && row.expiresAt.getTime() < Date.now()) {
      await this.repo.delete({ id, type: this.name });
      return undefined;
    }

    return this.toPayload(row);
  }

  async findByUid(uid: string): Promise<any | undefined> {
    const row = await this.repo.findOneBy({ uid, type: this.name });
    return row ? this.toPayload(row) : undefined;
  }

  async findByUserCode(userCode: string): Promise<any | undefined> {
    const row = await this.repo.findOneBy({ userCode, type: this.name });
    return row ? this.toPayload(row) : undefined;
  }

  async consume(id: string): Promise<void> {
    await this.repo.update({ id, type: this.name }, { consumedAt: new Date() });
  }

  async destroy(id: string): Promise<void> {
    await this.repo.delete({ id, type: this.name });
  }

  async revokeByGrantId(grantId: string): Promise<void> {
    await this.repo.delete({ grantId, type: this.name });
  }

  /**
   * La libreria espera que el campo de consumo venga DENTRO del payload como
   * 'consumed' (epoch en segundos). Como nosotros lo guardamos aparte en la
   * columna consumedAt, lo volvemos a inyectar al payload al leer.
   */
  private toPayload(row: OidcPayload): any {
    const payload = row.payload;
    if (row.consumedAt) {
      payload.consumed = Math.floor(row.consumedAt.getTime() / 1000);
    }
    return payload;
  }
}
