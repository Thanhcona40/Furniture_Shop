import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { vnpayConfig } from './vnpay.config';
import * as crypto from 'crypto';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
  ) {}

  @Post('create-vnpay-url')
  createVnpayUrl(@Body() body: any) {
    // body nên chứa: amount, orderId, ipAddr, ...
    const paymentUrl = this.paymentService.createVnpayPaymentUrl(body);
    console.log("paymentUrrl: ", paymentUrl);
    return { paymentUrl };
  }

  @Get('vnpay-return')
  async vnpayReturn(@Query() query: any) {
    // Lấy vnp_SecureHash và loại khỏi params
    const vnp_SecureHash = query.vnp_SecureHash;
    delete query.vnp_SecureHash;
    delete query.vnp_SecureHashType;

    // Sắp xếp params theo thứ tự alphabet
    const sortedKeys = Object.keys(query).sort();
    const urlSearchParams = new URLSearchParams();
    for (const key of sortedKeys) {
      const value = query[key];
      if (!value || value === "" || value === undefined || value === null) continue;
      urlSearchParams.append(key, value.toString());
    }
    const signData = urlSearchParams.toString(); // đã encode giống lúc gửi đi
    const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
    const secureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    const isValid = vnp_SecureHash === secureHash;

    return {
      isValid,
      vnp_ResponseCode: query.vnp_ResponseCode,
      vnp_TransactionStatus: query.vnp_TransactionStatus,
      message: isValid
        ? 'Xác thực thành công callback từ VNPAY.'
        : 'Sai chữ ký callback từ VNPAY!',
      query,
    };
  }
}
