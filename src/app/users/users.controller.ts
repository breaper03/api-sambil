import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { IUser } from 'src/models/user.model';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  // @UseGuards(JwtGuard)
  @Post('')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { email: { type: 'string' }, password: { type: 'string' } }
    }
  })
  async add(@Body() body: Omit<IUser, 'createdAt' | 'updatedAt'>) {
    return await this.usersService.addUser(body);
  }

  @UseGuards(JwtGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: { email: { type: 'string' }, password: { type: 'string' } }
    }
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<IUser>) {
    return await this.usersService.update(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }
}
