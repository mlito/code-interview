import { HttpException } from '@nestjs/common';

import { ResourceStatusCode } from '../utils/enums';

export class SettingContextJsonParseException extends HttpException {
  constructor(key: string, context: string) {
    super(
      `Setting '${key}' with contextJSON '${context}' Result with error please check`,
      ResourceStatusCode.InternalServerError,
    );
  }
}
