"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Zap,
  Droplets,
  Flame,
  Users,
  Briefcase,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  const utilities = [
    {
      icon: <Droplets className="h-8 w-8" />,
      title: "Water Management",
      description: "Track water consumption and manage billing",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Electricity Management",
      description: "Monitor power consumption and meter readings",
    },
    {
      icon: <Flame className="h-8 w-8" />,
      title: "Gas Management",
      description: "Oversee gas distribution and service connections",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Header */}
      <header className="bg-gray-50 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg
                width="32"
                height="32"
                viewBox="0 0 95 74"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
              >
                <path
                  d="M0 0 C31.35 0 62.7 0 95 0 C95 24.42 95 48.84 95 74 C63.65 74 32.3 74 0 74 C0 49.58 0 25.16 0 0 Z"
                  fill="#EAEBEB"
                />
                <path
                  d="M0 0 C0.66 0 1.32 0 2 0 C1.01 9.57 0.02 19.14 -1 29 C-0.01 29.33 0.98 29.66 2 30 C2.12375 30.78375 2.2475 31.5675 2.375 32.375 C2.79117993 35.14057822 2.79117993 35.14057822 5 37 C5.20625 35.948125 5.4125 34.89625 5.625 33.8125 C6.85689805 29.35592764 9.31781963 27.64156418 13 25 C10.03 24.01 7.06 23.02 4 22 C4 20.02 4 18.04 4 16 C8.455 16.99 8.455 16.99 13 18 C13 17.34 13 16.68 13 16 C11.88625 16.12375 11.88625 16.12375 10.75 16.25 C8 16 8 16 5.625 14.3125 C4 12 4 12 4.25 9.25 C4.4975 8.5075 4.745 7.765 5 7 C7.97 7.33 10.94 7.66 14 8 C14.33 7.34 14.66 6.68 15 6 C17.97 6.495 17.97 6.495 21 7 C21 6.34 21 5.68 21 5 C24.79040004 5 28.25906015 5.44578669 32 6 C34.32357511 6.18490007 34.32357511 6.18490007 37 4 C43.40706366 2.91320025 48.67501977 4.39780749 54 8 C54.51433594 8.5465625 55.02867188 9.093125 55.55859375 9.65625 C56.03425781 10.0996875 56.50992188 10.543125 57 11 C59.65466049 10.76956136 59.65466049 10.76956136 62 10 C61.67 11.65 61.34 13.3 61 15 C56.25 14.25 56.25 14.25 54 12 C50.88742431 12 48.89234315 12.17361624 46 13 C46.33 11.35 46.66 9.7 47 8 C46.34 8 45.68 8 45 8 C45 9.32 45 10.64 45 12 C44.01 12 43.02 12 42 12 C41.87625 11.360625 41.7525 10.72125 41.625 10.0625 C41.41875 9.381875 41.2125 8.70125 41 8 C40.34 7.67 39.68 7.34 39 7 C39 7.66 39 8.32 39 9 C37.68 9 36.36 9 35 9 C35 9.99 35 10.98 35 12 C36.65 11.67 38.3 11.34 40 11 C39.34 12.32 38.68 13.64 38 15 C38.99 14.67 39.98 14.34 41 14 C41.495 14.495 41.495 14.495 42 15 C45.39570436 15.23690961 48.78416702 15.3964169 52.18554688 15.51757812 C57.78671875 15.78671875 57.78671875 15.78671875 60 18 C60.125 20.875 60.125 20.875 60 24 C60 26.16930249 60.00474846 28.33872314 60.03515625 30.5078125 C60.04417969 31.37148438 60.05320312 32.23515625 60.0625 33.125 C60.07410156 33.99382813 60.08570312 34.86265625 60.09765625 35.7578125 C60 38 60 38 59 40 C58.90444583 41.45579587 58.87015309 42.9160796 58.875 44.375 C58.87242188 45.14585938 58.86984375 45.91671875 58.8671875 46.7109375 C58.99610212 48.9328189 59.38616283 50.86618508 60 53 C59.34 53 58.68 53 58 53 C58.495 56.465 58.495 56.465 59 60 C51.41 60 43.82 60 36 60 C36.66 58.68 37.32 57.36 38 56 C39.32 56 40.64 56 42 56 C41.50585052 49.42160018 41.50585052 49.42160018 38 44 C38 43.34 38 42.68 38 42 C32.95191754 43.13146676 28.44941871 44.24559794 24 47 C22.59533047 49.05093145 22.59533047 49.05093145 22 51 C22.99 51 23.98 51 25 51 C24 54 24 54 22 55 C21.01 57.475 21.01 57.475 20 60 C16.04 60 12.08 60 8 60 C8.66 58.68 9.32 57.36 10 56 C12.625 55.25 12.625 55.25 15 55 C15 52.36 15 49.72 15 47 C11.43998368 46.89505422 11.43998368 46.89505422 8 47.6875 C6 48 6 48 3.25 46.875 C1 45 1 45 0.6875 42.3125 C0.790625 41.549375 0.89375 40.78625 1 40 C0.34 40 -0.32 40 -1 40 C-1.33 42.31 -1.66 44.62 -2 47 C-1.34 47 -0.68 47 0 47 C-1.75 51.875 -1.75 51.875 -4 53 C-4 52.34 -4 51.68 -4 51 C-4.66 51 -5.32 51 -6 51 C-6.33 49.68 -6.66 48.36 -7 47 C-6.34 47 -5.68 47 -5 47 C-5.11470137 45.24929483 -5.24219028 43.49942464 -5.375 41.75 C-5.44460937 40.77546875 -5.51421875 39.8009375 -5.5859375 38.796875 C-5.98883326 36.07542819 -6.73760338 34.4016326 -8 32 C-8 31.01 -8 30.02 -8 29 C-7.34 29 -6.68 29 -6 29 C-6.04640625 27.72125 -6.0928125 26.4425 -6.140625 25.125 C-6.17817027 23.41669021 -6.21456745 21.70835492 -6.25 20 C-6.28351562 19.16082031 -6.31703125 18.32164063 -6.3515625 17.45703125 C-6.44510534 11.4235183 -5.36615081 7.05387132 -2 2 C-1.34 1.34 -0.68 0.68 0 0 Z"
                  fill="#5B7D92"
                  transform="translate(26,9)"
                />
                <path
                  d="M0 0 C3.65608188 1.28183872 6.8842886 2.81438187 9.55859375 5.65625 C10.03425781 6.0996875 10.50992188 6.543125 11 7 C13.65466049 6.76956136 13.65466049 6.76956136 16 6 C15.67 7.65 15.34 9.3 15 11 C10.25 10.25 10.25 10.25 8 8 C4.88742431 8 2.89234315 8.17361624 0 9 C0.33 7.35 0.66 5.7 1 4 C0.34 4 -0.32 4 -1 4 C-1 5.32 -1 6.64 -1 8 C-1.99 8 -2.98 8 -4 8 C-4.12375 7.360625 -4.2475 6.72125 -4.375 6.0625 C-4.58125 5.381875 -4.7875 4.70125 -5 4 C-5.66 3.67 -6.32 3.34 -7 3 C-7 3.66 -7 4.32 -7 5 C-8.32 5 -9.64 5 -11 5 C-11 5.99 -11 6.98 -11 8 C-9.35 7.67 -7.7 7.34 -6 7 C-6.66 8.32 -7.32 9.64 -8 11 C-7.01 10.67 -6.02 10.34 -5 10 C-4.67 10.33 -4.34 10.66 -4 11 C-2.65252916 11.23075082 -1.29622435 11.41153063 0.0625 11.5625 C1.361875 11.706875 2.66125 11.85125 4 12 C4 12.33 4 12.66 4 13 C6.31 13.66 8.62 14.32 11 15 C11 16.32 11 17.64 11 19 C7.80542649 20.88414642 5.48497371 21.23819737 1.796875 21.1953125 C0.32734375 21.18564453 0.32734375 21.18564453 -1.171875 21.17578125 C-2.18765625 21.15902344 -3.2034375 21.14226563 -4.25 21.125 C-5.28125 21.11597656 -6.3125 21.10695313 -7.375 21.09765625 C-9.91690287 21.07412011 -12.4583328 21.04124023 -15 21 C-16.07957377 17.76127868 -16.13326784 15.33971795 -16.125 11.9375 C-16.12757812 10.87402344 -16.13015625 9.81054688 -16.1328125 8.71484375 C-16 6 -16 6 -15 4 C-15.66 3.67 -16.32 3.34 -17 3 C-14 2 -14 2 -12 2 C-7.93075869 -0.71282754 -4.77913508 -0.64082102 0 0 Z"
                  fill="#5F8095"
                  transform="translate(72,13)"
                />
                <path
                  d="M0 0 C0.33 0 0.66 0 1 0 C1 1.65 1 3.3 1 5 C1.80695312 4.83628906 2.61390625 4.67257813 3.4453125 4.50390625 C7.62768788 3.91102007 11.65944818 3.89105748 15.875 3.9375 C16.65875 3.94201172 17.4425 3.94652344 18.25 3.95117188 C20.16670014 3.96285907 22.08336048 3.98079092 24 4 C24.33 5.65 24.66 7.3 25 9 C21.80542649 10.88414642 19.48497371 11.23819737 15.796875 11.1953125 C14.8171875 11.18886719 13.8375 11.18242188 12.828125 11.17578125 C11.81234375 11.15902344 10.7965625 11.14226563 9.75 11.125 C8.71875 11.11597656 7.6875 11.10695313 6.625 11.09765625 C4.08309713 11.07412011 1.5416672 11.04124023 -1 11 C-2.41687119 6.74938644 -1.19320039 4.28148375 0 0 Z"
                  fill="#E1E4E5"
                  transform="translate(58,23)"
                />
                <path
                  d="M0 0 C0.66 0.33 1.32 0.66 2 1 C1.67 1.33 1.34 1.66 1 2 C1.66 2.66 2.32 3.32 3 4 C2.01 4 1.02 4 0 4 C0 4.99 0 5.98 0 7 C1.65 6.67 3.3 6.34 5 6 C4.34 7.32 3.68 8.64 3 10 C3.99 9.67 4.98 9.34 6 9 C6.33 9.33 6.66 9.66 7 10 C8.34747084 10.23075082 9.70377565 10.41153063 11.0625 10.5625 C12.361875 10.706875 13.66125 10.85125 15 11 C14.67 11.99 14.34 12.98 14 14 C8.06 14 2.12 14 -4 14 C-5.125 5.25 -5.125 5.25 -4 3 C-4.66 2.67 -5.32 2.34 -6 2 C-3 1 -3 1 -1 1 C-0.67 0.67 -0.34 0.34 0 0 Z"
                  fill="#618296"
                  transform="translate(61,14)"
                />
                <path
                  d="M0 0 C2.5 1.125 2.5 1.125 5 3 C5.3125 6.1875 5.3125 6.1875 5 9 C3.35 9.33 1.7 9.66 0 10 C0.875 5.25 0.875 5.25 2 3 C1.01 3 0.02 3 -1 3 C-0.67 2.01 -0.34 1.02 0 0 Z"
                  fill="#D8DDE0"
                  transform="translate(74,56)"
                />
                <path
                  d="M0 0 C0.66 0.33 1.32 0.66 2 1 C1.67 1.33 1.34 1.66 1 2 C1.66 2.66 2.32 3.32 3 4 C2.01 4 1.02 4 0 4 C-1.10251165 7.30753495 -2.05066101 10.64566891 -3 14 C-3.33 14 -3.66 14 -4 14 C-4.19491452 12.54263913 -4.38069358 11.08405407 -4.5625 9.625 C-4.66691406 8.81289063 -4.77132812 8.00078125 -4.87890625 7.1640625 C-5 5 -5 5 -4 3 C-4.66 2.67 -5.32 2.34 -6 2 C-3 1 -3 1 -1 1 C-0.67 0.67 -0.34 0.34 0 0 Z"
                  fill="#7D97A7"
                  transform="translate(61,14)"
                />
                <path
                  d="M0 0 C0.99 0.33 1.98 0.66 3 1 C3 2.32 3 3.64 3 5 C3.66 5.33 4.32 5.66 5 6 C4.34 6 3.68 6 3 6 C2.67 6.66 2.34 7.32 2 8 C1.01 8 0.02 8 -1 8 C-0.67 7.01 -0.34 6.02 0 5 C-1.32 5 -2.64 5 -4 5 C-4 4.01 -4 3.02 -4 2 C-2.68 2 -1.36 2 0 2 C0 1.34 0 0.68 0 0 Z"
                  fill="#C8D1D6"
                  transform="translate(65,16)"
                />
                <path
                  d="M0 0 C0.99 0 1.98 0 3 0 C3 0.66 3 1.32 3 2 C3.66 2 4.32 2 5 2 C3.25 6.875 3.25 6.875 1 8 C1 7.34 1 6.68 1 6 C0.34 6 -0.32 6 -1 6 C-1.33 4.68 -1.66 3.36 -2 2 C-1.34 2 -0.68 2 0 2 C0 1.34 0 0.68 0 0 Z"
                  fill="#628397"
                  transform="translate(21,54)"
                />
                <path
                  d="M0 0 C-0.33 1.65 -0.66 3.3 -1 5 C-2.65 4.67 -4.3 4.34 -6 4 C-6 3.01 -6 2.02 -6 1 C-3.92446352 0.4465236 -2.15634036 0 0 0 Z"
                  fill="#668699"
                  transform="translate(88,19)"
                />
                <path
                  d="M0 0 C0.66 0 1.32 0 2 0 C2.625 2.8125 2.625 2.8125 3 6 C2.01 7.485 2.01 7.485 1 9 C1 8.34 1 7.68 1 7 C0.34 7 -0.32 7 -1 7 C-0.67 4.69 -0.34 2.38 0 0 Z"
                  fill="#BCC7CE"
                  transform="translate(25,49)"
                />
                <path
                  d="M0 0 C2 1.375 2 1.375 4 3 C4 3.66 4 4.32 4 5 C1.36 5 -1.28 5 -4 5 C-3.525625 4.54625 -3.05125 4.0925 -2.5625 3.625 C-0.90972192 2.06741796 -0.90972192 2.06741796 0 0 Z"
                  fill="#C9D1D6"
                  transform="translate(79,20)"
                />
                <path
                  d="M0 0 C0.99 0.33 1.98 0.66 3 1 C3 2.32 3 3.64 3 5 C3.99 5 4.98 5 6 5 C6 3.68 6 2.36 6 1 C6.66 1 7.32 1 8 1 C7.67 2.65 7.34 4.3 7 6 C8.32 5.34 9.64 4.68 11 4 C11.99 4.66 12.98 5.32 14 6 C14.33 5.34 14.66 4.68 15 4 C16.5 5.375 16.5 5.375 18 7 C18 7.66 18 8.32 18 9 C15.58325776 9.02705308 13.1668206 9.04686438 10.75 9.0625 C9.72712891 9.07506836 9.72712891 9.07506836 8.68359375 9.08789062 C5.30657446 9.10428392 2.22708361 9.05628768 -1 8 C-0.67 7.01 -0.34 6.02 0 5 C-1.32 5 -2.64 5 -4 5 C-4 4.01 -4 3.02 -4 2 C-2.68 2 -1.36 2 0 2 C0 1.34 0 0.68 0 0 Z"
                  fill="#DFE2E4"
                  transform="translate(65,16)"
                />
              </svg>
              <h1 className="text-2xl font-bold text-primary-700">Govenly</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Title and Description */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome to Our Utility Management Portal
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Efficient management of water, electricity, and gas utilities.
              Choose your portal to get started.
            </p>
          </div>

          {/* Login Options Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Customer Portal */}
            <div className="bg-gray-50 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-primary-200">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-6">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Customer Portal
                </h3>
                <p className="text-gray-600 mb-6 flex-grow">
                  Access your account to view bills, make payments, track usage,
                  and manage your utility services online.
                </p>
                <button
                  onClick={() => router.push("/auth/customer-login")}
                  className="btn-primary w-full py-4 text-lg group"
                >
                  <span className="flex items-center justify-center">
                    Login as Customer
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <p className="text-sm text-gray-500 mt-4 text-center">
                  New customer?{" "}
                  <Link
                    href="/customer/register"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Register here
                  </Link>
                </p>
              </div>
            </div>

            {/* Employee Portal */}
            <div className="bg-gray-50 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-primary-200">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-xl mb-6">
                  <Briefcase className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Employee Portal
                </h3>
                <p className="text-gray-600 mb-6 flex-grow">
                  Staff login for managing customers, processing payments,
                  handling meter readings, and administrative tasks.
                </p>
                <button
                  onClick={() => router.push("/login")}
                  className="btn-primary w-full py-4 text-lg group"
                >
                  <span className="flex items-center justify-center">
                    Login as Employee
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Authorized personnel only
                </p>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-gray-50 rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Our Utility Services
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {utilities.map((utility, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary-50 rounded-xl mx-auto mb-4">
                    <div className="text-primary-600">{utility.icon}</div>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {utility.title}
                  </h4>
                  <p className="text-gray-600 text-sm">{utility.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm">Project by Students at NSBM Group 66</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
