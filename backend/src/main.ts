import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UserService } from './modules/user/user.service';
import * as bcrypt from 'bcrypt';
import { Role } from './common/enums/role.enum';
import helmet from 'helmet';
import { INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

/**
 * Create default admin account from environment variables
 */
async function createDefaultAdmin(app: INestApplication) {
  const userService = app.get(UserService);

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set in environment variables. Skipping admin creation.');
    return;
  }

  const existingAdmin = await userService.findByEmail(adminEmail);

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await userService.create({
      email: adminEmail,
      password: hashedPassword,
      full_name: process.env.ADMIN_FULL_NAME || 'Admin',
      phone: process.env.ADMIN_PHONE || '0000000000',
      role: Role.Admin,
    });
    console.log('✅ Admin account created successfully');
    console.log(`📧 Email: ${adminEmail}`);
  } else {
    console.log('ℹ️  Admin account already exists');
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global exception filter for consistent error handling
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(helmet());

  // Create default admin account if not exists
  await createDefaultAdmin(app);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server is running on http://localhost:${port}`);
}
bootstrap();

