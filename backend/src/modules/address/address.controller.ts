import { Controller, Get, Post, Put, Delete, Param, Body, Request, UseGuards, } from '@nestjs/common';
import { AddressService } from './address.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

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

  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  async getUserAddresses(@Request() req) {
    const userId = req.user.user_id;
    return this.addressService.getUserAddresses(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createAddress(@Request() req, @Body() createAddressDto: CreateAddressDto) {
    const userId = req.user.user_id;
    return this.addressService.createAddress(userId, createAddressDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async updateAddress(@Request() req, @Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    const userId = req.user.user_id;
    return this.addressService.updateAddress(userId, id, updateAddressDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteAddress(@Request() req, @Param('id') id: string) {
    const userId = req.user.user_id;
    return this.addressService.deleteAddress(userId, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/set-default')
  async setDefaultAddress(@Request() req, @Param('id') id: string) {
    const userId = req.user.user_id;
    return this.addressService.setDefaultAddress(userId, id);
  }
}
