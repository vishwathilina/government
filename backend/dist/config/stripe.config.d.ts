declare const _default: (() => {
    secretKey: string | undefined;
    publishableKey: string | undefined;
    webhookSecret: string | undefined;
    currency: string;
    successUrl: string;
    cancelUrl: string;
    apiVersion: "2024-12-18.acacia";
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    secretKey: string | undefined;
    publishableKey: string | undefined;
    webhookSecret: string | undefined;
    currency: string;
    successUrl: string;
    cancelUrl: string;
    apiVersion: "2024-12-18.acacia";
}>;
export default _default;
export interface StripeConfig {
    secretKey: string;
    publishableKey: string;
    webhookSecret: string;
    currency: string;
    successUrl: string;
    cancelUrl: string;
    apiVersion: string;
}
