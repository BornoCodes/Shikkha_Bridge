
import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';

import { NoteRequestsService } from './note-requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestStatus } from './entities/enums';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('note-requests')
@UseGuards(JwtAuthGuard)
export class NoteRequestsController {
  constructor(private readonly service: NoteRequestsService) {}

  @Post()
  request(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateRequestDto,
  ) {
    return this.service.requestNotes(userId, dto);
  }

  @Get()
  list(@Query('status') status?: RequestStatus) {
    return this.service.list(status);
  }

  @Get(':id')
  one(
    @CurrentUser('id') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.getOne(id, userId);
  }

  @Delete(':id/request')
  cancel(
    @CurrentUser('id') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.cancelRequest(userId, id);
  }
}
