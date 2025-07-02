import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Address, AddressSchema } from './schemas/address.schema';
import { UserAddress, UserAddressSchema } from './schemas/user-address.schema';
import { District, DistrictSchema } from './schemas/district.schema';
import { Province, ProvinceSchema } from './schemas/province.schema';
import { Ward, WardSchema } from './schemas/ward.schema';
import { AuthModule } from '../auth/auth.module';



@Module({
  imports: [
    MongooseModule.forFeature([
      { name: District.name, schema: DistrictSchema },
      { name: Ward.name, schema: WardSchema },
      { name: Province.name, schema: ProvinceSchema },
      {name : Address.name, schema: AddressSchema},
      {name: UserAddress.name, schema: UserAddressSchema}
    ]),
    AuthModule
  ],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
