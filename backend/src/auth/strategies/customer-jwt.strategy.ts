import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../../database/entities/customer.entity';

export interface CustomerJwtPayload {
  sub: number;
  email: string;
  type: 'customer';
}

@Injectable()
export class CustomerJwtStrategy extends PassportStrategy(Strategy, 'customer-jwt') {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Validate customer JWT payload
   * @param payload - Decoded JWT payload
   * @returns Customer data to be attached to request.user
   */
  async validate(payload: CustomerJwtPayload) {
    // Ensure this is a customer token
    if (payload.type !== 'customer') {
      throw new UnauthorizedException('Invalid token type');
    }

    const customer = await this.customerRepository.findOne({
      where: { customerId: payload.sub },
    });

    if (!customer) {
      throw new UnauthorizedException('Invalid token - customer not found');
    }

    // Return data that will be attached to request.user
    return {
      sub: customer.customerId,
      customerId: customer.customerId,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      fullName: customer.fullName,
      customerType: customer.customerType,
      type: 'customer',
    };
  }
}
