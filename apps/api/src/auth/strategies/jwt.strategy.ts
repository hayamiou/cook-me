import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { passportJwtSecret } from 'jwks-rsa'
import { ExtractJwt, Strategy } from 'passport-jwt'

interface JwtPayload {
  sub: string
  email?: string
  preferred_username?: string
  realm_access?: { roles: string[] }
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      audience: [process.env['KEYCLOAK_CLIENT_ID'] || 'cook-me-api', 'cook-me-mobile'],
      issuer: process.env['KEYCLOAK_ISSUER'] || 'http://localhost:8080/realms/cook-me',
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env['KEYCLOAK_ISSUER'] || 'http://localhost:8080/realms/cook-me'}/protocol/openid-connect/certs`,
      }),
      // biome-ignore lint/suspicious/noExplicitAny: passport-jwt + jwks-rsa types incompatibility
    } as any)
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token payload')
    }

    return {
      userId: payload.sub,
      email: payload.email,
      username: payload.preferred_username,
      roles: payload.realm_access?.roles || [],
    }
  }
}
