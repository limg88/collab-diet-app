import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MenuService } from './menu.service';
import { AddMealItemDto } from './dto/add-meal-item.dto';
import { UpdateMealItemDto } from './dto/update-meal-item.dto';

@UseGuards(JwtAuthGuard)
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('current')
  getCurrentWeekMenu(@Request() req) {
    return this.menuService.getCurrentWeekMenu(req.user.id);
  }

  @Post('items')
  addMealItem(@Request() req, @Body() dto: AddMealItemDto) {
    return this.menuService.addMealItem(req.user.id, dto);
  }

  @Patch('items/:id')
  updateMealItem(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateMealItemDto,
  ) {
    return this.menuService.updateMealItem(req.user.id, id, dto);
  }

  @Delete('items/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMealItem(@Request() req, @Param('id') id: string) {
    return this.menuService.removeMealItem(req.user.id, id);
  }

  @Get('collaborator/:userId')
  getCollaboratorMenu(@Request() req, @Param('userId') collaboratorId: string) {
    return this.menuService.getCollaboratorMenu(req.user.id, collaboratorId);
  }
}
