import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { vnpayConfig } from './vnpay.config';
import * as moment from 'moment';

@Injectable()
export class PaymentService {
  createVnpayPaymentUrl(order: any): string {
    const now = moment().utcOffset(7); // Lấy giờ Việt Nam
    const createDate = now.format('YYYYMMDDHHmmss');
    const expireDate = now.clone().add(15, 'minutes').format('YYYYMMDDHHmmss');

    const vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnpayConfig.vnp_TmnCode,
      vnp_Amount: order.amount * 100,
      vnp_TxnRef: order.orderId || order._id || Math.floor(Math.random() * 1000000).toString(),
      vnp_OrderInfo: `Thanh toan don hang ${order.orderId || ''}`,
      vnp_OrderType: 'other',
      vnp_IpAddr: order.ipAddr,
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
      vnp_CurrCode: 'VND',
      vnp_Locale: 'vn',
      vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
    };

    // Build query string theo đúng mẫu VNPAY
    const redirectUrl = new URL(vnpayConfig.vnp_Url);
    
    Object.entries(vnp_Params)
      .sort(([key1], [key2]) => key1.localeCompare(key2))
      .forEach(([key, value]) => {
        if (!value || value === "" || value === undefined || value === null) return;
        redirectUrl.searchParams.append(key, value.toString());
      });

    // Ký signData bằng query string đã encode
    const signData = redirectUrl.search.slice(1); // Bỏ dấu ?
    const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
    const secureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    console.log("signData: ", signData)
    console.log("vnp_HashSecret:", vnpayConfig.vnp_HashSecret);
    console.log("secureHash:", secureHash);
    // Thêm vnp_SecureHash vào cuối
    redirectUrl.searchParams.append('vnp_SecureHash', secureHash);

    // Trả về URL hoàn chỉnh
    return redirectUrl.toString();
  }
}
