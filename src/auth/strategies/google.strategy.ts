import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL');

    if (!clientID || !clientSecret || !callbackURL) {
      // When AuthModule is configured to include this provider, enforce proper env configuration
      throw new Error(
        'GoogleStrategy is enabled but GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET/GOOGLE_CALLBACK_URL are not set',
      );
    }

    const options: StrategyOptions = {
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    };

    super(options);
  }

async validate(
  accessToken: string,
  refreshToken: string,
  profile: Profile,
): Promise<any> {
  const { name, emails, id, photos } = profile;

  return {
    email: emails?.[0]?.value || '',
    firstName: name?.givenName || '',
    lastName: name?.familyName || '',
    googleId: id,
    profilePic: photos?.[0]?.value || null,
  };
}

}
