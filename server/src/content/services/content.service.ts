import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content, ContentType } from '../models/content.entity';
import { CreateContentDto } from '../dto/create-content.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}

  async create(createContentDto: CreateContentDto, uploadedById: string): Promise<Content> {
    const content = this.contentRepository.create({
      ...createContentDto,
      uploadedById,
    });
    return this.contentRepository.save(content);
  }

  async findAll(filters?: {
    subject?: string;
    topicId?: string;
    type?: ContentType;
  }): Promise<Content[]> {
    const query = this.contentRepository
      .createQueryBuilder('content')
      .leftJoinAndSelect('content.topic', 'topic')
      .leftJoinAndSelect('topic.subject', 'subject')
      .leftJoinAndSelect('content.uploadedBy', 'uploader');

    if (filters?.topicId) {
      query.andWhere('content.topic_id = :topicId', { topicId: filters.topicId });
    }

    if (filters?.subject) {
      query.andWhere('subject.name LIKE :subject', {
        subject: `%${filters.subject}%`,
      });
    }

    if (filters?.type) {
      query.andWhere('content.type = :type', { type: filters.type });
    }

    query.orderBy('content.created_at', 'DESC');

    return query.getMany();
  }

  async findById(id: string): Promise<Content> {
    const content = await this.contentRepository.findOne({
      where: { id },
      relations: ['topic', 'topic.subject', 'uploadedBy'],
    });
    if (!content) {
      throw new NotFoundException(`Content with ID "${id}" not found`);
    }
    return content;
  }

  async findByTopic(topicId: string): Promise<Content[]> {
    return this.contentRepository.find({
      where: { topicId },
      relations: ['topic', 'uploadedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async delete(id: string): Promise<void> {
    const content = await this.findById(id);
    await this.contentRepository.remove(content);
  }
}
