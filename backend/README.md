# Furniture Shop - Backend API

Backend API for Furniture E-commerce Platform built with NestJS, MongoDB, and TypeScript.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (Admin/User)
- **Product Management**: Full CRUD operations with variants, reviews, and categories
- **Shopping Cart**: Persistent cart management
- **Order System**: Complete order processing with status tracking
- **Payment Integration**: VNPay payment gateway integration
- **Real-time Notifications**: WebSocket-based notifications for users and admins
- **Address Management**: Province/District/Ward hierarchical address system
- **Blog System**: Content management for articles
- **Dashboard Analytics**: Sales and user statistics
- **Redis Caching**: Performance optimization with Redis

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (v4.4 or higher)
- **Redis** (optional, for caching)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. **Environment Configuration**:

Copy the `.env.example` file to create your `.env` file:
```bash
cp .env.example .env
```

Then update the `.env` file with your actual configuration:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/furniture_shop

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Admin Account (Required for first-time setup)
ADMIN_EMAIL=admin@furniture-shop.com
ADMIN_PASSWORD=YourStrongPassword123!
ADMIN_FULL_NAME=Admin
ADMIN_PHONE=0123456789

# Server
PORT=3000
CORS_ORIGIN=http://localhost:3001

# VNPay (Optional - for payment integration)
VNPAY_TMN_CODE=your_tmn_code
VNPAY_HASH_SECRET=your_hash_secret
```

⚠️ **Important**: 
- Change `ADMIN_PASSWORD` to a strong password
- Never commit `.env` file to version control
- Use different JWT secrets for development and production

4. **Start MongoDB** (if not running):
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or start local MongoDB service
sudo service mongod start  # Linux
brew services start mongodb-community  # macOS
```

## 🚀 Running the Application

```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The server will start on `http://localhost:3000` (or the PORT you specified).

On first run, the application will automatically create an admin account using the credentials from your `.env` file.

## 📁 Project Structure

```
src/
├── common/              # Shared utilities
│   ├── decorators/      # Custom decorators (e.g., @Roles())
│   ├── dto/            # Common DTOs (e.g., pagination)
│   ├── enums/          # Enums (roles, order status, etc.)
│   └── guards/         # Auth guards (JWT, Roles)
├── modules/            # Feature modules
│   ├── auth/          # Authentication
│   ├── user/          # User management
│   ├── product/       # Products & variants
│   ├── category/      # Categories
│   ├── cart/          # Shopping cart
│   ├── order/         # Order processing
│   ├── payment/       # Payment integration
│   ├── address/       # Address management
│   ├── notification/  # Notifications
│   ├── blog/          # Blog posts
│   ├── dashboard/     # Analytics
│   ├── websocket/     # Real-time features
│   └── redis/         # Caching
├── response/          # Response transformers
├── app.module.ts      # Root module
└── main.ts           # Application entry point
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📚 API Documentation

Once the server is running, you can access:
- **Swagger UI**: `http://localhost:3000/api/docs` (Coming soon)
- **API Health**: `http://localhost:3000/`

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Login Flow:
1. **Register**: `POST /auth/register`
2. **Login**: `POST /auth/login` - Returns JWT token
3. **Use Token**: Include in header: `Authorization: Bearer <token>`

### Admin Routes:
Protected routes require admin role. Default admin credentials are set in `.env` file.

## 🛡️ Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT authentication
- ✅ Role-based access control (RBAC)
- ✅ CORS configuration
- ✅ Helmet for security headers
- ✅ Input validation with class-validator
- ✅ Environment variable protection

## 🚀 Deployment

### Production Checklist:
- [ ] Update all environment variables
- [ ] Use strong JWT secret
- [ ] Change admin password
- [ ] Set proper CORS origins
- [ ] Enable HTTPS
- [ ] Set up MongoDB backup
- [ ] Configure Redis for production
- [ ] Set up monitoring and logging

### Build for Production:
```bash
npm run build
npm run start:prod
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - [GitHub Profile]

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- Database: [MongoDB](https://www.mongodb.com/)
- Payment: [VNPay](https://vnpay.vn/)

---

**Happy Coding! 🚀**

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
