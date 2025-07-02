import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserAddress, UserAddressSchema } from '../address/schemas/user-address.schema';
import { AuthModule } from '../auth/auth.module';
import { Province, ProvinceSchema } from '../address/schemas/province.schema';
import { District, DistrictSchema } from '../address/schemas/district.schema';
import { Ward, WardSchema } from '../address/schemas/ward.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserAddress.name, schema: UserAddressSchema },
      { name: Province.name, schema: ProvinceSchema },
      { name: District.name, schema: DistrictSchema },
      { name: Ward.name, schema: WardSchema },
    ]),
    ConfigModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [MongooseModule, UserService]
})
export class UserModule {}
