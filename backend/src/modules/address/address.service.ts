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
    // Trả về userAddress mặc định, chỉ gồm id và detail
    return this.userAddressModel.findOne({ user_id: userId, is_default: true });
  }

  async getUserAddresses(userId: string) {
    // Trả về tất cả userAddress của user, chỉ gồm id và detail
    return this.userAddressModel.find({ user_id: userId }).sort({ is_default: -1, createdAt: -1 });
  }

  async createAddress(userId: string, createAddressDto: any) {
    const { is_default, province_id, district_id, ward_id, detail, ...userData } = createAddressDto;
    
    // Nếu đặt làm mặc định, bỏ mặc định của các địa chỉ khác
    if (is_default) {
      await this.userAddressModel.updateMany(
        { user_id: userId },
        { is_default: false }
      );
    }

    const newAddress = new this.userAddressModel({
      user_id: userId,
      ...userData,
      address: {
        detail,
        province_id,
        district_id,
        ward_id
      },
      is_default: is_default || false
    });

    return newAddress.save();
  }

  async updateAddress(userId: string, addressId: string, updateAddressDto: any) {
    const { is_default, province_id, district_id, ward_id, detail, ...userData } = updateAddressDto;
    
    // Nếu đặt làm mặc định, bỏ mặc định của các địa chỉ khác
    if (is_default) {
      await this.userAddressModel.updateMany(
        { user_id: userId, _id: { $ne: addressId } },
        { is_default: false }
      );
    }

    const updateData = {
      ...userData,
      is_default: is_default || false
    };

    // Cập nhật address nếu có dữ liệu mới
    if (province_id !== undefined || district_id !== undefined || ward_id !== undefined || detail !== undefined) {
      // Lấy địa chỉ hiện tại để merge
      const currentAddress = await this.userAddressModel.findById(addressId);
      if (currentAddress) {
        updateData.address = {
          ...currentAddress.address,
          ...(province_id !== undefined && { province_id }),
          ...(district_id !== undefined && { district_id }),
          ...(ward_id !== undefined && { ward_id }),
          ...(detail !== undefined && { detail })
        };
      }
    }

    return this.userAddressModel.findOneAndUpdate(
      { _id: addressId, user_id: userId },
      updateData,
      { new: true }
    );
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await this.userAddressModel.findOne({ _id: addressId, user_id: userId });
    if (!address) {
      throw new Error('Address not found');
    }

    // Nếu xóa địa chỉ mặc định, đặt địa chỉ đầu tiên làm mặc định
    if (address.is_default) {
      const nextAddress = await this.userAddressModel.findOne({ 
        user_id: userId, 
        _id: { $ne: addressId } 
      }).sort({ createdAt: -1 });
      
      if (nextAddress) {
        nextAddress.is_default = true;
        await nextAddress.save();
      }
    }

    return this.userAddressModel.findByIdAndDelete(addressId);
  }

  async setDefaultAddress(userId: string, addressId: string) {
    // Bỏ mặc định của tất cả địa chỉ
    await this.userAddressModel.updateMany(
      { user_id: userId },
      { is_default: false }
    );

    // Đặt địa chỉ được chọn làm mặc định
    return this.userAddressModel.findOneAndUpdate(
      { _id: addressId, user_id: userId },
      { is_default: true },
      { new: true }
    );
  }
}
