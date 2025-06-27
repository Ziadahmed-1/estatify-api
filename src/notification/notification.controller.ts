import { Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Get()
  getMyNotifications(@CurrentUser() user: { userId: number }) {
    return this.service.getUserNotifications(user.userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.service.markAsRead(id);
  }
}
