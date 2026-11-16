import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './models/notification.entity';
import { Message } from './models/message.entity';
import { NotificationsService } from './services/notifications.service';
import { NotificationsController } from './controllers/notifications.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Message])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
