import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name);

    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService, // Inject ConfigService for environment variables
    ) {
        super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: configService.get<string>('JWT_SECRET') || 'claveSecreta', // Secret key from environment variables
        });
    }

    /**
     * Validate the JWT payload and authenticate the user.
     * @param payload The JWT payload containing the user details.
     * @returns The user object with essential details if validated, otherwise throws UnauthorizedException.
     */
    async validate(payload: any) {
        try {
        this.logger.debug(`Validating JWT payload: ${JSON.stringify(payload)}`);
        
        const user = await this.authService.validateUser(payload);
        if (!user) {
            this.logger.warn(`User with email ${payload.email} not found or invalid credentials`);
            throw new UnauthorizedException('Invalid or expired token');
        }

        this.logger.log(`User ${payload.email} validated successfully`);
        return { 
            id: payload.sub,
            email: payload.email,
            role: payload.role,
        };
        } catch (error) {
        this.logger.error('Error occurred during JWT validation', error.stack);
        throw new UnauthorizedException('Authorization failed');
        }
    }
}
