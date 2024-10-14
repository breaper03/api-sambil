import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiBearerAuth, ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';
import { ITask } from 'src/models/task.model';
import { JwtGuard } from 'src/guards/jwt.guard';

@ApiBearerAuth()
@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtGuard)
  @ApiParam({ name: 'search', required: false })
  @Get()
  async findAll(@Query('search') search?: string) {
    return await this.tasksService.findAll(search ? search : '');
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findById(id);
  }

  @UseGuards(JwtGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        state: { type: 'string' },
        description: { type: 'string' }
      }
    }
  })
  @Post(':userId')
  async add(
    @Param('userId') userId: string,
    @Body() body: Omit<ITask, 'createdAt' | 'updatedAt'>
  ) {
    return await this.tasksService.addTask(body, userId);
  }

  @UseGuards(JwtGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        state: { type: 'string' },
        description: { type: 'string' }
      }
    }
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<ITask>) {
    return await this.tasksService.update(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.tasksService.remove(id);
  }
}
