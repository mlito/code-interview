import { HttpException } from '@nestjs/common';

import { ResourceStatusCode } from '../utils/enums';

export class EntityFoundException extends HttpException {
  constructor(id: string | number) {
    super(`Entity found '${id}`, ResourceStatusCode.BadRequest);
  }
}
