import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity({ name: 'oidc_payloads' })
@Index(['grantId'])
@Index(['userCode'])
@Index(['uid'])
export class OidcPayload {
  // Llave compuesta: modelo (type) + id
  @PrimaryColumn({ type: 'varchar', length: 100 })
  type: string;   // 'Session', 'RefreshToken', 'AccessToken', etc.

  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  // El contenido real del objeto
  @Column({ type: 'json' })
  payload: Record<string, any>;

  // --- Campos extraídos del payload para indexar/buscar ---
  @Column({ name: 'grant_id', type: 'varchar', length: 255, nullable: true })
  grantId?: string | null;

  @Column({ name: 'user_code', type: 'varchar', length: 255, nullable: true })
  userCode?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  uid?: string | null;

  // --- Control de expiración y consumo ---
  @Column({ name: 'expires_at', type: 'datetime', nullable: true })
  expiresAt?: Date | null;

  @Column({ name: 'consumed_at', type: 'datetime', nullable: true })
  consumedAt?: Date | null;
}