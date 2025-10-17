import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ProfileModule } from './profile/profile.module';
import { UserProfileModule } from './setting/userprofile/userprofile.module';
import { CompanyDetailsModule } from './setting/company-details/company-details.module';
import { PaymentmethodModule } from './setting/paymentmethod/paymentmethod.module';
import { TaxInformationModule } from './setting/taxinformation/taxinformation.module';
import { NotificationPreferenceModule } from './setting/notification-preferences/notification-preferences.module';
import { PartnersModule } from './partners/partners.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CompanyFollowersModule } from './company-follower/company-follower.module';
import { OpportunitiesModule } from './opportunities/opportunities.module';
import { PropertyModule } from './Realestate/property/property.module';
import { PropertyTypeModule } from './Realestate/property-type/property-type.module';
import { PropertyLocationModule } from './Realestate/property-location/property-location.module';
import { PropertyMediaModule } from './Realestate/property-media/property-media.module';
import { PropertySaleDetailsModule } from './Realestate/property-details/property-sale-details/property-sale-details.module';
import { PropertyNewBuildingDetailsModule } from './Realestate/property-details/property-new-building-details/property-new-building-details.module';
import { PropertyRentDetailsModule } from './Realestate/property-details/property-rent-details/property-rent-details.module';
import { PropertyNewBuildingFeaturesModule } from './Realestate/property-feature-and-contact/property-new-building-features/property-new-building-features.module';
import { PropertyResaleFeaturesModule } from './Realestate/property-feature-and-contact/property-resale-features/property-resale-features.module';
import { RentContactModule } from './Realestate/property-feature-and-contact/property-rent-contact/property-rent-contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      // Prefer single URL when provided (e.g., Render, PlanetScale, etc.)
      // Format: mysql://USER:PASSWORD@HOST:PORT/DB_NAME
      url:
        process.env.DATABASE_URL ||
        process.env.DB_URL ||
        undefined,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // ⚠️ Use false in production
      ssl:
        process.env.DB_SSL === 'true'
          ? { rejectUnauthorized: false }
          : undefined,
    }),
    AuthModule, 
    ScheduleModule.forRoot(), ProfileModule, UserProfileModule, CompanyDetailsModule, PaymentmethodModule, TaxInformationModule, NotificationPreferenceModule, PartnersModule, NotificationsModule, CompanyFollowersModule, OpportunitiesModule, PropertyModule, PropertyTypeModule, PropertyLocationModule, PropertyMediaModule, PropertySaleDetailsModule, PropertyNewBuildingDetailsModule, PropertyRentDetailsModule, PropertyNewBuildingFeaturesModule, PropertyResaleFeaturesModule, RentContactModule, 
  ],
  providers: [],
  controllers: [],

})
export class AppModule {}
