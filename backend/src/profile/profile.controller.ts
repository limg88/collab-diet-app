import {
  Controller, Get, Post, Patch, Body, Request, UseGuards, HttpCode, HttpStatus
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProfileService } from './profile.service';

@Controller('profile')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@Request() req) {
    return this.profileService.getProfile(req.user.id);
  }

  @Patch()
  updateProfile(@Request() req, @Body() body: any) {
    const { firstName, lastName, birthDate, gender, heightCm } = body;
    return this.profileService.updateProfile(req.user.id, { firstName, lastName, birthDate, gender, heightCm });
  }

  @Post('weight')
  @HttpCode(HttpStatus.CREATED)
  addWeight(@Request() req, @Body() body: { weightKg: number }) {
    return this.profileService.addWeight(req.user.id, body.weightKg);
  }

  @Get('weight/history')
  getWeightHistory(@Request() req) {
    return this.profileService.getWeightHistory(req.user.id);
  }

  @Post('measurements')
  @HttpCode(HttpStatus.CREATED)
  addMeasurements(@Request() req, @Body() body: any) {
    return this.profileService.addMeasurements(req.user.id, body);
  }

  @Get('measurements/history')
  getMeasurementsHistory(@Request() req) {
    return this.profileService.getMeasurementsHistory(req.user.id);
  }
}
