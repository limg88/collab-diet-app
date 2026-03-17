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
import { ShoppingService } from './shopping.service';
import { CreateExtraItemDto } from './dto/create-extra-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@UseGuards(JwtAuthGuard)
@Controller('shopping')
export class ShoppingController {
  constructor(private readonly shoppingService: ShoppingService) {}

  @Get()
  getShoppingList(@Request() req) {
    return this.shoppingService.getShoppingList(req.user.id);
  }

  @Post('extras')
  addExtraItem(@Request() req, @Body() dto: CreateExtraItemDto) {
    return this.shoppingService.addExtraItem(req.user.id, dto);
  }

  @Patch(':id')
  updateItem(@Request() req, @Param('id') id: string, @Body() dto: UpdateItemDto) {
    return this.shoppingService.updateItem(req.user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteExtraItem(@Request() req, @Param('id') id: string) {
    return this.shoppingService.deleteExtraItem(req.user.id, id);
  }
}
