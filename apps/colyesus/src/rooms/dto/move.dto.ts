import { IsNumber } from 'class-validator';

export class MoveDto {
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;
}
