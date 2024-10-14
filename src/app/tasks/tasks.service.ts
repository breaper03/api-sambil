import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { backendDBManager } from 'src/dependency-injection';
import { createTaskModel, ITask, TaskSchema } from 'src/models/task.model';

@Injectable()
export class TasksService {
  model = createTaskModel(backendDBManager);

  async findAll(searchQuery?: string) {
    try {
      const res = (await this.model.find()).map((task) => {
        delete task.__v;
        return task;
      });
      if (!searchQuery) {
        return res;
      } else {
        console.log(searchQuery);
        const filter = res.filter(
          (task: ITask) =>
            task.title
              .toLowerCase()
              .trim()
              .includes(searchQuery.toLowerCase().trim()) ||
            task.description
              .toLowerCase()
              .trim()
              .includes(searchQuery.toLowerCase().trim())
        );
        return filter;
      }
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findById(id: string) {
    try {
      const res = await this.model.findById(id);
      delete res.__v;
      return res;
    } catch (error) {
      return error;
    }
  }

  async findByUser(userId: string): Promise<ITask[] | string> {
    try {
      return (await this.model.find({ owner: userId })).map((task) => {
        delete task.__v;
        return task;
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async addTask(
    task: Omit<ITask, 'id' | 'createdAt' | 'updatedAt'>,
    userId: string
  ): Promise<ITask> {
    try {
      const newTask = {
        ...task,
        owner: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const valid = TaskSchema.safeParse(newTask);

      if (!valid.success) {
        const error = valid.error.issues;
        throw new HttpException(
          `Error: ${error.map((err) => `${err.message} on ${err.path[0]}.\n`)}`,
          HttpStatus.BAD_REQUEST
        );
      } else {
        await this.model.insert(newTask);
        return newTask;
      }
    } catch (result: any) {
      const error = result.issues;
      throw new HttpException(
        `Error: ${error.map((err) => `${err.message} on ${err.path[0]}.\n`)}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async update(id: string, body: Partial<ITask>) {
    try {
      const find: ITask = await this.findById(id);
      const newSection = { ...find, ...body, updatedAt: new Date() };
      await this.model.updateById(id, { values: newSection });
      return await this.findById(id);
    } catch (error) {
      return error;
    }
  }

  async remove(id: string) {
    try {
      return this.model.deleteById(id);
    } catch (error) {
      return error;
    }
  }
}
