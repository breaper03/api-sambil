import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IUser } from 'src/models/user.model';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { email: { type: 'string' }, password: { type: 'string' } }
    }
  })
  async login(@Body() body: Pick<IUser, 'email' | 'password'>) {
    return await this.authService.login(body);
  }
}
