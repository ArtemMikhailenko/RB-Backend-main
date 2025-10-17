import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationPreference } from './entities/notification-preference.entity';
import { UpdateNotificationPreferenceDto } from './dto/update-notification-preference.dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class NotificationPreferenceService {
  constructor(
    @InjectRepository(NotificationPreference)
    private repo: Repository<NotificationPreference>,
  ) {}

  private formatResponse(prefs: NotificationPreference) {
  return {
    emailNewMessages: prefs.emailNewMessages,
    emailTeamUpdates: prefs.emailTeamUpdates,
    emailBillingAlerts: prefs.emailBillingAlerts,
    emailMarketing: prefs.emailMarketing,
    pushEnable: prefs.pushEnable,
    pushNewMessages: prefs.pushNewMessages,
    pushTeamActivity: prefs.pushTeamActivity,
    smsSecurityAlerts: prefs.smsSecurityAlerts,
    smsAccountUpdates: prefs.smsAccountUpdates,
    inAppSoundAlerts: prefs.inAppSoundAlerts,
    inAppBadgeCounter: prefs.inAppBadgeCounter,
  };
}

  async getUserPreferences(user: User) {
    let prefs = await this.repo.findOne({ where: { user: { id: user.id } } });
    if (!prefs) {
      prefs = this.repo.create({ user });
      await this.repo.save(prefs);
    }
    return this.formatResponse(prefs);
  }

async updateUserPreferences(user: User, dto: UpdateNotificationPreferenceDto) {
  let prefs = await this.repo.findOne({
    where: { user: { id: user.id } },
  });

  if (!prefs) {
    prefs = this.repo.create({
      user,
      ...dto,
    });
  } else {
    // Ensure every provided field is updated, including false values
    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined) {
        prefs[key] = value;
      }
    }
  }

  await this.repo.save(prefs);

  return { message: 'Preferences updated successfully' };
}

}
