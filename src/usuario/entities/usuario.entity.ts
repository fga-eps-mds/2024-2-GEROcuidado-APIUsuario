import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';

@Entity({ name: 'usuario' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { length: 60 })
  nome!: string;

  @Column('bytea', { nullable: true })
  foto!: Buffer;

  @Column('varchar', { length: 100, unique: true })
  email!: string;

  @Column('varchar', {
    length: 100,
    select: false,
  })
  senha!: string;

  @Column({ nullable: true})
  codigoReset?: string;

  @Column({nullable: true, type: 'timestamp'})
  codigoResetExpiracao?: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  admin!: boolean;

  @Column('timestamp')
  data_nascimento!: Date;

  @Column('varchar', { length: 500, nullable: true })
  descricao!: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at!: Date;

  constructor(createUsuarioDto: CreateUsuarioDto | UpdateUsuarioDto) {
    Object.assign(this, createUsuarioDto);
  }
}
