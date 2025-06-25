import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UserService } from './modules/user/user.service';
import * as bcrypt from 'bcrypt';
import { Role } from './common/enums/role.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const userService = app.get(UserService);

  const adminEmail = 'admin@example.com';
  const admin = await userService.findByEmail(adminEmail);

  if (!admin) {
    const hashed = await bcrypt.hash('your-admin-password', 10);
    await userService.create({
      email: adminEmail,
      password: hashed,
      full_name: "admin",
      phone: "095435934",
      role: Role.Admin,
    });
    console.log('Admin account created.');
  } else {
    console.log('Admin already exists.');
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

