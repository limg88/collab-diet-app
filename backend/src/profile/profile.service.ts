import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from './entities/user-profile.entity';
import { WeightRecord } from './entities/weight-record.entity';
import { BodyMeasurementRecord } from './entities/body-measurement-record.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly profileRepo: Repository<UserProfile>,
    @InjectRepository(WeightRecord)
    private readonly weightRepo: Repository<WeightRecord>,
    @InjectRepository(BodyMeasurementRecord)
    private readonly measurementRepo: Repository<BodyMeasurementRecord>,
  ) {}

  async getProfile(userId: string): Promise<UserProfile> {
    let profile = await this.profileRepo.findOne({ where: { userId } });
    if (!profile) {
      profile = this.profileRepo.create({ userId });
      await this.profileRepo.save(profile);
    }
    return profile;
  }

  async updateProfile(userId: string, dto: Partial<UserProfile>): Promise<UserProfile> {
    let profile = await this.profileRepo.findOne({ where: { userId } });
    if (!profile) {
      profile = this.profileRepo.create({ userId });
    }
    Object.assign(profile, dto);
    return this.profileRepo.save(profile);
  }

  async addWeight(userId: string, weightKg: number): Promise<WeightRecord> {
    const record = this.weightRepo.create({ userId, weightKg });
    return this.weightRepo.save(record);
  }

  async getWeightHistory(userId: string): Promise<WeightRecord[]> {
    return this.weightRepo.find({
      where: { userId },
      order: { recordedAt: 'DESC' },
      take: 50,
    });
  }

  async addMeasurements(userId: string, dto: Partial<BodyMeasurementRecord>): Promise<BodyMeasurementRecord> {
    const record = this.measurementRepo.create({ userId, ...dto });
    return this.measurementRepo.save(record);
  }

  async getMeasurementsHistory(userId: string): Promise<BodyMeasurementRecord[]> {
    return this.measurementRepo.find({
      where: { userId },
      order: { recordedAt: 'DESC' },
      take: 20,
    });
  }
}
