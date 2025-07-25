import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService,
              private configService: ConfigService,) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'your-secret-key',    
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload.user_id);
    if (!user) throw new UnauthorizedException('Người dùng không tồn tại');
    return { user_id: payload.user_id, email: payload.email, role: payload.role };
  }
}
