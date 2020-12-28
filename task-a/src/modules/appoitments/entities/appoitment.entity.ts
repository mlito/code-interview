import { IsNotEmpty } from 'class-validator';


export interface Appoitment {
  @IsNotEmpty()
  name: string;

}
