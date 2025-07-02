import { Controller, Get, Param, Request, UseGuards, } from '@nestjs/common';
import { AddressService } from './address.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('provinces')
  async getProvinces() {
    return this.addressService.getProvinces();
  }

  @Get('districts/:provinceId')
  async getDistricts(@Param('provinceId') provinceId: string) {
    return this.addressService.getDistricts(provinceId);
  }

  @Get('wards/:districtId')
  async getWards(@Param('districtId') districtId: string) {
    return this.addressService.getWards(districtId);
  }

  @Get('province/:id')
  async getProvinceNameById(@Param('id') id: string) {
    return this.addressService.getProvinceNameById(id);
  }

  @Get('district/:id')
  async getDistrictNameById(@Param('id') id: string) {
    return this.addressService.getDistrictNameById(id);
  }

  @Get('ward/:id')
  async getWardNameById(@Param('id') id: string) {
    return this.addressService.getWardNameById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('default')
  async getDefaultAddress(@Request() req) {
    const userId = req.user.user_id;
    return this.addressService.getDefaultAddress(userId);
  }
}
