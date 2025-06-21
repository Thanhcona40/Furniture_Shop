import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { userToResponse } from 'src/response/user.response';

@Injectable()
export class AuthService {
    constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(createUser: CreateUserDto) {
    const existingUser = await this.userModel.findOne({ email: createUser.email });
    if (existingUser) throw new UnauthorizedException('Người dùng đã tồn tại');

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(createUser.password, salt);

    const user = new this.userModel({
      email: createUser.email,
      password: password_hash,
      full_name: createUser.full_name,
      phone: createUser.phone,
    });
    await user.save();
    return { message: 'Đăng kí thành công' };
  }

  async login(loginUser: LoginUserDto) {
    const user = await this.userModel.findOne({ email: loginUser.email });
    if (!user) throw new UnauthorizedException('Người dùng không tồn tại');

    const isMatch = await bcrypt.compare(loginUser.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Mật khẩu không đúng');

    const payload = { user_id: user._id, email: user.email, role: user.role };
    return { 
            token: this.jwtService.sign(payload),
            user: userToResponse(user)
          };
  }

  async validateUser(userId: string) {
    return await this.userModel.findById(userId);
  }
}
