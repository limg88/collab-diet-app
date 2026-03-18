import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserProfile } from './entities/user-profile.entity';
import { WeightRecord } from './entities/weight-record.entity';
import { BodyMeasurementRecord } from './entities/body-measurement-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile, WeightRecord, BodyMeasurementRecord])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
