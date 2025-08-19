export const formatAddress = (address) => {
    return [address.detail,address.ward_id?.name, address.district_id?.name,address.province_id?.name].filter(Boolean).join(', ');
  };