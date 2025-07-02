import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { getProvinces, getDistricts, getWards } from '../../api/address';

const AddressForm = ({ defaultAddress, onChange }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    detail: '',
    province_id: '',
    district_id: '',
    ward_id: '',
    is_default: false,
  });

  // Fetch provinces on mount
  useEffect(() => {
    getProvinces().then(res => setProvinces(res.data));
  }, []);

  // Fetch districts khi province_id thay đổi
  useEffect(() => {
    if (form.province_id) {
      getDistricts(form.province_id).then(res => setDistricts(res.data));
    } else {
      setDistricts([]);
      setForm(f => ({ ...f, district_id: '', ward_id: '' }));
    }
  }, [form.province_id]);

  // Fetch wards khi district_id thay đổi
  useEffect(() => {
    if (form.district_id) {
      getWards(form.district_id).then(res => setWards(res.data));
    } else {
      setWards([]);
      setForm(f => ({ ...f, ward_id: '' }));
    }
  }, [form.district_id]);

  // Fill form nếu defaultAddress thay đổi
  useEffect(() => {
    if (defaultAddress) {
      setForm({
        full_name: defaultAddress.full_name || '',
        email: defaultAddress.email || '',
        phone: defaultAddress.phone || '',
        detail: defaultAddress.address?.detail || '',
        province_id: defaultAddress.address?.province_id || '',
        district_id: defaultAddress.address?.district_id || '',
        ward_id: defaultAddress.address?.ward_id || '',
        is_default: defaultAddress.is_default || false,
      });
    }
  }, [defaultAddress]);

  // Callback onChange
  useEffect(() => {
    if (onChange) onChange(form);
  }, [form, onChange]);

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <TextField
        fullWidth
        label="Họ và tên"
        value={form.full_name}
        onChange={e => handleChange('full_name', e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={form.email}
        onChange={e => handleChange('email', e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Số điện thoại"
        value={form.phone}
        onChange={e => handleChange('phone', e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Địa chỉ (số nhà, đường,...)"
        value={form.detail}
        onChange={e => handleChange('detail', e.target.value)}
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Tỉnh/Thành phố</InputLabel>
        <Select
          value={form.province_id || ''}
          onChange={e => handleChange('province_id', e.target.value)}
          label="Tỉnh/Thành phố"
        >
          {provinces.map(province => (
            <MenuItem key={province._id} value={province._id}>
              {province.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Quận/Huyện</InputLabel>
        <Select
          value={form.district_id || ''}
          onChange={e => handleChange('district_id', e.target.value)}
          label="Quận/Huyện"
          disabled={!form.province_id}
        >
          {districts.map(district => (
            <MenuItem key={district._id} value={district._id}>
              {district.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Phường/Xã</InputLabel>
        <Select
          value={form.ward_id || ''}
          onChange={e => handleChange('ward_id', e.target.value)}
          label="Phường/Xã"
          disabled={!form.district_id}
        >
          {wards.map(ward => (
            <MenuItem key={ward._id} value={ward._id}>
              {ward.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControlLabel
        control={
          <Checkbox
            checked={form.is_default}
            onChange={e => handleChange('is_default', e.target.checked)}
          />
        }
        label="Đặt làm địa chỉ mặc định"
        sx={{ mt: 2 }}
      />
    </div>
  );
};

export default AddressForm; 