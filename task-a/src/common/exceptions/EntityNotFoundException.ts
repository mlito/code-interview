import { HttpException } from '@nestjs/common';

import { ResourceStatusCode } from '../utils/enums';

export class EntityNotFoundException extends HttpException {
  constructor(id: string | number) {
    super(`Entity not found '${id}`, ResourceStatusCode.NotFound);
  }
}
