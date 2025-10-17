import { IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateNotificationPreferenceDto {
  @IsOptional() @Type(() => Boolean) @IsBoolean() emailNewMessages?: boolean;
  @IsOptional() @Type(() => Boolean) @IsBoolean() emailTeamUpdates?: boolean;
  @IsOptional() @Type(() => Boolean) @IsBoolean() emailBillingAlerts?: boolean;
  @IsOptional() @Type(() => Boolean) @IsBoolean() emailMarketing?: boolean;
  @IsOptional() @Type(() => Boolean) @IsBoolean() pushEnable?: boolean;
  @IsOptional() @Type(() => Boolean) @IsBoolean() pushNewMessages?: boolean;
  @IsOptional() @Type(() => Boolean) @IsBoolean() pushTeamActivity?: boolean;
  @IsOptional() @Type(() => Boolean) @IsBoolean() smsSecurityAlerts?: boolean;
  @IsOptional() @Type(() => Boolean) @IsBoolean() smsAccountUpdates?: boolean;
  @IsOptional() @Type(() => Boolean) @IsBoolean() inAppSoundAlerts?: boolean;
  @IsOptional() @Type(() => Boolean) @IsBoolean() inAppBadgeCounter?: boolean;
}
