'use strict';

import { BaseEntity } from '../entities/base.entity';

export class AbstractDto {
    id: number;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(entity: BaseEntity) {
        this.id = entity.id;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
    }
}
