import { Injectable } from '@nestjs/common';
import * as qs from 'qs';
import { vnpayConfig } from './vnpay.config';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  createVnpayPaymentUrl(order: any): string {
    const date = new Date();
    const createDate =
      date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0') +
      date.getHours().toString().padStart(2, '0') +
      date.getMinutes().toString().padStart(2, '0') +
      date.getSeconds().toString().padStart(2, '0');

    const vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnpayConfig.vnp_TmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: order._id || Math.floor(Math.random() * 1000000).toString(),
      vnp_OrderInfo: `Thanh toan don hang ${order._id}`,
      vnp_OrderType: 'other',
      vnp_Amount: order.amount * 100, // VNPAY yêu cầu nhân 100
      vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
      vnp_IpAddr: order.ipAddr || '127.0.0.1',
      vnp_CreateDate: createDate,
    };

    // Sắp xếp các tham số theo thứ tự alphabet
    const sortedParams = Object.keys(vnp_Params)
      .sort()
      .reduce((r, k) => ((r[k] = vnp_Params[k]), r), {} as any);

    // Tạo chuỗi query
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
    const secureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Thêm secureHash vào params
    sortedParams['vnp_SecureHash'] = secureHash;
    const paymentUrl = `${vnpayConfig.vnp_Url}?${qs.stringify(sortedParams, { encode: true })}`;
    return paymentUrl;
  }
}
