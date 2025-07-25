import { Controller, Put, Body, UseGuards, Request, Get, Delete, Param, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user.user_id;
    console.log(userId);
    return this.userService.getUserWithAddress(userId);
  }

  @Put('profile')
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.user_id;
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Patch('change-password')
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    const userId = req.user.user_id;
    return this.userService.changePassword(userId, changePasswordDto);
  }
}
