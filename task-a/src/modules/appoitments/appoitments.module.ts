import { Module } from '@nestjs/common';

import { AppoitmentRoute } from './routes/appoitment.route';
import { AppointmentsService } from './services/appointments.service';

@Module({
  imports: [],
  providers: [AppointmentsService],
  controllers: [AppoitmentRoute],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
