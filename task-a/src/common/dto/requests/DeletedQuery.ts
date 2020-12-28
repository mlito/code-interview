import { IsBoolean } from 'class-validator';

export class GetUsersQuery {
  @IsBoolean()
  public showDeleted: boolean;
}
