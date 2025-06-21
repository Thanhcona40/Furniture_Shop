import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressSchema } from './schemas/address.schema';
import { UserAddressSchema } from './schemas/user-address.schema';
import { DistrictSchema } from './schemas/district.schema';
import { Province, ProvinceSchema } from './schemas/province.schema';
import { WardSchema } from './schemas/ward.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Address', schema: AddressSchema } 
    ]),
    MongooseModule.forFeature([
      { name: 'UserAddress', schema: UserAddressSchema } 
    ]),
    MongooseModule.forFeature([
      {name: 'District', schema: DistrictSchema}
    ]),
    MongooseModule.forFeature([
      {name: 'Ward', schema: WardSchema}
    ]),
    MongooseModule.forFeature([
      {name: 'Province', schema: ProvinceSchema}
    ])
  ],
  controllers: [AddressController],
  providers: [AddressService]
})
export class AddressModule {}
