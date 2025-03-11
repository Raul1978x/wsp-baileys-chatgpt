import { IsString, IsNotEmpty } from 'class-validator';

export class StartSessionDto {
  @IsString()
  @IsNotEmpty()
  sessionName: string;
}
