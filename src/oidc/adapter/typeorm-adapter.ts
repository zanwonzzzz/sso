import { DataSource, Repository } from 'typeorm';
import { OidcPayload } from '../entities/oidc-payload.entity';

export class TypeOrmAdapter {
  private repo: Repository<OidcPayload>;

  constructor(private dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(OidcPayload);
  }

  async upsert(id: string, payload: any, expiresIn?: number) {
    const expiresAt = typeof expiresIn === 'number' ? new Date(Date.now() + expiresIn * 1000) : null;
    const grantId = payload.grantId || payload.grant_id || null;
    const userCode = payload.user_code || null;

    const entity = this.repo.create({
      id,
      payload: JSON.stringify(payload),
      grantId,
      userCode,
      consumed: !!payload.consumed,
      expiresAt,
    } as Partial<OidcPayload>);

    await this.repo.save(entity);
  }

  async find(id: string) {
    const row = await this.repo.findOneBy({ id });
    if (!row) return undefined;
    if (row.expiresAt && row.expiresAt.getTime() < Date.now()) {
      await this.repo.delete({ id });
      return undefined;
    }
    try {
      return JSON.parse(row.payload);
    } catch {
      return undefined;
    }
  }

  async findByUserCode(userCode: string) {
    const row = await this.repo.findOneBy({ userCode });
    if (!row) return undefined;
    try {
      return JSON.parse(row.payload);
    } catch {
      return undefined;
    }
  }

  async findByUid(uid: string) {
    // Some payloads use uid as id, some embed it in payload. Try both.
    const byId = await this.repo.findOneBy({ id: uid });
    if (byId) {
      try {
        return JSON.parse(byId.payload);
      } catch {
        return undefined;
      }
    }
    const row = await this.repo
      .createQueryBuilder('p')
      .where("JSON_EXTRACT(p.payload, '$.uid') = :uid", { uid })
      .getOne();
    if (!row) return undefined;
    try {
      return JSON.parse(row.payload);
    } catch {
      return undefined;
    }
  }

  async destroy(id: string) {
    await this.repo.delete({ id });
  }

  async consume(id: string) {
    await this.repo.update({ id }, { consumed: true });
  }

  async revokeByGrantId(grantId: string) {
    await this.repo.delete({ grantId });
  }

  // Optional helper to clean expired rows
  async cleanExpired() {
    await this.repo
      .createQueryBuilder()
      .delete()
      .from(OidcPayload)
      .where('expires_at IS NOT NULL AND expires_at < :now', { now: new Date() })
      .execute();
  }
}
