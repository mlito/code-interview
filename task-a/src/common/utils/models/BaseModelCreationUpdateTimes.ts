import { createSecretKey } from 'crypto';
import { BeforeInsert, BeforeUpdate, Column } from 'typeorm';

import { dateTransformer } from '../TypeormModelHelper';

export abstract class BaseModelCreationUpdateTimes {
  @Column({
    name: 'created_at',
    type: 'timestamp',
    transformer: dateTransformer,
  })
  public createdAt: Date;
  @Column({
    name: 'updated_at',
    type: 'timestamp',
    transformer: dateTransformer,
  })
  public updatedAt: Date;

  @BeforeInsert()
  public async onCreate(): Promise<void> {
    this.updatedAt = new Date();
    this.createdAt = new Date();
    return;
  }

  @BeforeUpdate()
  public async onUpdate(): Promise<void> {
    this.updatedAt = new Date();
    return;
  }
}
