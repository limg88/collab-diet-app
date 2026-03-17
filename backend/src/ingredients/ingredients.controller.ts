import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@UseGuards(JwtAuthGuard)
@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Get()
  list(
    @Request() req,
    @Query('category') category?: string,
    @Query('name') name?: string,
  ) {
    return this.ingredientsService.list(req.user.id, { category, name });
  }

  @Post()
  create(@Request() req, @Body() dto: CreateIngredientDto) {
    return this.ingredientsService.create(req.user.id, dto);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateIngredientDto) {
    return this.ingredientsService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  softDelete(@Request() req, @Param('id') id: string) {
    return this.ingredientsService.softDelete(req.user.id, id);
  }
}
