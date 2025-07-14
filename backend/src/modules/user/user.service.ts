import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserAddress, UserAddressDocument } from '../address/schemas/user-address.schema';
import { Province } from '../address/schemas/province.schema';
import { District } from '../address/schemas/district.schema';
import { Ward } from '../address/schemas/ward.schema';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(UserAddress.name) private userAddressModel: Model<UserAddressDocument>,
        @InjectModel(Province.name) private provinceModel: Model<Province>,
        @InjectModel(District.name) private districtModel: Model<District>,
        @InjectModel(Ward.name) private wardModel: Model<Ward>,
    ) {} 
    

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email });
    }

    async findById(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id)  ;
    }

    async create(user: User): Promise<UserDocument | null> {
        return this.userModel.create(user);
    }

    async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<UserDocument | null> {
        return this.userModel.findByIdAndUpdate(
            userId,
            updateUserDto,
            { new: true, runValidators: true }
        );
    }

    async getUserWithAddress(userId: string) {
        const user = await this.userModel.findById(userId).select('-password');
        if (!user) {
            return null;
        }
        // Lấy danh sách UserAddress
        const addresses = await this.userAddressModel.find({ user_id: userId });
        // Tìm địa chỉ mặc định hoặc lấy địa chỉ đầu tiên
        let mainAddress = addresses.find(addr => addr.is_default) || addresses[0];
        let addressString = '';
        if (mainAddress) {
            const { detail, province_id, district_id, ward_id } = mainAddress.address;
            // Truy vấn tên các thực thể
            const [province, district, ward] = await Promise.all([
                this.provinceModel.findById(province_id),
                this.districtModel.findById(district_id),
                this.wardModel.findById(ward_id),
            ]);
            addressString = [
                detail,
                ward?.name,
                district?.name,
                province?.name
            ].filter(Boolean).join(', ');
        }
        return {
            ...user.toObject(),
            address: addressString
        };
    }

    async getAllUsers() {
        return this.userModel.find().select('-password');
    }

    async deleteUser(userId: string) {
        return this.userModel.findByIdAndDelete(userId);
    }

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
        const { oldPassword, newPassword, confirmNewPassword } = changePasswordDto;
        if (newPassword !== confirmNewPassword) {
            throw new BadRequestException('Mật khẩu xác nhận không khớp');
        }
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new BadRequestException('Người dùng không tồn tại');
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new BadRequestException('Mật khẩu cũ không đúng');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        return { message: 'Đổi mật khẩu thành công' };
    }
}
