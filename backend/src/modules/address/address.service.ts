import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Province, ProvinceDocument } from './schemas/province.schema';
import { District, DistrictDocument } from './schemas/district.schema';
import { Ward, WardDocument } from './schemas/ward.schema';
import { UserAddress, UserAddressDocument } from './schemas/user-address.schema';


@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Province.name) private provinceModel: Model<ProvinceDocument>,
    @InjectModel(District.name) private districtModel: Model<DistrictDocument>,
    @InjectModel(Ward.name) private wardModel: Model<WardDocument>,
    @InjectModel(UserAddress.name) private userAddressModel: Model<UserAddressDocument>,
  ) {}

  async getProvinces() {
    return this.provinceModel.find();
  }

  async getDistricts(provinceId: string) {
    return this.districtModel.find({ province_id: provinceId });
  }

  async getWards(districtId: string) {
    return this.wardModel.find({ district_id: districtId });
  }

  async getProvinceNameById(id: string) {
    const province = await this.provinceModel.findById(id);
    if (!province) return { name: '' };
    return { name: province.name };
  }

  async getDistrictNameById(id: string) {
    const district = await this.districtModel.findById(id);
    if (!district) return { name: '' };
    return { name: district.name };
  }

  async getWardNameById(id: string) {
    const ward = await this.wardModel.findById(id);
    if (!ward) return { name: '' };
    return { name: ward.name };
  }

  async getDefaultAddress(userId: string) {
    return this.userAddressModel.findOne({ user_id: userId, is_default: true });
  }
}
