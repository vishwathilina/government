'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import {
    Eye,
    EyeOff,
    User,
    Mail,
    Lock,
    Phone,
    MapPin,
    Shield,
    FileText,
    CreditCard,
    Building,
    Loader2,
    CheckCircle,
    ArrowLeft,
} from 'lucide-react';

// Types
type CustomerType = 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'GOVERNMENT';
type IdentityType = 'NIC' | 'PASSPORT' | 'DRIVING_LICENSE' | 'BUSINESS_REG';

interface RegisterFormData {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    customerType: CustomerType;
    identityType: IdentityType;
    identityRef: string;
    phoneNumber: string;
    postalCode: string;
    addressLine1: string;
}

export default function CustomerRegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [step, setStep] = useState(1);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        trigger,
    } = useForm<RegisterFormData>({
        defaultValues: {
            customerType: 'RESIDENTIAL',
            identityType: 'NIC',
        },
    });

    const password = watch('password');
    const customerType = watch('customerType');

    // Step validation
    const validateStep = async (currentStep: number) => {
        let fieldsToValidate: (keyof RegisterFormData)[] = [];

        if (currentStep === 1) {
            fieldsToValidate = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
        } else if (currentStep === 2) {
            fieldsToValidate = ['customerType', 'identityType', 'identityRef', 'phoneNumber'];
        }

        const isValid = await trigger(fieldsToValidate);
        if (isValid) {
            setStep(currentStep + 1);
        }
    };

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        setError('');

        try {
            const payload = {
                firstName: data.firstName,
                middleName: data.middleName || undefined,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                customerType: data.customerType,
                identityType: data.identityType,
                identityRef: data.identityRef,
                address: {
                    postalCode: data.postalCode,
                    line1: data.addressLine1,
                },
                phoneNumbers: data.phoneNumber ? [data.phoneNumber] : [],
            };

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
            const response = await fetch(`${apiUrl}/auth/customer/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Registration failed');
            }

            setSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push('/auth/customer-login');
            }, 3000);
        } catch (err) {
            console.error('Registration error:', err);
            setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const customerTypeOptions = [
        { value: 'RESIDENTIAL', label: 'Residential', icon: <User className="w-5 h-5" /> },
        { value: 'COMMERCIAL', label: 'Commercial', icon: <Building className="w-5 h-5" /> },
        { value: 'INDUSTRIAL', label: 'Industrial', icon: <Building className="w-5 h-5" /> },
        { value: 'GOVERNMENT', label: 'Government', icon: <Shield className="w-5 h-5" /> },
    ];

    const identityTypeOptions = [
        { value: 'NIC', label: 'National ID Card' },
        { value: 'PASSPORT', label: 'Passport' },
        { value: 'DRIVING_LICENSE', label: 'Driving License' },
        { value: 'BUSINESS_REG', label: 'Business Registration' },
    ];

    // Success Screen
    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
                    <p className="text-gray-600 mb-6">
                        Your account has been created successfully. You can now login to access your utility services.
                    </p>
                    <div className="text-sm text-gray-500">
                        Redirecting to login page...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="grid md:grid-cols-5 gap-0">
                    {/* Left Panel - Branding */}
                    <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white">
                        <div className="h-full flex flex-col justify-between">
                            <div>
                                <Link
                                    href="/auth/customer-login"
                                    className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-8 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Login
                                </Link>

                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                        <Shield className="w-7 h-7 text-white" />
                                    </div>
                                    <h1 className="text-xl font-bold">Customer Portal</h1>
                                </div>

                                <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                                    Create Your Account
                                </h2>
                                <p className="text-blue-100 mb-8">
                                    Register to manage your utility services online.
                                </p>

                                {/* Progress Steps */}
                                <div className="space-y-4">
                                    {[
                                        { num: 1, title: 'Personal Info', desc: 'Name and credentials' },
                                        { num: 2, title: 'Identity', desc: 'Customer type and ID' },
                                        { num: 3, title: 'Address', desc: 'Location details' },
                                    ].map((s) => (
                                        <div
                                            key={s.num}
                                            className={`flex items-center gap-4 p-3 rounded-lg transition-all ${step >= s.num
                                                    ? 'bg-white/20'
                                                    : 'bg-white/5'
                                                }`}
                                        >
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${step > s.num
                                                        ? 'bg-green-500 text-white'
                                                        : step === s.num
                                                            ? 'bg-white text-blue-600'
                                                            : 'bg-white/20 text-white'
                                                    }`}
                                            >
                                                {step > s.num ? '✓' : s.num}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{s.title}</p>
                                                <p className="text-sm text-blue-100">{s.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/20">
                                <p className="text-sm text-blue-100">
                                    Already have an account?{' '}
                                    <Link href="/auth/customer-login" className="text-white font-semibold hover:underline">
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Form */}
                    <div className="md:col-span-3 p-8">
                        <div className="max-w-md mx-auto">
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                        {error}
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Step 1: Personal Information */}
                                {step === 1 && (
                                    <div className="space-y-5">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h3>

                                        {/* First Name */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                First Name *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <User className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    {...register('firstName', {
                                                        required: 'First name is required',
                                                        maxLength: { value: 80, message: 'Max 80 characters' },
                                                    })}
                                                    type="text"
                                                    placeholder="Enter first name"
                                                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                                                />
                                            </div>
                                            {errors.firstName && (
                                                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                                            )}
                                        </div>

                                        {/* Middle Name */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Middle Name
                                            </label>
                                            <input
                                                {...register('middleName', {
                                                    maxLength: { value: 80, message: 'Max 80 characters' },
                                                })}
                                                type="text"
                                                placeholder="Enter middle name (optional)"
                                                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200 hover:border-gray-300"
                                            />
                                        </div>

                                        {/* Last Name */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Last Name *
                                            </label>
                                            <input
                                                {...register('lastName', {
                                                    required: 'Last name is required',
                                                    maxLength: { value: 80, message: 'Max 80 characters' },
                                                })}
                                                type="text"
                                                placeholder="Enter last name"
                                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                                            />
                                            {errors.lastName && (
                                                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Mail className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    {...register('email', {
                                                        required: 'Email is required',
                                                        pattern: {
                                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                            message: 'Invalid email format',
                                                        },
                                                    })}
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                            )}
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Password *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Lock className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    {...register('password', {
                                                        required: 'Password is required',
                                                        minLength: { value: 6, message: 'Password must be at least 6 characters' },
                                                    })}
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Create a password"
                                                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                            {errors.password && (
                                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                                            )}
                                        </div>

                                        {/* Confirm Password */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Confirm Password *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Lock className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    {...register('confirmPassword', {
                                                        required: 'Please confirm your password',
                                                        validate: (value) =>
                                                            value === password || 'Passwords do not match',
                                                    })}
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    placeholder="Confirm your password"
                                                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                            {errors.confirmPassword && (
                                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => validateStep(1)}
                                            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Continue
                                        </button>
                                    </div>
                                )}

                                {/* Step 2: Identity & Customer Type */}
                                {step === 2 && (
                                    <div className="space-y-5">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">Identity Information</h3>

                                        {/* Customer Type */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Customer Type *
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {customerTypeOptions.map((option) => (
                                                    <label
                                                        key={option.value}
                                                        className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${customerType === option.value
                                                                ? 'border-blue-500 bg-blue-50'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <input
                                                            {...register('customerType', {
                                                                required: 'Customer type is required',
                                                            })}
                                                            type="radio"
                                                            value={option.value}
                                                            className="sr-only"
                                                        />
                                                        <div className={`${customerType === option.value ? 'text-blue-600' : 'text-gray-400'}`}>
                                                            {option.icon}
                                                        </div>
                                                        <span className={`text-sm font-medium ${customerType === option.value ? 'text-blue-600' : 'text-gray-700'}`}>
                                                            {option.label}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Identity Type */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Identity Document Type *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <CreditCard className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <select
                                                    {...register('identityType', {
                                                        required: 'Identity type is required',
                                                    })}
                                                    className="w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200 hover:border-gray-300 appearance-none bg-white"
                                                >
                                                    {identityTypeOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Identity Reference */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Identity Number *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <FileText className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    {...register('identityRef', {
                                                        required: 'Identity number is required',
                                                        maxLength: { value: 80, message: 'Max 80 characters' },
                                                    })}
                                                    type="text"
                                                    placeholder="Enter your identity number"
                                                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.identityRef ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                                                />
                                            </div>
                                            {errors.identityRef && (
                                                <p className="mt-1 text-sm text-red-600">{errors.identityRef.message}</p>
                                            )}
                                        </div>

                                        {/* Phone Number */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Phone Number *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Phone className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    {...register('phoneNumber', {
                                                        required: 'Phone number is required',
                                                        pattern: {
                                                            value: /^[+]?[\d\s-]{7,20}$/,
                                                            message: 'Invalid phone number format',
                                                        },
                                                    })}
                                                    type="tel"
                                                    placeholder="Enter your phone number"
                                                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phoneNumber ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                                                />
                                            </div>
                                            {errors.phoneNumber && (
                                                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                                            )}
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => validateStep(2)}
                                                className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Continue
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Address */}
                                {step === 3 && (
                                    <div className="space-y-5">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">Address Information</h3>

                                        {/* Postal Code */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Postal Code *
                                            </label>
                                            <input
                                                {...register('postalCode', {
                                                    required: 'Postal code is required',
                                                    maxLength: { value: 20, message: 'Max 20 characters' },
                                                })}
                                                type="text"
                                                placeholder="Enter postal code"
                                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.postalCode ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                                            />
                                            {errors.postalCode && (
                                                <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
                                            )}
                                        </div>

                                        {/* Address Line 1 */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Street Address *
                                            </label>
                                            <div className="relative">
                                                <div className="absolute top-3 left-4 pointer-events-none">
                                                    <MapPin className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <textarea
                                                    {...register('addressLine1', {
                                                        required: 'Address is required',
                                                        maxLength: { value: 200, message: 'Max 200 characters' },
                                                    })}
                                                    placeholder="Enter your full address"
                                                    rows={3}
                                                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.addressLine1 ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                                                />
                                            </div>
                                            {errors.addressLine1 && (
                                                <p className="mt-1 text-sm text-red-600">{errors.addressLine1.message}</p>
                                            )}
                                        </div>

                                        {/* Terms */}
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-600">
                                                By registering, you agree to our{' '}
                                                <a href="#" className="text-blue-600 hover:underline">
                                                    Terms of Service
                                                </a>{' '}
                                                and{' '}
                                                <a href="#" className="text-blue-600 hover:underline">
                                                    Privacy Policy
                                                </a>
                                                .
                                            </p>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setStep(2)}
                                                className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        Registering...
                                                    </>
                                                ) : (
                                                    'Complete Registration'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
