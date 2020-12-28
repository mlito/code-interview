import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';

@Injectable()
export class SeederCommand {
  // constructor() {}

  // eslint-disable-next-line @typescript-eslint/require-await
  @Command({
    command: 'seeder',
    describe: 'create a user',
    autoExit: true, // defaults to `true`, but you can use `false` if you need more control
  })
  async seeder() {
    return;
  }
}
