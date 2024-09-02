import { IsNotEmpty, IsOptional } from "class-validator";

export class PullUsuariosQueryParamsDto {
  @IsNotEmpty()
  lastPulledAt!: number;

  @IsOptional()
  schemaVersion?: number;

  @IsOptional()
  migration?: any; // We'll just ignore this for a while
}