import { Expose, Transform } from "class-transformer";
import { Usuario } from "../entities/usuario.entity";

export class UsuarioDto {
  @Expose()
  @Transform(({ value }) => value.toString())
  id!: string;

  nome!: string;
  foto!: Buffer | null;
  email!: string;
  admin!: boolean;

  @Transform(({ value }) => Date.parse(value))
  created_at!: number;

  @Transform(({ value }) => Date.parse(value))
  updated_at!: number;

  constructor(partial: Partial<Usuario>) {
    Object.assign(this, partial);
  }
}

export class PullUsuariosResponseDto {
  changes!: {
    usuario: {
      created: UsuarioDto[],
      updated: UsuarioDto[],
      deleted: string[]
    }
  };

  timestamp!: number;
}
