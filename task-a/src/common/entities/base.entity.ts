import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { AbstractDto } from '../dto/AbstractDto';
import { UtilsService } from '../services/utils.service';

export abstract class BaseEntity<T extends AbstractDto = AbstractDto> {
  @PrimaryGeneratedColumn({ name: 'id' })
  public id: number;
  abstract dtoClass: new (entity: BaseEntity, options?: any) => T;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updatedAt?: Date;
  toDto(options?: any) {
    return UtilsService.toDto(this.dtoClass, this, options);
  }
}
