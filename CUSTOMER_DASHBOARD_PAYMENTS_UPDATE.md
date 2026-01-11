# Customer Dashboard and Payments Update

## Summary
Updated the customer dashboard to display data from the connection table and provided customers with payment functionality similar to the admin dashboard at `/dashboard/payments`.

## Changes Made

### 1. Frontend - Customer Dashboard (`/customer/dashboard`)

**File**: `frontend/src/app/customer/dashboard/page.tsx`

#### Updated Features:
- **Connection-Based Data Display**: Now fetches and displays connections from the customer-portal API
- **Enhanced Connection Cards**: Shows each connection with:
  - Utility type (Electricity, Water, etc.)
  - Meter serial number
  - Connection status
  - Number of unpaid bills per connection
  - Total outstanding amount per connection
  - Quick "Pay Now" button for each connection

- **Unpaid Bills Table**: Displays bills with:
  - Bill number
  - Utility type
  - Meter serial number
  - Due date
  - Amount
  - Status (UNPAID/OVERDUE)
  - Direct payment link

- **Summary Cards**: 
  - Total outstanding amount (aggregated from all connections)
  - Total unpaid bill count
  - Next due date

#### API Endpoints Used:
- `GET /api/v1/customer-portal/connections` - Fetch customer's connections
- `GET /api/v1/customer-portal/bills/unpaid` - Fetch unpaid bills
- `GET /api/v1/customer-portal/payments?limit=5` - Fetch recent payments

### 2. Frontend - Customer Payments Page (`/customer/payments`)

**File**: `frontend/src/app/customer/payments/page.tsx`

#### Complete Redesign:
- **Full Payment Management Interface** similar to admin dashboard
- **Statistics Dashboard**:
  - Total bills count
  - Unpaid bills count
  - Total amount
  - Unpaid amount

- **Advanced Filtering**:
  - Search by bill number or meter serial
  - Filter by connection
  - Filter by status (PAID, UNPAID, OVERDUE)
  - Clear filters button

- **Bills Table** with:
  - Bill ID
  - Meter serial number
  - Utility type
  - Billing period
  - Due date
  - Total amount
  - Balance amount
  - Status badges
  - Pay Now action button

- **Payment Modal**:
  - Shows meter serial number
  - Displays bill amount
  - Input for payment amount
  - Payment method selection (Cash, Card, Bank Transfer, Online)
  - Validation for payment amounts
  - Error handling

- **Pagination**: Navigate through multiple pages of bills

#### API Endpoints Used:
- `GET /api/v1/customer-portal/connections` - Fetch connections for filter dropdown
- `GET /api/v1/customer-portal/bills` - Fetch bills with filtering and pagination
- `POST /api/v1/customer-portal/payments` - Create a new payment

### 3. Backend - Customer Portal Controller

**File**: `backend/src/customers/customer-portal/customer-portal.controller.ts`

#### New Endpoint Added:
```typescript
POST /api/v1/customer-portal/payments
```

**Purpose**: Allows customers to create payments for their bills through self-service

**Request Body**:
```json
{
  "billId": 123,
  "paymentAmount": 1500.00,
  "paymentMethod": "CASH",
  "paymentDate": "2026-01-11T10:00:00.000Z"
}
```

**Response**:
```json
{
  "paymentId": 456,
  "billId": 123,
  "amount": 1500.00,
  "method": "CASH",
  "status": "COMPLETED",
  "transactionRef": "CUST-1736592000000-42",
  "paymentDate": "2026-01-11T10:00:00.000Z",
  "receiptNumber": "CUST-1736592000000-42",
  "message": "Payment recorded successfully"
}
```

### 4. Backend - Customer Portal Service

**File**: `backend/src/customers/customer-portal/customer-portal.service.ts`

#### New Method Added:
```typescript
async createPayment(customerId, createPaymentDto)
```

**Features**:
- Validates bill belongs to the customer
- Checks payment amount is valid and doesn't exceed outstanding balance
- Creates payment record with customer portal channel
- Generates unique transaction reference
- Returns payment confirmation with receipt number

**Security**:
- Verifies customer has access to the bill through their connections
- Prevents payment for bills belonging to other customers
- Validates payment amounts

## User Flow

### Customer Dashboard Flow:
1. Customer logs in and navigates to `/customer/dashboard`
2. Dashboard displays all their connections with outstanding amounts
3. Customer can see unpaid bills for all connections
4. Click "Pay Now" on a connection or bill redirects to payments page

### Payment Flow:
1. Customer navigates to `/customer/payments`
2. Views all bills across all their connections
3. Can filter by specific connection, status, or search
4. Clicks "Pay Now" on an unpaid bill
5. Payment modal opens with bill details
6. Enters payment amount and selects payment method
7. Submits payment
8. Payment is validated and recorded
9. Bill status updates automatically
10. Customer receives confirmation

## Security Features

1. **Authentication**: All endpoints protected by CustomerJwtAuthGuard
2. **Authorization**: Service validates customer owns the connection/bill before allowing operations
3. **Input Validation**: Payment amounts validated against outstanding balances
4. **Transaction References**: Unique transaction IDs generated for tracking

## Data Flow

```
Customer Login
    ↓
Customer Dashboard
    ├→ Fetch Connections (from customer-portal API)
    ├→ Fetch Unpaid Bills (filtered by customer's meters)
    └→ Calculate Summary (total outstanding, bill count)
    
Payments Page
    ├→ Fetch Connections (for filter dropdown)
    ├→ Fetch Bills (with filters & pagination)
    ├→ Display Stats & Table
    └→ Process Payment
         ├→ Validate customer access
         ├→ Validate payment amount
         ├→ Create payment record
         └→ Return confirmation
```

## API Endpoints Summary

### Customer Portal Endpoints (All require customer authentication):

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customer-portal/dashboard` | Get dashboard summary |
| GET | `/customer-portal/connections` | Get customer's connections |
| GET | `/customer-portal/bills/unpaid` | Get unpaid bills |
| GET | `/customer-portal/bills` | Get bill history (paginated) |
| GET | `/customer-portal/bills/:id` | Get specific bill details |
| GET | `/customer-portal/payments` | Get payment history (paginated) |
| POST | `/customer-portal/payments` | Create a new payment |
| GET | `/customer-portal/payments/:id/receipt` | Get payment receipt |

## Testing Checklist

- [ ] Customer can view all their connections on dashboard
- [ ] Each connection shows correct unpaid bill count
- [ ] Outstanding amounts are calculated correctly
- [ ] Bills table shows all bills for customer's connections
- [ ] Connection filter works properly
- [ ] Status filter works properly
- [ ] Search functionality works
- [ ] Payment modal opens with correct bill data
- [ ] Payment validation prevents overpayment
- [ ] Payment validation prevents negative amounts
- [ ] Payment is recorded successfully
- [ ] Bill status updates after payment
- [ ] Transaction reference is generated
- [ ] Customer cannot pay bills for other customers
- [ ] Pagination works correctly

## Benefits

1. **Connection-Centric View**: Customers can see all their utility connections at a glance
2. **Self-Service Payments**: Customers can pay bills without staff intervention
3. **Better Organization**: Bills are organized by connection type
4. **Transparency**: Clear visibility of outstanding amounts per connection
5. **Convenience**: Easy filtering and searching for specific bills
6. **Security**: Customers can only access and pay their own bills
7. **Consistency**: Payment interface mirrors admin dashboard for familiar experience

## Future Enhancements

1. Payment history view with receipts
2. Download bill PDFs
3. Set up auto-payment
4. Email notifications for payments
5. Payment method management (saved cards)
6. Partial payment scheduling
7. Connection consumption graphs
8. Bill comparison (month-over-month)
