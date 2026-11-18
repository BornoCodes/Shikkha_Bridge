import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../models/notification.entity';
import { Message } from '../models/message.entity';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { SendMessageDto } from '../dto/send-message.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.notificationRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: string): Promise<Notification> {
    const notif = await this.notificationRepo.findOne({ where: { id } });
    if (!notif) throw new NotFoundException('Notification not found');
    notif.read = true;
    return this.notificationRepo.save(notif);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepo.update({ userId }, { read: true });
  }

  async createNotification(dto: CreateNotificationDto): Promise<Notification> {
    const notif = this.notificationRepo.create(dto);
    return this.notificationRepo.save(notif);
  }

  async sendMessage(senderId: string, dto: SendMessageDto): Promise<Message> {
    const msg = this.messageRepo.create({
      senderId,
      receiverId: dto.receiverId,
      content: dto.content,
    });
    return this.messageRepo.save(msg);
  }

  async getConversation(user1: string, user2: string): Promise<Message[]> {
    return this.messageRepo
      .createQueryBuilder('msg')
      .leftJoinAndSelect('msg.sender', 'sender')
      .leftJoinAndSelect('msg.receiver', 'receiver')
      .where('(msg.sender_id = :u1 AND msg.receiver_id = :u2) OR (msg.sender_id = :u2 AND msg.receiver_id = :u1)', {
        u1: user1,
        u2: user2,
      })
      .orderBy('msg.created_at', 'ASC')
      .getMany();
  }
}
