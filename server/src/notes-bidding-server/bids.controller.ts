// CONTROLLER (MVC) for bids.
import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards,
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { PlaceBidDto, UpdateBidDto } from './dto/place-bid.dto';
// TODO: change to your real guard file in server/src/auth/
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('note-requests/:requestId/bids')
@UseGuards(JwtAuthGuard)
export class BidsController {
  constructor(private readonly service: BidsService) {}

  private uid(req: any): number {
    return req.user.id; // TODO: match your JWT payload
  }

  @Post()
  place(@Req() req: any, @Param('requestId', ParseIntPipe) requestId: number, @Body() dto: PlaceBidDto) {
    return this.service.placeBid(this.uid(req), requestId, dto);
  }

  @Get()
  list(@Param('requestId', ParseIntPipe) requestId: number) {
    return this.service.listBids(requestId);
  }

  @Patch(':bidId')
  update(
    @Req() req: any,
    @Param('requestId', ParseIntPipe) requestId: number,
    @Param('bidId', ParseIntPipe) bidId: number,
    @Body() dto: UpdateBidDto,
  ) {
    return this.service.updateBid(this.uid(req), requestId, bidId, dto);
  }

  @Delete(':bidId')
  withdraw(
    @Req() req: any,
    @Param('requestId', ParseIntPipe) requestId: number,
    @Param('bidId', ParseIntPipe) bidId: number,
  ) {
    return this.service.withdrawBid(this.uid(req), requestId, bidId);
  }

  @Post(':bidId/accept')
  accept(
    @Req() req: any,
    @Param('requestId', ParseIntPipe) requestId: number,
    @Param('bidId', ParseIntPipe) bidId: number,
  ) {
    return this.service.acceptBid(this.uid(req), requestId, bidId);
  }

  @Post(':bidId/reject')
  reject(
    @Req() req: any,
    @Param('requestId', ParseIntPipe) requestId: number,
    @Param('bidId', ParseIntPipe) bidId: number,
  ) {
    return this.service.rejectBid(this.uid(req), requestId, bidId);
  }
}
