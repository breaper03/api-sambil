import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { backendDBManager } from 'src/dependency-injection';
import { createUserModel, IUser, UserSchema } from 'src/models/user.model';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  model = createUserModel(backendDBManager);
  async findAll() {
    try {
      return (await this.model.find()).map(user => {
        delete user.__v;
        return user;
      });
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

  async addUser(
    user: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<IUser> {
    try {
      const pwd = await hash(user.password, 10);
      const newUser = {
        ...user,
        createdAt: new Date(),
        updatedAt: new Date(),
        password: pwd,
      };

      const valid = UserSchema.safeParse(newUser);

      if (!valid.success) {
        const error = valid.error.issues;
        throw new HttpException(
          `Error: ${error.map((err) => `${err.message} on ${err.path[0]}.\n`)}`,
          HttpStatus.BAD_REQUEST
        );
      } else {
        await this.model.insert(newUser);
        return newUser
      }
    } catch (result: any) {
      const error = result.issues;
      throw new HttpException(
        `Error: ${error.map((err) => `${err.message} on ${err.path[0]}.\n`)}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async update(id: string, body: Partial<IUser>) {
    try {
      const find: IUser = await this.findById(id);
      const newSection = { ...find, ...body, updatedAt: new Date() };
      return await this.model.updateById(id, { values: newSection });
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
