import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ContentService } from '../services/content.service';
import { CreateContentDto } from '../dto/create-content.dto';
import { ContentType } from '../models/content.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ParseUuidPipe } from '../../common/pipes/parse-uuid.pipe';

@Controller('content')
@UseGuards(JwtAuthGuard)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  async create(
    @Body() createContentDto: CreateContentDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.contentService.create(createContentDto, userId);
  }

  @Get()
  async findAll(
    @Query('subject') subject?: string,
    @Query('topicId') topicId?: string,
    @Query('type') type?: ContentType,
  ) {
    return this.contentService.findAll({ subject, topicId, type });
  }

  @Get(':id')
  async findOne(@Param('id', ParseUuidPipe) id: string) {
    return this.contentService.findById(id);
  }

  @Get('topic/:topicId')
  async findByTopic(@Param('topicId', ParseUuidPipe) topicId: string) {
    return this.contentService.findByTopic(topicId);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUuidPipe) id: string) {
    await this.contentService.delete(id);
    return { deleted: true };
  }
}
