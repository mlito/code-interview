import { UsePipes } from '@nestjs/common';
import {
  Controller,
  Get,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ListAppointmentQS } from '../dto/requests/ListAppointmentQS';
import { AppointmentsService } from '../services/appointments.service';

@Controller('appointment')
@ApiTags('appointment')
export class AppoitmentRoute {
  constructor(
    private appointmentsService: AppointmentsService,
  ) {}

  @Get('appointments')
  @UsePipes( new ValidationPipe( { transform: true, transformOptions: { enableImplicitConversion: true } }))
  @ApiOkResponse({
    description: 'User info with access token',
  })
  GetAppointments(
    @Query() query: ListAppointmentQS,
  ) {
    return this.appointmentsService.getAppointments(query);
  }
}
