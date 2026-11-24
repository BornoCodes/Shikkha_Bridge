// CONTROLLER (MVC): receives HTTP requests, calls the service, returns the result.
// No business rules here.
import {
  Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, Body, UseGuards,
} from '@nestjs/common';
import { NoteRequestsService } from './note-requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestStatus } from './entities/enums';
// TODO: change to your real guard file in server/src/auth/
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('note-requests')
@UseGuards(JwtAuthGuard)
export class NoteRequestsController {
  constructor(private readonly service: NoteRequestsService) {}

  // TODO: check what your JWT strategy puts on req.user (id? userId? sub?)
  private uid(req: any): number {
    return req.user.id;
  }

  @Post()
  request(@Req() req: any, @Body() dto: CreateRequestDto) {
    return this.service.requestNotes(this.uid(req), dto);
  }

  @Get()
  list(@Query('status') status?: RequestStatus) {
    return this.service.list(status);
  }

  @Get(':id')
  one(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.service.getOne(id, this.uid(req));
  }

  @Delete(':id/request')
  cancel(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.service.cancelRequest(this.uid(req), id);
  }
}
