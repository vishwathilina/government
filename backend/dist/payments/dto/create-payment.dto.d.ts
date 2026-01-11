import { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { PaymentMethod, PaymentChannel } from '../../database/entities/payment.entity';
export declare class TransactionRefRequiredForMethodConstraint implements ValidatorConstraintInterface {
    validate(_value: string | undefined, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare class IsNotFutureDateConstraint implements ValidatorConstraintInterface {
    validate(value: Date | undefined): boolean;
    defaultMessage(): string;
}
export declare class CreatePaymentDto {
    billId: number;
    paymentAmount: number;
    paymentMethod: PaymentMethod;
    paymentChannel?: PaymentChannel;
    transactionRef?: string;
    paymentDate?: Date;
    notes?: string;
}
