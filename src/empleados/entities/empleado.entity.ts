import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, OneToMany } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

export enum Departamento
{
    SUPPLYCHAIN='supplychain',
    TRANSPORTES='transportes',
    SEGURIDAD='seguridad'
}

export enum Estado
{
    DISPONIBLE='disponible',
    OCUPADO='ocupado',
}

@Entity('empleados')

export class Empleado
{
  @PrimaryGeneratedColumn({type:'mediumint', unsigned:true})
  id!: number;

  @Column({ type: 'mediumint', unsigned:true})
  no_empleado!: number;

  @Column({ type: 'varchar', length:36})
  nombre!: string;

  @Column({ type: 'varchar', length:21})
  apellido_paterno!: string;

  @Column({ type: 'varchar', length:21, nullable:true})
  apellido_materno?: string;

  @Column({ type: 'date'})
  fecha_nacimiento!: Date;

  @Column({ type: 'date'})
  fecha_ingreso!: Date;

  @Column({ type: 'varchar', length:255, nullable:true})
  imagen?: string;

  @Column({ type: 'enum', enum:Departamento})
  departamento!: Departamento;

  @Column({ type: 'varchar', length:34})
  puesto!: string;

  @Column({ type: 'enum', enum:Estado, nullable:true})
  estado?: Estado;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToOne(() => Usuario, (usuario) => usuario.empleado)
  usuario!: Usuario;

}