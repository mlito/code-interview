import { IsNotEmpty, IsOptional } from 'class-validator';


export class ListAppointmentQS {
  @IsOptional()
  @IsNotEmpty()
  public date?: number;
  @IsOptional()
  @IsNotEmpty()
  public specialty?: string;
  @IsOptional()
  @IsNotEmpty()
  public minScore?: string;
}
