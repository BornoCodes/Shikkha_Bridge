import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { BidsService } from './bids.service';
import { PlaceBidDto, UpdateBidDto } from './dto/place-bid.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('note-requests/:requestId/bids')
@UseGuards(JwtAuthGuard)
export class BidsController {
  constructor(private readonly service: BidsService) {}

  @Post()
  placeBid(
    @CurrentUser('id') userId: string,
    @Param('requestId', ParseIntPipe) requestId: number,
    @Body() dto: PlaceBidDto,
  ) {
    return this.service.placeBid(userId, requestId, dto);
  }

  @Patch(':bidId')
  updateBid(
    @CurrentUser('id') userId: string,
    @Param('requestId', ParseIntPipe) requestId: number,
    @Param('bidId', ParseIntPipe) bidId: number,
    @Body() dto: UpdateBidDto,
  ) {
    return this.service.updateBid(userId, requestId, bidId, dto);
  }

  @Delete(':bidId')
  withdrawBid(
    @CurrentUser('id') userId: string,
    @Param('requestId', ParseIntPipe) requestId: number,
    @Param('bidId', ParseIntPipe) bidId: number,
  ) {
    return this.service.withdrawBid(userId, requestId, bidId);
  }

  @Get()
  listBids(
    @Param('requestId', ParseIntPipe) requestId: number,
  ) {
    return this.service.listBids(requestId);
  }

  @Post(':bidId/accept')
  acceptBid(
    @CurrentUser('id') userId: string,
    @Param('requestId', ParseIntPipe) requestId: number,
    @Param('bidId', ParseIntPipe) bidId: number,
  ) {
    return this.service.acceptBid(userId, requestId, bidId);
  }

  @Post(':bidId/reject')
  rejectBid(
    @CurrentUser('id') userId: string,
    @Param('requestId', ParseIntPipe) requestId: number,
    @Param('bidId', ParseIntPipe) bidId: number,
  ) {
    return this.service.rejectBid(userId, requestId, bidId);
  }
}
