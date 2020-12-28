import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';

import { SeederCommand } from './seederCommand';

@Module({
  imports: [CommandModule],
  providers: [SeederCommand],
})
export class SeederModule {}
