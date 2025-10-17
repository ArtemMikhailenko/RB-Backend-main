import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { NotificationPreferenceService } from './notification-preferences.service';
import { UpdateNotificationPreferenceDto } from './dto/update-notification-preference.dto';

@Controller('notification-preferences')
@UseGuards(JwtAuthGuard)
export class NotificationPreferenceController {
  constructor(private readonly service: NotificationPreferenceService) {}

  @Get()
  getPreferences(@GetUser() user: User) {
    return this.service.getUserPreferences(user);
  }

  @Patch()
  updatePreferences(
    @GetUser() user: User,
    @Body() dto: UpdateNotificationPreferenceDto,
  ) {
    return this.service.updateUserPreferences(user, dto);
  }
}
