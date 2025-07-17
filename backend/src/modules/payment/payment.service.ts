import { Injectable } from '@nestjs/common';
import * as qs from 'qs';
import * as crypto from 'crypto';
import { vnpayConfig } from './vnpay.config';
import * as moment from 'moment';

@Injectable()
export class PaymentService {
  createVnpayPaymentUrl(order: any): string {
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const expireDate = moment(date).add(15, 'minutes').format('YYYYMMDDHHmmss')

    const vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnpayConfig.vnp_TmnCode,
      vnp_Amount: order.amount * 100,
      vnp_TxnRef: order.orderId || order._id || Math.floor(Math.random() * 1000000).toString(),
      vnp_OrderInfo: `Thanh toan don hang ${order.orderId || order._id || ''}`,
      vnp_OrderType: 'other',
      vnp_IpAddr: order.ipAddr,
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
      vnp_CurrCode: 'VND',
      vnp_Locale: 'vn',
      vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
    };

    // Sort params alphabetically
    const sortedParams = Object.keys(vnp_Params)
      .sort()
      .reduce((r, k) => ((r[k] = vnp_Params[k]), r), {} as any);

    // Build signData string
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
    const secureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Add secureHash to params
    sortedParams['vnp_SecureHash'] = secureHash;
    const paymentUrl = `${vnpayConfig.vnp_Url}?${qs.stringify(sortedParams, { encode: true })}`;
    return paymentUrl;
  }
}
