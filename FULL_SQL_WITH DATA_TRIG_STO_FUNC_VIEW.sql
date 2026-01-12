

/* ============================================================
   Government Utility Management System - SQL Server DDL
   Generated from Data Dictionary (Final)
   Target: Microsoft SQL Server
   ============================================================ */

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

/* =========================
   1) Core Reference
   ========================= */

CREATE TABLE dbo.UtilityType (
    utility_type_id      BIGINT IDENTITY(1,1) NOT NULL,
    code                 VARCHAR(30) NOT NULL,
    name                 VARCHAR(80) NOT NULL,
    CONSTRAINT PK_UtilityType PRIMARY KEY (utility_type_id),
    CONSTRAINT UQ_UtilityType_code UNIQUE (code)
);
GO

CREATE TABLE dbo.GeoArea (
    geo_area_id          BIGINT IDENTITY(1,1) NOT NULL,
    name                 VARCHAR(120) NOT NULL,
    type                 VARCHAR(30) NOT NULL,
    parent_geo_area_id   BIGINT NULL,
    CONSTRAINT PK_GeoArea PRIMARY KEY (geo_area_id),
    CONSTRAINT FK_GeoArea_parent FOREIGN KEY (parent_geo_area_id)
        REFERENCES dbo.GeoArea(geo_area_id)
);
GO

CREATE TABLE dbo.PostalCodes (
    postal_code          VARCHAR(20) NOT NULL,
    city                 VARCHAR(120) NOT NULL,
    province             VARCHAR(120) NOT NULL,
    CONSTRAINT PK_PostalCodes PRIMARY KEY (postal_code)
);
GO

/* =========================
   2) HR & Payroll
   ========================= */

CREATE TABLE dbo.Department (
    department_id        BIGINT IDENTITY(1,1) NOT NULL,
    name                 VARCHAR(120) NOT NULL,
    utility_type_id      BIGINT NOT NULL,
    CONSTRAINT PK_Department PRIMARY KEY (department_id),
    CONSTRAINT UQ_Department_name UNIQUE (name),
    CONSTRAINT FK_Department_UtilityType FOREIGN KEY (utility_type_id)
        REFERENCES dbo.UtilityType(utility_type_id)
);
GO

CREATE TABLE dbo.Employee (
    employee_id          BIGINT IDENTITY(1,1) NOT NULL,
    first_name           VARCHAR(80) NOT NULL,
    middle_name          VARCHAR(80) NULL,
    last_name            VARCHAR(80) NOT NULL,
    employee_no          VARCHAR(30) NOT NULL,
    designation          VARCHAR(80) NOT NULL,
    role                 VARCHAR(80) NOT NULL,
    department_id        BIGINT NOT NULL,
    email                VARCHAR(255) NOT NULL,
    username             VARCHAR(80) NOT NULL,
    password_hash        VARCHAR(255) NOT NULL,
    last_login_at        DATETIME2(0) NULL,
    CONSTRAINT PK_Employee PRIMARY KEY (employee_id),
    CONSTRAINT UQ_Employee_employee_no UNIQUE (employee_no),
    CONSTRAINT UQ_Employee_email UNIQUE (email),
    CONSTRAINT UQ_Employee_username UNIQUE (username),
    CONSTRAINT FK_Employee_Department FOREIGN KEY (department_id)
        REFERENCES dbo.Department(department_id)
);
GO

CREATE TABLE dbo.EmployeePhoneNumber (
    employee_id          BIGINT NOT NULL,
    phone                VARCHAR(30) NOT NULL,
    CONSTRAINT PK_EmployeePhoneNumber PRIMARY KEY (employee_id, phone),
    CONSTRAINT FK_EmployeePhoneNumber_Employee FOREIGN KEY (employee_id)
        REFERENCES dbo.Employee(employee_id)
);
GO

CREATE TABLE dbo.PayrollRun (
    payroll_run_id           BIGINT IDENTITY(1,1) NOT NULL,
    period_month             SMALLINT NOT NULL,
    period_year              SMALLINT NOT NULL,
    run_date                 DATE NOT NULL,
    status                   VARCHAR(20) NOT NULL,
    created_by_employee_id   BIGINT NOT NULL,
    CONSTRAINT PK_PayrollRun PRIMARY KEY (payroll_run_id),
    CONSTRAINT CK_PayrollRun_month CHECK (period_month BETWEEN 1 AND 12),
    CONSTRAINT CK_PayrollRun_year CHECK (period_year >= 2000),
    CONSTRAINT CK_PayrollRun_status CHECK (status IN ('DRAFT','PROCESSING','COMPLETED','CANCELLED')),
    CONSTRAINT FK_PayrollRun_CreatedBy FOREIGN KEY (created_by_employee_id)
        REFERENCES dbo.Employee(employee_id)
);
GO

CREATE TABLE dbo.Payslip (
    payslip_id           BIGINT IDENTITY(1,1) NOT NULL,
    deductions           DECIMAL(12,2) NOT NULL,
    gross                DECIMAL(12,2) NOT NULL,
    employee_id          BIGINT NOT NULL,
    payroll_run_id       BIGINT NOT NULL,
    CONSTRAINT PK_Payslip PRIMARY KEY (payslip_id),
    CONSTRAINT CK_Payslip_gross CHECK (gross >= 0),
    CONSTRAINT CK_Payslip_deductions CHECK (deductions >= 0),
    CONSTRAINT FK_Payslip_Employee FOREIGN KEY (employee_id)
        REFERENCES dbo.Employee(employee_id),
    CONSTRAINT FK_Payslip_PayrollRun FOREIGN KEY (payroll_run_id)
        REFERENCES dbo.PayrollRun(payroll_run_id)
);
GO

CREATE TABLE dbo.SalaryComponentType (
    component_type_id    BIGINT IDENTITY(1,1) NOT NULL,
    name                 VARCHAR(80) NOT NULL,
    type                 VARCHAR(20) NOT NULL,
    CONSTRAINT PK_SalaryComponentType PRIMARY KEY (component_type_id),
    CONSTRAINT UQ_SalaryComponentType_name UNIQUE (name),
    CONSTRAINT CK_SalaryComponentType_type CHECK (type IN ('EARNING','DEDUCTION'))
);
GO

CREATE TABLE dbo.PayslipComponent (
    payslip_component_id  BIGINT IDENTITY(1,1) NOT NULL,
    name                  VARCHAR(120) NOT NULL,
    amount                DECIMAL(12,2) NOT NULL,
    payslip_id            BIGINT NOT NULL,
    component_type_id     BIGINT NOT NULL,
    CONSTRAINT PK_PayslipComponent PRIMARY KEY (payslip_component_id),
    CONSTRAINT FK_PayslipComponent_Payslip FOREIGN KEY (payslip_id)
        REFERENCES dbo.Payslip(payslip_id),
    CONSTRAINT FK_PayslipComponent_ComponentType FOREIGN KEY (component_type_id)
        REFERENCES dbo.SalaryComponentType(component_type_id)
);
GO

CREATE TABLE dbo.ReportRequest (
    report_request_id     BIGINT IDENTITY(1,1) NOT NULL,
    requested_at          DATETIME2(0) NOT NULL,
    report_type           VARCHAR(80) NOT NULL,
    params                NVARCHAR(MAX) NOT NULL,  -- JSON text
    employee_id           BIGINT NOT NULL,
    CONSTRAINT PK_ReportRequest PRIMARY KEY (report_request_id),
    CONSTRAINT FK_ReportRequest_Employee FOREIGN KEY (employee_id)
        REFERENCES dbo.Employee(employee_id)
);
GO

CREATE TABLE dbo.Manager (
    employee_id          BIGINT NOT NULL,
    management_level     VARCHAR(30) NOT NULL,
    report_access_level  VARCHAR(30) NOT NULL,
    CONSTRAINT PK_Manager PRIMARY KEY (employee_id),
    CONSTRAINT FK_Manager_Employee FOREIGN KEY (employee_id)
        REFERENCES dbo.Employee(employee_id)
);
GO

CREATE TABLE dbo.FieldOfficer (
    employee_id          BIGINT NOT NULL,
    service_area_type    VARCHAR(30) NOT NULL,
    shift_type           VARCHAR(30) NOT NULL,
    certification_level  VARCHAR(50) NULL,
    geo_area_id          BIGINT NOT NULL,
    CONSTRAINT PK_FieldOfficer PRIMARY KEY (employee_id),
    CONSTRAINT FK_FieldOfficer_Employee FOREIGN KEY (employee_id)
        REFERENCES dbo.Employee(employee_id),
    CONSTRAINT FK_FieldOfficer_GeoArea FOREIGN KEY (geo_area_id)
        REFERENCES dbo.GeoArea(geo_area_id)
);
GO

CREATE TABLE dbo.MeterReader (
    employee_id          BIGINT NOT NULL,
    device_id            VARCHAR(80) NULL,
    assigned_route_code  VARCHAR(50) NULL,
    CONSTRAINT PK_MeterReader PRIMARY KEY (employee_id),
    CONSTRAINT FK_MeterReader_Employee FOREIGN KEY (employee_id)
        REFERENCES dbo.Employee(employee_id)
);
GO

CREATE TABLE dbo.Cashier (
    employee_id            BIGINT NOT NULL,
    can_override_charges   BIT NOT NULL CONSTRAINT DF_Cashier_override DEFAULT (0),
    can_approve_refunds    BIT NOT NULL CONSTRAINT DF_Cashier_refunds DEFAULT (0),
    CONSTRAINT PK_Cashier PRIMARY KEY (employee_id),
    CONSTRAINT FK_Cashier_Employee FOREIGN KEY (employee_id)
        REFERENCES dbo.Employee(employee_id)
);
GO

CREATE TABLE dbo.AdministrativeStaff (
    employee_id              BIGINT NOT NULL,
    department               VARCHAR(120) NOT NULL,
    can_register_connections BIT NOT NULL CONSTRAINT DF_Admin_register DEFAULT (0),
    can_manage_tariffs       BIT NOT NULL CONSTRAINT DF_Admin_tariffs DEFAULT (0),
    CONSTRAINT PK_AdministrativeStaff PRIMARY KEY (employee_id),
    CONSTRAINT FK_AdministrativeStaff_Employee FOREIGN KEY (employee_id)
        REFERENCES dbo.Employee(employee_id)
);
GO

/* =========================
   3) Customers & Connections
   ========================= */

CREATE TABLE dbo.CustomerAddress (
    customer_address_id   BIGINT IDENTITY(1,1) NOT NULL,
    postal_code           VARCHAR(20) NOT NULL,
    line1                 VARCHAR(200) NOT NULL,
    CONSTRAINT PK_CustomerAddress PRIMARY KEY (customer_address_id),
    CONSTRAINT FK_CustomerAddress_PostalCodes FOREIGN KEY (postal_code)
        REFERENCES dbo.PostalCodes(postal_code)
);
GO

CREATE TABLE dbo.Customer (
    customer_id          BIGINT IDENTITY(1,1) NOT NULL,
    first_name           VARCHAR(80) NOT NULL,
    middle_name          VARCHAR(80) NULL,
    last_name            VARCHAR(80) NOT NULL,
    password_hash        VARCHAR(255) NOT NULL,
    email                VARCHAR(255) NULL,
    customer_address_id  BIGINT NOT NULL,
    customer_type        VARCHAR(30) NOT NULL,
    status               VARCHAR(20) NOT NULL CONSTRAINT DF_Customer_status DEFAULT 'ACTIVE',
    registration_date    DATE NOT NULL,
    identity_type        VARCHAR(30) NOT NULL,
    identity_ref         VARCHAR(80) NOT NULL,
    employee_id          BIGINT NULL,   -- registered by staff
    tariff_category_id   BIGINT NULL,   -- default tariff (created later)
    CONSTRAINT PK_Customer PRIMARY KEY (customer_id),
    CONSTRAINT UQ_Customer_identity_ref UNIQUE (identity_ref),
    CONSTRAINT FK_Customer_Address FOREIGN KEY (customer_address_id)
        REFERENCES dbo.CustomerAddress(customer_address_id),
    CONSTRAINT FK_Customer_Employee FOREIGN KEY (employee_id)
        REFERENCES dbo.Employee(employee_id),
    CONSTRAINT CK_Customer_status CHECK (status IN ('ACTIVE','INACTIVE','SUSPENDED','BLOCKED'))
    -- FK to TariffCategory added after TariffCategory table creation
);
GO

CREATE TABLE dbo.CustomerPhoneNumbers (
    customer_id          BIGINT NOT NULL,
    phone                VARCHAR(30) NOT NULL,
    CONSTRAINT PK_CustomerPhoneNumbers PRIMARY KEY (customer_id, phone),
    CONSTRAINT FK_CustomerPhoneNumbers_Customer FOREIGN KEY (customer_id)
        REFERENCES dbo.Customer(customer_id)
);
GO

CREATE TABLE dbo.ConnectionAddress (
    connection_address_id BIGINT IDENTITY(1,1) NOT NULL,
    line1                 VARCHAR(200) NOT NULL,
    city                  VARCHAR(120) NOT NULL,
    postal_code           VARCHAR(20) NOT NULL,
    geo_area_id           BIGINT NOT NULL,
    CONSTRAINT PK_ConnectionAddress PRIMARY KEY (connection_address_id),
    CONSTRAINT FK_ConnectionAddress_GeoArea FOREIGN KEY (geo_area_id)
        REFERENCES dbo.GeoArea(geo_area_id)
);
GO

CREATE TABLE dbo.Meter (
    meter_id            BIGINT IDENTITY(1,1) NOT NULL,
    meter_serial_no     VARCHAR(80) NOT NULL,
    utility_type_id     BIGINT NOT NULL,
    installation_date   DATE NOT NULL,
    is_smart_meter      BIT NOT NULL CONSTRAINT DF_Meter_smart DEFAULT (0),
    status              VARCHAR(30) NOT NULL,
    CONSTRAINT PK_Meter PRIMARY KEY (meter_id),
    CONSTRAINT UQ_Meter_serial UNIQUE (meter_serial_no),
    CONSTRAINT FK_Meter_UtilityType FOREIGN KEY (utility_type_id)
        REFERENCES dbo.UtilityType(utility_type_id)
);
GO

/* Tariffs first (because Connection references TariffCategory) */
CREATE TABLE dbo.TariffCategory (
    tariff_category_id  BIGINT IDENTITY(1,1) NOT NULL,
    utility_type_id     BIGINT NOT NULL,
    code                VARCHAR(40) NOT NULL,
    name                VARCHAR(120) NOT NULL,
    description         NVARCHAR(MAX) NULL,
    is_subsidized       BIT NOT NULL CONSTRAINT DF_TariffCategory_sub DEFAULT (0),
    employee_id         BIGINT NULL,
    CONSTRAINT PK_TariffCategory PRIMARY KEY (tariff_category_id),
    CONSTRAINT UQ_TariffCategory_code UNIQUE (code),
    CONSTRAINT FK_TariffCategory_UtilityType FOREIGN KEY (utility_type_id)
        REFERENCES dbo.UtilityType(utility_type_id),
    CONSTRAINT FK_TariffCategory_Employee FOREIGN KEY (employee_id)
        REFERENCES dbo.Employee(employee_id)
);
GO

ALTER TABLE dbo.Customer
ADD CONSTRAINT FK_Customer_TariffCategory FOREIGN KEY (tariff_category_id)
    REFERENCES dbo.TariffCategory(tariff_category_id);
GO

CREATE TABLE dbo.TariffSlab (
    slab_id             BIGINT IDENTITY(1,1) NOT NULL,
    from_unit           DECIMAL(14,3) NOT NULL,
    to_unit             DECIMAL(14,3) NULL,
    rate_per_unit       DECIMAL(12,4) NOT NULL,
    fixed_charge        DECIMAL(12,2) NOT NULL,
    valid_from          DATE NOT NULL,
    valid_to            DATE NULL,
    unit_price          DECIMAL(12,4) NULL,
    tariff_category_id  BIGINT NOT NULL,
    CONSTRAINT PK_TariffSlab PRIMARY KEY (slab_id),
    CONSTRAINT FK_TariffSlab_TariffCategory FOREIGN KEY (tariff_category_id)
        REFERENCES dbo.TariffCategory(tariff_category_id)
);
GO

/* Network */
CREATE TABLE dbo.NetworkNode (
    node_id            BIGINT IDENTITY(1,1) NOT NULL,
    name               VARCHAR(120) NOT NULL,
    status             VARCHAR(30) NOT NULL,
    node_type          VARCHAR(50) NOT NULL,
    utility_type_id    BIGINT NOT NULL,
    CONSTRAINT PK_NetworkNode PRIMARY KEY (node_id),
    CONSTRAINT FK_NetworkNode_UtilityType FOREIGN KEY (utility_type_id)
        REFERENCES dbo.UtilityType(utility_type_id)
);
GO

CREATE TABLE dbo.NetworkLink (
    link_id            BIGINT IDENTITY(1,1) NOT NULL,
    link_type          VARCHAR(50) NOT NULL,
    status             VARCHAR(30) NOT NULL,
    length_km          DECIMAL(10,3) NULL,
    diameter_mm        DECIMAL(10,2) NULL,
    to_node_id         BIGINT NOT NULL,
    from_node_id       BIGINT NOT NULL,
    max_capacity       DECIMAL(14,3) NULL,
    capacity_uom       VARCHAR(20) NULL,
    utility_type_id    BIGINT NOT NULL,
    CONSTRAINT PK_NetworkLink PRIMARY KEY (link_id),
    CONSTRAINT FK_NetworkLink_ToNode FOREIGN KEY (to_node_id)
        REFERENCES dbo.NetworkNode(node_id),
    CONSTRAINT FK_NetworkLink_FromNode FOREIGN KEY (from_node_id)
        REFERENCES dbo.NetworkNode(node_id),
    CONSTRAINT FK_NetworkLink_UtilityType FOREIGN KEY (utility_type_id)
        REFERENCES dbo.UtilityType(utility_type_id)
);
GO

CREATE TABLE dbo.AreaNode (
    node_id            BIGINT NOT NULL,
    geo_area_id        BIGINT NOT NULL,
    CONSTRAINT PK_AreaNode PRIMARY KEY (node_id, geo_area_id),
    CONSTRAINT FK_AreaNode_Node FOREIGN KEY (node_id)
        REFERENCES dbo.NetworkNode(node_id),
    CONSTRAINT FK_AreaNode_GeoArea FOREIGN KEY (geo_area_id)
        REFERENCES dbo.GeoArea(geo_area_id)
);
GO

/* Connection */
CREATE TABLE dbo.ServiceConnection (
    connection_id          BIGINT IDENTITY(1,1) NOT NULL,
    customer_id            BIGINT NOT NULL,
    utility_type_id        BIGINT NOT NULL,
    tariff_category_id     BIGINT NOT NULL,
    connection_status      VARCHAR(30) NOT NULL,
    connection_date        DATE NOT NULL CONSTRAINT DF_ServiceConnection_date DEFAULT GETDATE(),
    meter_id               BIGINT NULL,
    connection_address_id  BIGINT NOT NULL,
    node_id                BIGINT NULL,
    CONSTRAINT PK_ServiceConnection PRIMARY KEY (connection_id),
    CONSTRAINT FK_ServiceConnection_Customer FOREIGN KEY (customer_id)
        REFERENCES dbo.Customer(customer_id),
    CONSTRAINT FK_ServiceConnection_UtilityType FOREIGN KEY (utility_type_id)
        REFERENCES dbo.UtilityType(utility_type_id),
    CONSTRAINT FK_ServiceConnection_TariffCategory FOREIGN KEY (tariff_category_id)
        REFERENCES dbo.TariffCategory(tariff_category_id),
    CONSTRAINT FK_ServiceConnection_Meter FOREIGN KEY (meter_id)
        REFERENCES dbo.Meter(meter_id),
    CONSTRAINT FK_ServiceConnection_Address FOREIGN KEY (connection_address_id)
        REFERENCES dbo.ConnectionAddress(connection_address_id),
    CONSTRAINT FK_ServiceConnection_Node FOREIGN KEY (node_id)
        REFERENCES dbo.NetworkNode(node_id)
);
GO


/* Meter readings */
CREATE TABLE dbo.MeterReading (
    reading_id         BIGINT IDENTITY(1,1) NOT NULL,
    reading_source     VARCHAR(30) NOT NULL,
    reading_date       DATETIME2(0) NOT NULL,
    reading_status     VARCHAR(20) NOT NULL CONSTRAINT DF_MeterReading_status DEFAULT 'PENDING',
    import_reading     DECIMAL(14,3) NULL,
    prev_import_reading DECIMAL(14,3) NULL,
    export_reading     DECIMAL(14,3) NULL,
    prev_export_reading DECIMAL(14,3) NULL,
    consumption        AS (ISNULL(import_reading, 0) - ISNULL(prev_import_reading, 0)) PERSISTED,
    created_at         DATETIME2(0) NOT NULL,
    device_id          VARCHAR(80) NULL,
    meter_id           BIGINT NOT NULL,
    meter_reader_id    BIGINT NULL,
    CONSTRAINT PK_MeterReading PRIMARY KEY (reading_id),
    CONSTRAINT FK_MeterReading_Meter FOREIGN KEY (meter_id)
        REFERENCES dbo.Meter(meter_id),
    CONSTRAINT FK_MeterReading_MeterReader FOREIGN KEY (meter_reader_id)
        REFERENCES dbo.MeterReader(employee_id),
    CONSTRAINT CK_MeterReading_status CHECK (reading_status IN ('PENDING','VERIFIED','REJECTED','ESTIMATED'))
);
GO

/* =========================
   4) Billing & Payments
   ========================= */

CREATE TABLE dbo.Bill (
    bill_id               BIGINT IDENTITY(1,1) NOT NULL,
    meter_id              BIGINT NOT NULL,
    billing_period_start  DATE NOT NULL,
    billing_period_end    DATE NOT NULL,
    bill_date             DATE NOT NULL,
    due_date              DATE NOT NULL,
    total_import_unit     DECIMAL(14,3) NOT NULL,
    total_export_unit     DECIMAL(14,3) NOT NULL CONSTRAINT DF_Bill_export DEFAULT (0),
    energy_charge_amount  DECIMAL(12,2) NOT NULL,
    fixed_charge_amount   DECIMAL(12,2) NOT NULL,
    subsidy_amount        DECIMAL(12,2) NOT NULL CONSTRAINT DF_Bill_subsidy DEFAULT (0),
    solar_export_credit   DECIMAL(12,2) NOT NULL CONSTRAINT DF_Bill_export_credit DEFAULT (0),
    total_amount          AS (energy_charge_amount + fixed_charge_amount - subsidy_amount - solar_export_credit) PERSISTED,
    CONSTRAINT PK_Bill PRIMARY KEY (bill_id),
    CONSTRAINT FK_Bill_Meter FOREIGN KEY (meter_id)
        REFERENCES dbo.Meter(meter_id)
);
GO

CREATE TABLE dbo.BillDetail (
    bill_detail_id     BIGINT IDENTITY(1,1) NOT NULL,
    slab_id            BIGINT NULL,
    units_in_slab      DECIMAL(14,3) NOT NULL,
    amount             DECIMAL(12,2) NOT NULL,
    bill_id            BIGINT NOT NULL,
    CONSTRAINT PK_BillDetail PRIMARY KEY (bill_detail_id),
    CONSTRAINT FK_BillDetail_Bill FOREIGN KEY (bill_id)
        REFERENCES dbo.Bill(bill_id),
    CONSTRAINT FK_BillDetail_TariffSlab FOREIGN KEY (slab_id)
        REFERENCES dbo.TariffSlab(slab_id)
);
GO

CREATE TABLE dbo.TaxConfig (
    tax_id            BIGINT IDENTITY(1,1) NOT NULL,
    tax_name          VARCHAR(120) NOT NULL,
    rate_percent      DECIMAL(6,3) NOT NULL,
    effective_from    DATE NOT NULL,
    effective_to      DATE NULL,
    status            VARCHAR(20) NOT NULL,
    CONSTRAINT PK_TaxConfig PRIMARY KEY (tax_id)
);
GO

CREATE TABLE dbo.BillTax (
    bill_tax_id            BIGINT IDENTITY(1,1) NOT NULL,
    rate_percent_applied   DECIMAL(6,3) NOT NULL,
    taxable_base_amount    DECIMAL(12,2) NOT NULL,
    bill_id                BIGINT NOT NULL,
    tax_id                 BIGINT NOT NULL,
    CONSTRAINT PK_BillTax PRIMARY KEY (bill_tax_id),
    CONSTRAINT FK_BillTax_Bill FOREIGN KEY (bill_id)
        REFERENCES dbo.Bill(bill_id),
    CONSTRAINT FK_BillTax_TaxConfig FOREIGN KEY (tax_id)
        REFERENCES dbo.TaxConfig(tax_id)
);
GO

CREATE TABLE dbo.BillAdjustment (
    adjustment_id        BIGINT IDENTITY(1,1) NOT NULL,
    bill_id              BIGINT NOT NULL,
    adjustment_type      VARCHAR(20) NOT NULL,
    adjustment_amount    DECIMAL(12,2) NOT NULL,
    adjustment_reason    NVARCHAR(500) NULL,
    adjustment_date      DATE NOT NULL,
    employee_id          BIGINT NULL,
    CONSTRAINT PK_BillAdjustment PRIMARY KEY (adjustment_id),
    CONSTRAINT FK_BillAdjustment_Bill FOREIGN KEY (bill_id)
        REFERENCES dbo.Bill(bill_id),
    CONSTRAINT FK_BillAdjustment_Employee FOREIGN KEY (employee_id)
        REFERENCES dbo.Employee(employee_id),
    CONSTRAINT CK_BillAdjustment_type CHECK (adjustment_type IN ('CREDIT','DEBIT'))
);
GO

CREATE TABLE dbo.Tariff (
    tariff_id            BIGINT IDENTITY(1,1) NOT NULL,
    utility_type_id      BIGINT NOT NULL,
    rate_per_unit        DECIMAL(12,4) NOT NULL,
    fixed_charge         DECIMAL(12,2) NOT NULL,
    effective_date       DATE NOT NULL,
    end_date             DATE NULL,
    CONSTRAINT PK_Tariff PRIMARY KEY (tariff_id),
    CONSTRAINT FK_Tariff_UtilityType FOREIGN KEY (utility_type_id)
        REFERENCES dbo.UtilityType(utility_type_id)
);
GO

CREATE TABLE dbo.Payment (
    payment_id        BIGINT IDENTITY(1,1) NOT NULL,
    payment_date      DATETIME2(0) NOT NULL,
    payment_amount    DECIMAL(12,2) NOT NULL,
    payment_method    VARCHAR(30) NOT NULL,
    payment_channel   VARCHAR(30) NULL,
    payment_status    VARCHAR(20) NOT NULL CONSTRAINT DF_Payment_status DEFAULT 'COMPLETED',
    transaction_ref   VARCHAR(120) NULL,
    bill_id           BIGINT NOT NULL,
    connection_id     BIGINT NOT NULL,
    employee_id       BIGINT NULL,
    customer_id       BIGINT NULL, -- keep if you want snapshot
    CONSTRAINT PK_Payment PRIMARY KEY (payment_id),
    CONSTRAINT FK_Payment_Bill FOREIGN KEY (bill_id)
        REFERENCES dbo.Bill(bill_id),
    CONSTRAINT FK_Payment_ServiceConnection FOREIGN KEY (connection_id)
        REFERENCES dbo.ServiceConnection(connection_id),
    CONSTRAINT FK_Payment_Employee FOREIGN KEY (employee_id)
        REFERENCES dbo.Employee(employee_id),
    CONSTRAINT FK_Payment_Customer FOREIGN KEY (customer_id)
        REFERENCES dbo.Customer(customer_id),
    CONSTRAINT CK_Payment_status CHECK (payment_status IN ('PENDING','COMPLETED','FAILED','REFUNDED','CANCELLED'))
);
GO

/* =========================
   5) Subsidies & Solar
   ========================= */

CREATE TABLE dbo.SubsidyScheme (
    subsidy_id        BIGINT IDENTITY(1,1) NOT NULL,
    name              VARCHAR(120) NOT NULL,
    description       NVARCHAR(MAX) NULL,
    discount_type     VARCHAR(30) NOT NULL,
    discount_value    DECIMAL(12,4) NOT NULL,
    valid_from        DATE NOT NULL,
    valid_to          DATE NULL,
    CONSTRAINT PK_SubsidyScheme PRIMARY KEY (subsidy_id)
);
GO

CREATE TABLE dbo.CustomerSubsidy (
    customer_subsidy_id BIGINT IDENTITY(1,1) NOT NULL,
    approved_date       DATE NOT NULL,
    status              VARCHAR(20) NOT NULL,
    subsidy_id          BIGINT NOT NULL,
    employee_id         BIGINT NOT NULL,
    customer_id         BIGINT NOT NULL,
    CONSTRAINT PK_CustomerSubsidy PRIMARY KEY (customer_subsidy_id),
    CONSTRAINT FK_CustomerSubsidy_Subsidy FOREIGN KEY (subsidy_id)
        REFERENCES dbo.SubsidyScheme(subsidy_id),
    CONSTRAINT FK_CustomerSubsidy_Employee FOREIGN KEY (employee_id)
        REFERENCES dbo.Employee(employee_id),
    CONSTRAINT FK_CustomerSubsidy_Customer FOREIGN KEY (customer_id)
        REFERENCES dbo.Customer(customer_id)
);
GO

CREATE TABLE dbo.SubsidyApprove (
    employee_id       BIGINT NOT NULL,
    subsidy_id        BIGINT NOT NULL,
    CONSTRAINT PK_SubsidyApprove PRIMARY KEY (employee_id, subsidy_id),
    CONSTRAINT FK_SubsidyApprove_Employee FOREIGN KEY (employee_id)
        REFERENCES dbo.Employee(employee_id),
    CONSTRAINT FK_SubsidyApprove_Subsidy FOREIGN KEY (subsidy_id)
        REFERENCES dbo.SubsidyScheme(subsidy_id)
);
GO

CREATE TABLE dbo.SolarInstallation (
    solar_id                 BIGINT IDENTITY(1,1) NOT NULL,
    meter_id                 BIGINT NOT NULL,
    scheme_type              VARCHAR(30) NOT NULL,
    installation_date        DATE NOT NULL,
    installation_capacity_kw DECIMAL(10,3) NOT NULL,
    installer_company        VARCHAR(150) NULL,
    approval_ref             VARCHAR(120) NULL,
    agreement_start_date     DATE NULL,
    agreement_end_date       DATE NULL,
    status                   VARCHAR(20) NOT NULL,
    employee_id              BIGINT NULL,
    connection_id            BIGINT NOT NULL,
    CONSTRAINT PK_SolarInstallation PRIMARY KEY (solar_id),
    CONSTRAINT FK_SolarInstallation_Meter FOREIGN KEY (meter_id)
        REFERENCES dbo.Meter(meter_id),
    CONSTRAINT FK_SolarInstallation_Employee FOREIGN KEY (employee_id)
        REFERENCES dbo.Employee(employee_id),
    CONSTRAINT FK_SolarInstallation_ServiceConnection FOREIGN KEY (connection_id)
        REFERENCES dbo.ServiceConnection(connection_id)

);
GO

/* =========================
   6) Generation & Storage & Quality
   ========================= */



/* Inventory tables required for FK above; create ItemCategory/Item now */
CREATE TABLE dbo.ItemCategory (
    item_category_id    BIGINT IDENTITY(1,1) NOT NULL,
    name                VARCHAR(120) NOT NULL,
    category_type       VARCHAR(30) NOT NULL,
    utility_type_id     BIGINT NULL,
    CONSTRAINT PK_ItemCategory PRIMARY KEY (item_category_id),
    CONSTRAINT FK_ItemCategory_UtilityType FOREIGN KEY (utility_type_id)
        REFERENCES dbo.UtilityType(utility_type_id)
);
GO

CREATE TABLE dbo.Item (
    item_id               BIGINT IDENTITY(1,1) NOT NULL,
    storage_requirements  NVARCHAR(MAX) NULL,
    shelf_life_days       INT NULL,
    hazard_class          VARCHAR(50) NULL,
    is_consumable         BIT NOT NULL CONSTRAINT DF_Item_consumable DEFAULT (0),
    standard_unit_cost    DECIMAL(12,2) NOT NULL,
    uom                   VARCHAR(20) NOT NULL,
    name                  VARCHAR(150) NOT NULL,
    item_category_id      BIGINT NOT NULL,
    CONSTRAINT PK_Item PRIMARY KEY (item_id),
    CONSTRAINT FK_Item_ItemCategory FOREIGN KEY (item_category_id)
        REFERENCES dbo.ItemCategory(item_category_id)
);
GO

CREATE TABLE dbo.SiteStorageLocation (
    storage_location_id  BIGINT IDENTITY(1,1) NOT NULL,
    storage_type         VARCHAR(50) NOT NULL,
    name                 VARCHAR(120) NOT NULL,
    status               VARCHAR(30) NOT NULL,
    item_id              BIGINT NOT NULL,
    capacity_uom         VARCHAR(20) NOT NULL,
    capacity_qty         DECIMAL(14,3) NOT NULL,
    CONSTRAINT PK_SiteStorageLocation PRIMARY KEY (storage_location_id),
    CONSTRAINT FK_SiteStorageLocation_Item FOREIGN KEY (item_id)
        REFERENCES dbo.Item(item_id) -- Item created later; constraint added after Item creation if needed
);
GO

/* Fix FK for SiteStorageLocation -> Item (created after Item) */
ALTER TABLE dbo.SiteStorageLocation
DROP CONSTRAINT FK_SiteStorageLocation_Item;
GO
ALTER TABLE dbo.SiteStorageLocation
ADD CONSTRAINT FK_SiteStorageLocation_Item FOREIGN KEY (item_id)
    REFERENCES dbo.Item(item_id);
GO

CREATE TABLE dbo.GenerationSite (
    generation_site_id   BIGINT IDENTITY(1,1) NOT NULL,
    name                 VARCHAR(150) NOT NULL,
    site_type            VARCHAR(50) NOT NULL,
    status               VARCHAR(30) NOT NULL,
    commissioned_date    DATE NULL,
    storage_location_id  BIGINT NULL,
    nameplate_capacity   DECIMAL(14,3) NULL,
    capacity_uom         VARCHAR(20) NULL,
    utility_type_id      BIGINT NOT NULL,
    CONSTRAINT PK_GenerationSite PRIMARY KEY (generation_site_id),
    CONSTRAINT FK_GenerationSite_UtilityType FOREIGN KEY (utility_type_id)
        REFERENCES dbo.UtilityType(utility_type_id),
    CONSTRAINT FK_GenerationSite_StorageLocation FOREIGN KEY (storage_location_id)
        REFERENCES dbo.SiteStorageLocation(storage_location_id)
);
GO

CREATE TABLE dbo.GenerationUnit (
    generation_unit_id   BIGINT IDENTITY(1,1) NOT NULL,
    status               VARCHAR(30) NOT NULL,
    capacity_uom         VARCHAR(20) NOT NULL,
    unit_capacity        DECIMAL(14,3) NOT NULL,
    generation_site_id   BIGINT NOT NULL,
    CONSTRAINT PK_GenerationUnit PRIMARY KEY (generation_unit_id),
    CONSTRAINT FK_GenerationUnit_Site FOREIGN KEY (generation_site_id)
        REFERENCES dbo.GenerationSite(generation_site_id)
);
GO

CREATE TABLE dbo.GenerationOutputReading (
    output_reading_id    BIGINT IDENTITY(1,1) NOT NULL,
    reading_ts           DATETIME2(0) NOT NULL,
    output_value         DECIMAL(14,3) NOT NULL,
    output_uom           VARCHAR(20) NOT NULL,
    quality_flag         VARCHAR(20) NOT NULL,
    generation_unit_id   BIGINT NOT NULL,
    CONSTRAINT PK_GenerationOutputReading PRIMARY KEY (output_reading_id),
    CONSTRAINT FK_GenerationOutputReading_Unit FOREIGN KEY (generation_unit_id)
        REFERENCES dbo.GenerationUnit(generation_unit_id)
);
GO

CREATE TABLE dbo.OperationRun (
    operation_run_id     BIGINT IDENTITY(1,1) NOT NULL,
    generation_unit_id   BIGINT NULL,
    generation_site_id   BIGINT NOT NULL,
    output_qty           DECIMAL(14,3) NULL,
    run_status           VARCHAR(20) NOT NULL,
    notes                NVARCHAR(MAX) NULL,
    output_uom           VARCHAR(20) NULL,
    start_ts             DATETIME2(0) NOT NULL,
    end_ts               DATETIME2(0) NULL,
    CONSTRAINT PK_OperationRun PRIMARY KEY (operation_run_id),
    CONSTRAINT FK_OperationRun_Unit FOREIGN KEY (generation_unit_id)
        REFERENCES dbo.GenerationUnit(generation_unit_id),
    CONSTRAINT FK_OperationRun_Site FOREIGN KEY (generation_site_id)
        REFERENCES dbo.GenerationSite(generation_site_id)
);
GO

/* =========================
   7) Warehouse & Stock
   ========================= */

CREATE TABLE dbo.Warehouse (
    warehouse_id        BIGINT IDENTITY(1,1) NOT NULL,
    name                VARCHAR(150) NOT NULL,
    status              VARCHAR(30) NOT NULL,
    geo_area_id         BIGINT NOT NULL,
    CONSTRAINT PK_Warehouse PRIMARY KEY (warehouse_id),
    CONSTRAINT FK_Warehouse_GeoArea FOREIGN KEY (geo_area_id)
        REFERENCES dbo.GeoArea(geo_area_id)
);
GO

CREATE TABLE dbo.WarehouseStock (
    warehouse_id        BIGINT NOT NULL,
    item_id             BIGINT NOT NULL,
    last_stocktake_ts   DATETIME2(0) NULL,
    reorder_level       DECIMAL(14,3) NULL,
    reserved_qty        DECIMAL(14,3) NOT NULL CONSTRAINT DF_WarehouseStock_reserved DEFAULT (0),
    on_hand_qty         DECIMAL(14,3) NOT NULL,
    CONSTRAINT PK_WarehouseStock PRIMARY KEY (warehouse_id, item_id),
    CONSTRAINT FK_WarehouseStock_Warehouse FOREIGN KEY (warehouse_id)
        REFERENCES dbo.Warehouse(warehouse_id),
    CONSTRAINT FK_WarehouseStock_Item FOREIGN KEY (item_id)
        REFERENCES dbo.Item(item_id)
);
GO

/* StockTransaction */
CREATE TABLE dbo.StockTransaction (
    stock_txn_id              BIGINT IDENTITY(1,1) NOT NULL,
    txn_type                  VARCHAR(30) NOT NULL,
    reference_id              BIGINT NULL,
    reference_type            VARCHAR(30) NULL,
    txn_ts                    DATETIME2(0) NOT NULL,
    unit_cost                 DECIMAL(12,2) NOT NULL,
    qty                       DECIMAL(14,3) NOT NULL,
    warehouse_id              BIGINT NOT NULL,
    work_order_item_usage_id  BIGINT NULL,
    CONSTRAINT PK_StockTransaction PRIMARY KEY (stock_txn_id),
    CONSTRAINT FK_StockTransaction_Warehouse FOREIGN KEY (warehouse_id)
        REFERENCES dbo.Warehouse(warehouse_id)
    -- FK to WorkOrderItemUsage added after WorkOrderItemUsage is created
);
GO

CREATE TABLE dbo.ItemStockTransaction (
    stock_txn_id         BIGINT NOT NULL,
    item_id              BIGINT NOT NULL,
    CONSTRAINT PK_ItemStockTransaction PRIMARY KEY (stock_txn_id, item_id),
    CONSTRAINT FK_ItemStockTransaction_StockTxn FOREIGN KEY (stock_txn_id)
        REFERENCES dbo.StockTransaction(stock_txn_id),
    CONSTRAINT FK_ItemStockTransaction_Item FOREIGN KEY (item_id)
        REFERENCES dbo.Item(item_id)
);
GO

/* =========================
   8) Maintenance & Work Orders
   ========================= */

CREATE TABLE dbo.Asset (
    asset_id           BIGINT IDENTITY(1,1) NOT NULL,
    name               VARCHAR(150) NOT NULL,
    asset_type         VARCHAR(50) NOT NULL,
    status             VARCHAR(30) NOT NULL,
    utility_type_id    BIGINT NOT NULL,
    CONSTRAINT PK_Asset PRIMARY KEY (asset_id),
    CONSTRAINT FK_Asset_UtilityType FOREIGN KEY (utility_type_id)
        REFERENCES dbo.UtilityType(utility_type_id)
);
GO

CREATE TABLE dbo.MaintenanceRequest (
    request_id               BIGINT IDENTITY(1,1) NOT NULL,
    requested_by_customer_id BIGINT NULL,
    request_ts               DATETIME2(0) NOT NULL,
    priority                 VARCHAR(20) NOT NULL,
    issue_type               VARCHAR(50) NOT NULL,
    description              NVARCHAR(MAX) NOT NULL,
    output_uom               VARCHAR(20) NULL,
    geo_area_id              BIGINT NOT NULL,
    utility_type_id          BIGINT NOT NULL,
    CONSTRAINT PK_MaintenanceRequest PRIMARY KEY (request_id),
    CONSTRAINT FK_MaintenanceRequest_Customer FOREIGN KEY (requested_by_customer_id)
        REFERENCES dbo.Customer(customer_id),
    CONSTRAINT FK_MaintenanceRequest_GeoArea FOREIGN KEY (geo_area_id)
        REFERENCES dbo.GeoArea(geo_area_id),
    CONSTRAINT FK_MaintenanceRequest_UtilityType FOREIGN KEY (utility_type_id)
        REFERENCES dbo.UtilityType(utility_type_id)
);
GO

CREATE TABLE dbo.WorkOrder (
    work_order_id        BIGINT IDENTITY(1,1) NOT NULL,
    opened_ts            DATETIME2(0) NOT NULL,
    scheduled_start_ts   DATETIME2(0) NULL,
    resolution_notes     NVARCHAR(MAX) NULL,
    work_order_status    VARCHAR(30) NOT NULL,
    closed_ts            DATETIME2(0) NULL,
    scheduled_end_ts     DATETIME2(0) NULL,
    asset_id             BIGINT NULL,
    request_id           BIGINT NULL,
    geo_area_id          BIGINT NOT NULL,
    CONSTRAINT PK_WorkOrder PRIMARY KEY (work_order_id),
    CONSTRAINT FK_WorkOrder_Asset FOREIGN KEY (asset_id)
        REFERENCES dbo.Asset(asset_id),
    CONSTRAINT FK_WorkOrder_Request FOREIGN KEY (request_id)
        REFERENCES dbo.MaintenanceRequest(request_id),
    CONSTRAINT FK_WorkOrder_GeoArea FOREIGN KEY (geo_area_id)
        REFERENCES dbo.GeoArea(geo_area_id)
);
GO

CREATE TABLE dbo.WorkOrderLabor (
    work_order_labor_id     BIGINT IDENTITY(1,1) NOT NULL,
    work_date               DATE NOT NULL,
    hours                   DECIMAL(6,2) NOT NULL,
    hourly_rate_snapshot    DECIMAL(12,2) NOT NULL,
    work_order_id           BIGINT NOT NULL,
    CONSTRAINT PK_WorkOrderLabor PRIMARY KEY (work_order_labor_id),
    CONSTRAINT CK_WorkOrderLabor_hours CHECK (hours >= 0),
    CONSTRAINT FK_WorkOrderLabor_WorkOrder FOREIGN KEY (work_order_id)
        REFERENCES dbo.WorkOrder(work_order_id)
);
GO

CREATE TABLE dbo.WorkOrderLaborEmployee (
    work_order_labor_id  BIGINT NOT NULL,
    employee_id          BIGINT NOT NULL,
    CONSTRAINT PK_WorkOrderLaborEmployee PRIMARY KEY (work_order_labor_id, employee_id),
    CONSTRAINT FK_WOLE_Labor FOREIGN KEY (work_order_labor_id)
        REFERENCES dbo.WorkOrderLabor(work_order_labor_id),
    CONSTRAINT FK_WOLE_Employee FOREIGN KEY (employee_id)
        REFERENCES dbo.Employee(employee_id)
);
GO

CREATE TABLE dbo.WorkOrderItemUsage (
    work_order_item_usage_id BIGINT IDENTITY(1,1) NOT NULL,
    qty_used                 DECIMAL(14,3) NOT NULL,
    unit_cost_snapshot       DECIMAL(12,2) NOT NULL,
    item_cost_amount         DECIMAL(12,2) NOT NULL,
    issued_ts                DATETIME2(0) NOT NULL,
    stock_txn_id             BIGINT NULL,
    work_order_id            BIGINT NOT NULL,
    item_id                  BIGINT NOT NULL,
    warehouse_id             BIGINT NOT NULL,
    CONSTRAINT PK_WorkOrderItemUsage PRIMARY KEY (work_order_item_usage_id),
    CONSTRAINT FK_WOIU_WorkOrder FOREIGN KEY (work_order_id)
        REFERENCES dbo.WorkOrder(work_order_id),
    CONSTRAINT FK_WOIU_Item FOREIGN KEY (item_id)
        REFERENCES dbo.Item(item_id),
    CONSTRAINT FK_WOIU_Warehouse FOREIGN KEY (warehouse_id)
        REFERENCES dbo.Warehouse(warehouse_id),
    CONSTRAINT FK_WOIU_StockTxn FOREIGN KEY (stock_txn_id)
        REFERENCES dbo.StockTransaction(stock_txn_id)
);
GO

ALTER TABLE dbo.StockTransaction
ADD CONSTRAINT FK_StockTransaction_WorkOrderItemUsage FOREIGN KEY (work_order_item_usage_id)
    REFERENCES dbo.WorkOrderItemUsage(work_order_item_usage_id);
GO

CREATE TABLE dbo.AssetOutage (
    outage_id          BIGINT IDENTITY(1,1) NOT NULL,
    outage_type        VARCHAR(20) NOT NULL,
    start_ts           DATETIME2(0) NOT NULL,
    end_ts             DATETIME2(0) NULL,
    reason             NVARCHAR(MAX) NULL,
    derate_percent     DECIMAL(5,2) NULL,
    asset_id           BIGINT NOT NULL,
    CONSTRAINT PK_AssetOutage PRIMARY KEY (outage_id),
    CONSTRAINT CK_AssetOutage_derate CHECK (derate_percent IS NULL OR (derate_percent BETWEEN 0 AND 100)),
    CONSTRAINT FK_AssetOutage_Asset FOREIGN KEY (asset_id)
        REFERENCES dbo.Asset(asset_id)
);
GO

CREATE TABLE dbo.Outage (
    outage_id          BIGINT IDENTITY(1,1) NOT NULL,
    reason             NVARCHAR(MAX) NULL,
    utility_type_id    BIGINT NOT NULL,
    start_time         DATETIME2(0) NOT NULL,
    end_time           DATETIME2(0) NULL,
    outage_type        VARCHAR(30) NOT NULL,
    employee_id        BIGINT NULL,
    CONSTRAINT PK_Outage PRIMARY KEY (outage_id),
    CONSTRAINT FK_Outage_UtilityType FOREIGN KEY (utility_type_id)
        REFERENCES dbo.UtilityType(utility_type_id),
    CONSTRAINT FK_Outage_Employee FOREIGN KEY (employee_id)
        REFERENCES dbo.Employee(employee_id)
);
GO

CREATE TABLE dbo.DisconnectionOrder (
    disconnection_id   BIGINT IDENTITY(1,1) NOT NULL,
    reason             NVARCHAR(MAX) NULL,
    issue_date         DATE NOT NULL,
    scheduled_date     DATE NULL,
    executed_date      DATE NULL,
    status             VARCHAR(20) NOT NULL,
    connection_id      BIGINT NOT NULL,
    employee_id        BIGINT NOT NULL,
    CONSTRAINT PK_DisconnectionOrder PRIMARY KEY (disconnection_id),
    CONSTRAINT FK_DisconnectionOrder_ServiceConnection FOREIGN KEY (connection_id)
        REFERENCES dbo.ServiceConnection(connection_id),
    CONSTRAINT FK_DisconnectionOrder_Employee FOREIGN KEY (employee_id)
        REFERENCES dbo.Employee(employee_id)
);
GO

CREATE TABLE dbo.ReconnectionOrder (
    reconnection_id    BIGINT IDENTITY(1,1) NOT NULL,
    reconnection_date  DATE NULL,
    reconnection_fee   DECIMAL(12,2) NOT NULL CONSTRAINT DF_Reconnection_fee DEFAULT (0),
    scheduled_date     DATE NULL,
    status             VARCHAR(20) NOT NULL,
    connection_id      BIGINT NOT NULL,
    employee_id        BIGINT NOT NULL,
    CONSTRAINT PK_ReconnectionOrder PRIMARY KEY (reconnection_id),
    CONSTRAINT FK_ReconnectionOrder_ServiceConnection FOREIGN KEY (connection_id)
        REFERENCES dbo.ServiceConnection(connection_id),
    CONSTRAINT FK_ReconnectionOrder_Employee FOREIGN KEY (employee_id)
        REFERENCES dbo.Employee(employee_id)
);
GO

CREATE TABLE dbo.Complaints (
    complaint_id          BIGINT IDENTITY(1,1) NOT NULL,
    complaint_type        VARCHAR(50) NOT NULL,
    created_date          DATETIME2(0) NOT NULL,
    resolved_date         DATETIME2(0) NULL,
    status                VARCHAR(20) NOT NULL,
    description           NVARCHAR(MAX) NOT NULL,
    assigned_employee_id  BIGINT NULL,
    customer_id           BIGINT NOT NULL,
    CONSTRAINT PK_Complaints PRIMARY KEY (complaint_id),
    CONSTRAINT FK_Complaints_Employee FOREIGN KEY (assigned_employee_id)
        REFERENCES dbo.Employee(employee_id),
    CONSTRAINT FK_Complaints_Customer FOREIGN KEY (customer_id)
        REFERENCES dbo.Customer(customer_id)
);
GO

/* =========================
   9) Fleet
   ========================= */

CREATE TABLE dbo.Vehicle (
    vehicle_id        BIGINT IDENTITY(1,1) NOT NULL,
    vehicle_type      VARCHAR(50) NOT NULL,
    reg_no            VARCHAR(40) NOT NULL,
    fuel_type         VARCHAR(30) NULL,
    make              VARCHAR(80) NULL,
    model             VARCHAR(80) NULL,
    purchase_date     DATE NULL,
    capacity_notes    NVARCHAR(MAX) NULL,
    status            VARCHAR(30) NOT NULL,
    geo_area_id       BIGINT NOT NULL,
    CONSTRAINT PK_Vehicle PRIMARY KEY (vehicle_id),
    CONSTRAINT UQ_Vehicle_reg UNIQUE (reg_no),
    CONSTRAINT FK_Vehicle_GeoArea FOREIGN KEY (geo_area_id)
        REFERENCES dbo.GeoArea(geo_area_id)
);
GO

CREATE TABLE dbo.VehicleServiceEvent (
    vehicle_service_event_id BIGINT IDENTITY(1,1) NOT NULL,
    service_date             DATE NOT NULL,
    service_type             VARCHAR(80) NOT NULL,
    cost_amount              DECIMAL(12,2) NOT NULL,
    description              NVARCHAR(MAX) NULL,
    odometer                 INT NULL,
    vehicle_id               BIGINT NOT NULL,
    CONSTRAINT PK_VehicleServiceEvent PRIMARY KEY (vehicle_service_event_id),
    CONSTRAINT FK_VehicleServiceEvent_Vehicle FOREIGN KEY (vehicle_id)
        REFERENCES dbo.Vehicle(vehicle_id)
);
GO

CREATE TABLE dbo.VehicleAssignment (
    vehicle_assignment_id BIGINT IDENTITY(1,1) NOT NULL,
    fuel_cost_amount      DECIMAL(12,2) NOT NULL CONSTRAINT DF_VehicleAssignment_fuel DEFAULT (0),
    assigned_from_ts      DATETIME2(0) NOT NULL,
    assigned_to_ts        DATETIME2(0) NULL,
    usage_notes           NVARCHAR(MAX) NULL,
    vehicle_id            BIGINT NOT NULL,
    work_order_id         BIGINT NOT NULL,
    CONSTRAINT PK_VehicleAssignment PRIMARY KEY (vehicle_assignment_id),
    CONSTRAINT FK_VehicleAssignment_Vehicle FOREIGN KEY (vehicle_id)
        REFERENCES dbo.Vehicle(vehicle_id),
    CONSTRAINT FK_VehicleAssignment_WorkOrder FOREIGN KEY (work_order_id)
        REFERENCES dbo.WorkOrder(work_order_id)
);
GO

/* =========================
   10) Zone Supply Metering
   ========================= */

CREATE TABLE dbo.ZoneSupplyMeter (
    zone_supply_meter_id BIGINT IDENTITY(1,1) NOT NULL,
    installed_date       DATE NULL,
    status               VARCHAR(30) NOT NULL,
    node_id              BIGINT NULL,
    utility_type_id      BIGINT NOT NULL,
    CONSTRAINT PK_ZoneSupplyMeter PRIMARY KEY (zone_supply_meter_id),
    CONSTRAINT FK_ZoneSupplyMeter_Node FOREIGN KEY (node_id)
        REFERENCES dbo.NetworkNode(node_id),
    CONSTRAINT FK_ZoneSupplyMeter_UtilityType FOREIGN KEY (utility_type_id)
        REFERENCES dbo.UtilityType(utility_type_id)
);
GO

CREATE TABLE dbo.ZoneSupplyReading (
    zone_supply_reading_id BIGINT IDENTITY(1,1) NOT NULL,
    uom                    VARCHAR(20) NOT NULL,
    value                  DECIMAL(14,3) NOT NULL,
    reading_ts             DATETIME2(0) NOT NULL,
    zone_supply_meter_id   BIGINT NOT NULL,
    CONSTRAINT PK_ZoneSupplyReading PRIMARY KEY (zone_supply_reading_id),
    CONSTRAINT FK_ZoneSupplyReading_Meter FOREIGN KEY (zone_supply_meter_id)
        REFERENCES dbo.ZoneSupplyMeter(zone_supply_meter_id)
);
GO



CREATE TABLE dbo.WaterQualityTest (
    quality_test_id     BIGINT IDENTITY(1,1) NOT NULL,
    sample_ts           DATETIME2(0) NOT NULL,
    parameter           VARCHAR(50) NOT NULL,
    value               DECIMAL(14,4) NOT NULL,
    uom                 VARCHAR(20) NOT NULL,
    generation_site_id  BIGINT NOT NULL,
    CONSTRAINT PK_WaterQualityTest PRIMARY KEY (quality_test_id),
    CONSTRAINT FK_WaterQualityTest_Site FOREIGN KEY (generation_site_id)
        REFERENCES dbo.GenerationSite(generation_site_id)
);
GO



CREATE TABLE dbo.OperationInputConsumption (
    operation_input_id     BIGINT IDENTITY(1,1) NOT NULL,
    item_id                BIGINT NOT NULL,
    stock_txn_id           BIGINT NULL,
    consumed_ts            DATETIME2(0) NOT NULL,
    total_cost_amount      DECIMAL(12,2) NOT NULL,
    unit_cost_snapshot     DECIMAL(12,2) NOT NULL,
    uom                    VARCHAR(20) NOT NULL,
    qty_used               DECIMAL(14,3) NOT NULL,
    storage_location_id    BIGINT NULL,
    operation_run_id       BIGINT NOT NULL,
    CONSTRAINT PK_OperationInputConsumption PRIMARY KEY (operation_input_id),
    CONSTRAINT FK_OperationInputConsumption_Item FOREIGN KEY (item_id)
        REFERENCES dbo.Item(item_id),
    CONSTRAINT FK_OperationInputConsumption_StockTxn FOREIGN KEY (stock_txn_id)
        REFERENCES dbo.StockTransaction(stock_txn_id),
    CONSTRAINT FK_OperationInputConsumption_StorageLocation FOREIGN KEY (storage_location_id)
        REFERENCES dbo.SiteStorageLocation(storage_location_id),
    CONSTRAINT FK_OperationInputConsumption_Run FOREIGN KEY (operation_run_id)
        REFERENCES dbo.OperationRun(operation_run_id)
);
GO


CREATE INDEX IX_Bill_meter_period ON dbo.Bill(meter_id, billing_period_start, billing_period_end);
CREATE INDEX IX_MeterReading_meter_date ON dbo.MeterReading(meter_id, reading_date);
CREATE INDEX IX_WorkOrder_geo_status ON dbo.WorkOrder(geo_area_id, work_order_status);
CREATE INDEX IX_StockTransaction_warehouse_ts ON dbo.StockTransaction(warehouse_id, txn_ts);
CREATE INDEX IX_Payment_connection_id ON dbo.Payment(connection_id) INCLUDE (payment_amount, payment_date);
GO


/* ============================================================
   Government Utility Management System - Sample Data for Sri Lanka
   Realistic data with Sri Lankan names, cities, and scenarios
   ============================================================ */

SET NOCOUNT ON;
GO

-- ============================================================
-- 1) CORE REFERENCE DATA
-- ============================================================

-- Utility Types
INSERT INTO dbo.UtilityType (code, name) VALUES
('ELEC', 'Electricity'),
('WATER', 'Water Supply'),
('GAS', 'Natural Gas');
GO

-- Postal Codes (Major Sri Lankan cities)
INSERT INTO dbo.PostalCodes (postal_code, city, province) VALUES
('00100', 'Colombo Fort', 'Western'),
('00200', 'Slave Island', 'Western'),
('00300', 'Kollupitiya', 'Western'),
('00400', 'Bambalapitiya', 'Western'),
('00500', 'Wellawatta', 'Western'),
('00600', 'Bambalapitiya', 'Western'),
('00700', 'Cinnamon Gardens', 'Western'),
('00800', 'Borella', 'Western'),
('01000', 'Nugegoda', 'Western'),
('10100', 'Mount Lavinia', 'Western'),
('10120', 'Dehiwala', 'Western'),
('10230', 'Maharagama', 'Western'),
('10350', 'Kotte', 'Western'),
('10400', 'Moratuwa', 'Western'),
('11010', 'Negombo', 'Western'),
('11500', 'Gampaha', 'Western'),
('11850', 'Kelaniya', 'Western'),
('20000', 'Kandy', 'Central'),
('20400', 'Peradeniya', 'Central'),
('21000', 'Matale', 'Central'),
('22000', 'Nuwara Eliya', 'Central'),
('80000', 'Galle', 'Southern'),
('80100', 'Unawatuna', 'Southern'),
('80200', 'Hikkaduwa', 'Southern'),
('81000', 'Matara', 'Southern'),
('82000', 'Tangalle', 'Southern'),
('40000', 'Jaffna', 'Northern'),
('50000', 'Anuradhapura', 'North Central'),
('51000', 'Polonnaruwa', 'North Central'),
('60000', 'Kurunegala', 'North Western'),
('70000', 'Ratnapura', 'Sabaragamuwa'),
('90000', 'Trincomalee', 'Eastern'),
('91000', 'Batticaloa', 'Eastern');
GO

-- Geographic Areas (Hierarchical structure)
INSERT INTO dbo.GeoArea (name, type, parent_geo_area_id) VALUES
-- Provinces (Top level)
('Western Province', 'PROVINCE', NULL),
('Central Province', 'PROVINCE', NULL),
('Southern Province', 'PROVINCE', NULL),
('Northern Province', 'PROVINCE', NULL),
('Eastern Province', 'PROVINCE', NULL),
('North Western Province', 'PROVINCE', NULL),
('North Central Province', 'PROVINCE', NULL),
('Sabaragamuwa Province', 'PROVINCE', NULL);
GO

-- Districts (child of provinces)
DECLARE @WesternID BIGINT = (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Western Province');
DECLARE @CentralID BIGINT = (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Central Province');
DECLARE @SouthernID BIGINT = (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Southern Province');
DECLARE @NorthernID BIGINT = (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Northern Province');
DECLARE @EasternID BIGINT = (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Eastern Province');

INSERT INTO dbo.GeoArea (name, type, parent_geo_area_id) VALUES
('Colombo District', 'DISTRICT', @WesternID),
('Gampaha District', 'DISTRICT', @WesternID),
('Kalutara District', 'DISTRICT', @WesternID),
('Kandy District', 'DISTRICT', @CentralID),
('Matale District', 'DISTRICT', @CentralID),
('Nuwara Eliya District', 'DISTRICT', @CentralID),
('Galle District', 'DISTRICT', @SouthernID),
('Matara District', 'DISTRICT', @SouthernID),
('Jaffna District', 'DISTRICT', @NorthernID),
('Trincomalee District', 'DISTRICT', @EasternID),
('Batticaloa District', 'DISTRICT', @EasternID);
GO

-- Cities/Towns (child of districts)
DECLARE @ColomboDistID BIGINT = (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Colombo District');
DECLARE @GampahaDistID BIGINT = (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Gampaha District');
DECLARE @KandyDistID BIGINT = (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Kandy District');
DECLARE @GalleDistID BIGINT = (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Galle District');

INSERT INTO dbo.GeoArea (name, type, parent_geo_area_id) VALUES
('Colombo City', 'CITY', @ColomboDistID),
('Nugegoda', 'CITY', @ColomboDistID),
('Dehiwala-Mount Lavinia', 'CITY', @ColomboDistID),
('Moratuwa', 'CITY', @ColomboDistID),
('Maharagama', 'CITY', @ColomboDistID),
('Negombo', 'CITY', @GampahaDistID),
('Gampaha', 'CITY', @GampahaDistID),
('Kelaniya', 'CITY', @GampahaDistID),
('Kandy City', 'CITY', @KandyDistID),
('Peradeniya', 'CITY', @KandyDistID),
('Galle City', 'CITY', @GalleDistID),
('Unawatuna', 'CITY', @GalleDistID);
GO

-- ============================================================
-- 2) HR & PAYROLL DATA
-- ============================================================

-- Departments
DECLARE @ElecID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'ELEC');
DECLARE @WaterID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'WATER');
DECLARE @GasID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'GAS');

INSERT INTO dbo.Department (name, utility_type_id) VALUES
('Ceylon Electricity Board - Operations', @ElecID),
('Ceylon Electricity Board - Engineering', @ElecID),
('Ceylon Electricity Board - Finance', @ElecID),
('Ceylon Electricity Board - Customer Service', @ElecID),
('National Water Supply & Drainage Board - Operations', @WaterID),
('National Water Supply & Drainage Board - Engineering', @WaterID),
('National Water Supply & Drainage Board - Customer Service', @WaterID),
('Lanka Gas Company - Operations', @GasID),
('Lanka Gas Company - Distribution', @GasID),
('Human Resources', @ElecID),
('Procurement & Logistics', @ElecID);
GO

-- Employees (Realistic Sri Lankan names)
DECLARE @Dept1 BIGINT = (SELECT department_id FROM dbo.Department WHERE name = 'Ceylon Electricity Board - Operations');
DECLARE @Dept2 BIGINT = (SELECT department_id FROM dbo.Department WHERE name = 'Ceylon Electricity Board - Engineering');
DECLARE @Dept3 BIGINT = (SELECT department_id FROM dbo.Department WHERE name = 'Ceylon Electricity Board - Finance');
DECLARE @Dept4 BIGINT = (SELECT department_id FROM dbo.Department WHERE name = 'Ceylon Electricity Board - Customer Service');
DECLARE @Dept5 BIGINT = (SELECT department_id FROM dbo.Department WHERE name = 'National Water Supply & Drainage Board - Operations');
DECLARE @Dept6 BIGINT = (SELECT department_id FROM dbo.Department WHERE name = 'National Water Supply & Drainage Board - Engineering');
DECLARE @Dept7 BIGINT = (SELECT department_id FROM dbo.Department WHERE name = 'National Water Supply & Drainage Board - Customer Service');
DECLARE @Dept10 BIGINT = (SELECT department_id FROM dbo.Department WHERE name = 'Human Resources');

INSERT INTO dbo.Employee (first_name, middle_name, last_name, employee_no, designation, role, department_id, email, username, password_hash, last_login_at) VALUES
-- Management
('Nimal', 'Chaminda', 'Perera', 'EMP001', 'Chief Engineer', 'MANAGER', @Dept1, 'nimal.perera@ceb.lk', 'nperera', '$2a$10$abcdefghijklmnopqrstuv', '2026-01-10 09:15:00'),
('Sanduni', 'Malsha', 'Fernando', 'EMP002', 'Finance Director', 'MANAGER', @Dept3, 'sanduni.fernando@ceb.lk', 'sfernando', '$2a$10$abcdefghijklmnopqrstuv', '2026-01-09 14:30:00'),
('Rohan', 'Lakmal', 'Silva', 'EMP003', 'Operations Manager', 'MANAGER', @Dept5, 'rohan.silva@nwsdb.lk', 'rsilva', '$2a$10$abcdefghijklmnopqrstuv', '2026-01-10 08:00:00'),
('Priyanka', NULL, 'Jayawardena', 'EMP004', 'Customer Service Manager', 'MANAGER', @Dept4, 'priyanka.j@ceb.lk', 'pjayawardena', '$2a$10$abcdefghijklmnopqrstuv', '2026-01-08 16:45:00'),

-- Field Officers
('Kasun', 'Nuwan', 'Rajapaksa', 'EMP005', 'Senior Field Officer', 'FIELD_OFFICER', @Dept2, 'kasun.rajapaksa@ceb.lk', 'krajapaksa', '$2b$10$CDcKKre4IsSoQwtNJxpQmuNvd7P1WDm9hwyG4qKEKnA6sXp6VuqXi', '2026-01-10 07:30:00'),
('Dilshan', 'Upul', 'Wickramasinghe', 'EMP006', 'Field Technician', 'FIELD_OFFICER', @Dept2, 'dilshan.w@ceb.lk', 'dwickrama', '$2b$10$CDcKKre4IsSoQwtNJxpQmuNvd7P1WDm9hwyG4qKEKnA6sXp6VuqXi', '2026-01-09 18:20:00'),
('Tharaka', 'Chamara', 'Gunawardena', 'EMP007', 'Water Supply Officer', 'FIELD_OFFICER', @Dept6, 'tharaka.g@nwsdb.lk', 'tgunawarden', '$2b$10$CDcKKre4IsSoQwtNJxpQmuNvd7P1WDm9hwyG4qKEKnA6sXp6VuqXi', '2026-01-10 06:45:00'),
('Dinesh', 'Mahinda', 'Bandara', 'EMP008', 'Maintenance Officer', 'FIELD_OFFICER', @Dept6, 'dinesh.bandara@nwsdb.lk', 'dbandara', '$2b$10$CDcKKre4IsSoQwtNJxpQmuNvd7P1WDm9hwyG4qKEKnA6sXp6VuqXi', '2026-01-09 19:00:00'),

-- Meter Readers
('Kumara', 'Asanka', 'Dissanayake', 'EMP009', 'Meter Reader', 'METER_READER', @Dept4, 'kumara.d@ceb.lk', 'kdissanayak', '$2b$10$CDcKKre4IsSoQwtNJxpQmuNvd7P1WDm9hwyG4qKEKnA6sXp6VuqXi', '2026-01-10 05:30:00'),
('Chaminda', 'Ruwan', 'Herath', 'EMP010', 'Meter Reader', 'METER_READER', @Dept4, 'chaminda.herath@ceb.lk', 'cherath', '$2b$10$CDcKKre4IsSoQwtNJxpQmuNvd7P1WDm9hwyG4qKEKnA6sXp6VuqXi', '2026-01-09 15:45:00'),
('Sampath', NULL, 'Amarasinghe', 'EMP011', 'Meter Reader', 'METER_READER', @Dept7, 'sampath.a@nwsdb.lk', 'samarasingh', '$2b$10$CDcKKre4IsSoQwtNJxpQmuNvd7P1WDm9hwyG4qKEKnA6sXp6VuqXi', '2026-01-10 06:00:00'),

-- Cashiers
('Madhavi', 'Chathuri', 'Senanayake', 'EMP012', 'Cashier', 'CASHIER', @Dept4, 'madhavi.s@ceb.lk', 'msenanayake', '$2b$10$CDcKKre4IsSoQwtNJxpQmuNvd7P1WDm9hwyG4qKEKnA6sXp6VuqXi', '2026-01-10 11:30:00'),
('Nilmini', 'Sandya', 'Rathnayake', 'EMP013', 'Senior Cashier', 'CASHIER', @Dept4, 'nilmini.r@ceb.lk', 'nrathnayake', '$2b$10$CDcKKre4IsSoQwtNJxpQmuNvd7P1WDm9hwyG4qKEKnA6sXp6VuqXi', '2026-01-09 13:15:00'),
('Supun', 'Tharindu', 'Pathirana', 'EMP014', 'Payment Officer', 'CASHIER', @Dept7, 'supun.p@nwsdb.lk', 'spathirana', '$2b$10$CDcKKre4IsSoQwtNJxpQmuNvd7P1WDm9hwyG4qKEKnA6sXp6VuqXi', '2026-01-10 10:00:00'),

-- Administrative Staff
('Anusha', 'Damayanthi', 'Karunaratne', 'EMP015', 'Admin Officer', 'ADMIN', @Dept4, 'anusha.k@ceb.lk', 'akarunaratne', '$2b$10$CDcKKre4IsSoQwtNJxpQmuNvd7P1WDm9hwyG4qKEKnA6sXp6VuqXi', '2026-01-09 12:00:00'),
('Harsha', 'Madushan', 'Wijesinghe', 'EMP016', 'Connection Officer', 'ADMIN', @Dept4, 'harsha.w@ceb.lk', 'hwijesinghe', '$2b$10$CDcKKre4IsSoQwtNJxpQmuNvd7P1WDm9hwyG4qKEKnA6sXp6VuqXi', '2026-01-10 09:45:00'),
('Thilini', NULL, 'Gamage', 'EMP017', 'Tariff Administrator', 'ADMIN', @Dept3, 'thilini.gamage@ceb.lk', 'tgamage', '$2b$10$CDcKKre4IsSoQwtNJxpQmuNvd7P1WDm9hwyG4qKEKnA6sXp6VuqXi', '2026-01-08 15:30:00'),
('Amila', 'Prasanna', 'Jayasuriya', 'EMP018', 'HR Officer', 'ADMIN', @Dept10, 'amila.j@ceb.lk', 'ajayasuriya', '$2b$10$CDcKKre4IsSoQwtNJxpQmuNvd7P1WDm9hwyG4qKEKnA6sXp6VuqXi', '2026-01-09 10:20:00'),

-- Engineers
('Udaya', 'Chandra', 'Weerasinghe', 'EMP019', 'Electrical Engineer', 'ENGINEER', @Dept2, 'udaya.w@ceb.lk', 'uweerasingh', '$2b$10$CDcKKre4IsSoQwtNJxpQmuNvd7P1WDm9hwyG4qKEKnA6sXp6VuqXi', '2026-01-10 08:30:00'),
('Buddhika', NULL, 'Ratnayake', 'EMP020', 'Civil Engineer', 'ENGINEER', @Dept6, 'buddhika.r@nwsdb.lk', 'bratnayake', '$2b$10$CDcKKre4IsSoQwtNJxpQmuNvd7P1WDm9hwyG4qKEKnA6sXp6VuqXi', '2026-01-09 09:00:00');
GO

-- Employee Phone Numbers
DECLARE @Emp1 BIGINT = (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP001');
DECLARE @Emp2 BIGINT = (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP002');
DECLARE @Emp5 BIGINT = (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP005');
DECLARE @Emp9 BIGINT = (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP009');
DECLARE @Emp12 BIGINT = (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP012');

INSERT INTO dbo.EmployeePhoneNumber (employee_id, phone) VALUES
(@Emp1, '+94112345001'),
(@Emp1, '+94771234001'),
(@Emp2, '+94112345002'),
(@Emp2, '+94771234002'),
(@Emp5, '+94771234005'),
(@Emp9, '+94771234009'),
(@Emp12, '+94112345012'),
(@Emp12, '+94771234012');
GO



-- Managers
INSERT INTO dbo.Manager (employee_id, management_level, report_access_level) VALUES
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP001'), 'SENIOR', 'NATIONAL'),
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP002'), 'SENIOR', 'NATIONAL'),
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP003'), 'MIDDLE', 'PROVINCIAL'),
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP004'), 'MIDDLE', 'REGIONAL');
GO
-- Specialized Employee Roles
DECLARE @GeoArea1 BIGINT = (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Colombo City');
DECLARE @GeoArea2 BIGINT = (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Nugegoda');
DECLARE @GeoArea3 BIGINT = (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Kandy City');

-- Field Officers
INSERT INTO dbo.FieldOfficer (employee_id, service_area_type, shift_type, certification_level, geo_area_id) VALUES
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP005'), 'URBAN', 'DAY', 'Level 3 Electrician', @GeoArea1),
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP006'), 'URBAN', 'NIGHT', 'Level 2 Electrician', @GeoArea2),
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP007'), 'URBAN', 'DAY', 'Water Engineer Grade II', @GeoArea1),
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP008'), 'SEMI_URBAN', 'DAY', 'Water Technician', @GeoArea3);
GO

-- Meter Readers
INSERT INTO dbo.MeterReader (employee_id, device_id, assigned_route_code) VALUES
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP009'), 'MR-DEVICE-001', 'COL-ROUTE-A'),
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP010'), 'MR-DEVICE-002', 'COL-ROUTE-B'),
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP011'), 'MR-DEVICE-003', 'NUG-ROUTE-A');
GO

-- Cashiers
INSERT INTO dbo.Cashier (employee_id, can_override_charges, can_approve_refunds) VALUES
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP012'), 0, 0),
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP013'), 1, 1),
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP014'), 0, 0);
GO

-- Administrative Staff
INSERT INTO dbo.AdministrativeStaff (employee_id, department, can_register_connections, can_manage_tariffs) VALUES
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP015'), 'Customer Service', 0, 0),
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP016'), 'Customer Service', 1, 0),
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP017'), 'Finance', 0, 1),
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP018'), 'Human Resources', 0, 0);
GO

-- Payroll Runs
INSERT INTO dbo.PayrollRun (period_month, period_year, run_date, status, created_by_employee_id) VALUES
(12, 2025, '2025-12-28', 'COMPLETED', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP002')),
(1, 2026, '2026-01-05', 'PROCESSING', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP002'));
GO

-- Salary Component Types
INSERT INTO dbo.SalaryComponentType (name, type) VALUES
('Basic Salary', 'EARNING'),
('Transport Allowance', 'EARNING'),
('Field Allowance', 'EARNING'),
('Overtime', 'EARNING'),
('EPF Contribution', 'DEDUCTION'),
('ETF Contribution', 'DEDUCTION'),
('Income Tax', 'DEDUCTION'),
('Loan Repayment', 'DEDUCTION');
GO

-- Sample Payslips (December 2025)
DECLARE @PayrollRun1 BIGINT = (SELECT payroll_run_id FROM dbo.PayrollRun WHERE period_month = 12 AND period_year = 2025);

INSERT INTO dbo.Payslip (employee_id, payroll_run_id, gross, deductions) VALUES
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP001'), @PayrollRun1, 185000.00, 28500.00),
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP002'), @PayrollRun1, 175000.00, 26800.00),
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP005'), @PayrollRun1, 95000.00, 14250.00),
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP009'), @PayrollRun1, 65000.00, 9750.00),
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP012'), @PayrollRun1, 55000.00, 8250.00);
GO

-- Payslip Components
DECLARE @Payslip1 BIGINT = (SELECT TOP 1 payslip_id FROM dbo.Payslip WHERE employee_id = (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP001'));

INSERT INTO dbo.PayslipComponent (payslip_id, component_type_id, name, amount) VALUES
(@Payslip1, (SELECT component_type_id FROM dbo.SalaryComponentType WHERE name = 'Basic Salary'), 'Basic Salary', 150000.00),
(@Payslip1, (SELECT component_type_id FROM dbo.SalaryComponentType WHERE name = 'Transport Allowance'), 'Transport Allowance', 25000.00),
(@Payslip1, (SELECT component_type_id FROM dbo.SalaryComponentType WHERE name = 'Field Allowance'), 'Management Allowance', 10000.00),
(@Payslip1, (SELECT component_type_id FROM dbo.SalaryComponentType WHERE name = 'EPF Contribution'), 'EPF (8%)', 12000.00),
(@Payslip1, (SELECT component_type_id FROM dbo.SalaryComponentType WHERE name = 'Income Tax'), 'Income Tax', 16500.00);
GO

-- ============================================================
-- 3) CUSTOMERS & CONNECTIONS
-- ============================================================

-- Customer Addresses
INSERT INTO dbo.CustomerAddress (postal_code, line1) VALUES
('00700', '45, Flower Road'),
('00400', '123, Galle Road'),
('01000', '78/2, Stanley Thilakaratne Mawatha'),
('10100', '234, De Saram Road'),
('10350', '15, Sri Jayawardenepura Mawatha'),
('11010', '89, Main Street'),
('20000', '56, Dalada Veediya'),
('20400', '12, University Road'),
('80000', '234, Rampart Street'),
('00300', '67, Ward Place'),
('00500', '189, Ramakrishna Road'),
('10230', '45, High Level Road'),
('11500', '78, Colombo Road'),
('00800', '156, Baseline Road'),
('10120', '234, Galle Road, Dehiwala');
GO

DECLARE @ElecID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'ELEC');
DECLARE @WaterID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'WATER');
DECLARE @GasID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'GAS');
-- Tariff Categories
INSERT INTO dbo.TariffCategory (utility_type_id, code, name, description, is_subsidized, employee_id) VALUES
(@ElecID, 'DOM-ELEC-1', 'Domestic Electricity - Category I', 'Residential consumption up to 60 units per month', 1, (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP017')),
(@ElecID, 'DOM-ELEC-2', 'Domestic Electricity - Category II', 'Residential consumption above 60 units', 0, (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP017')),
(@ElecID, 'IND-ELEC', 'Industrial Electricity', 'Industrial and commercial establishments', 0, (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP017')),
(@ElecID, 'GOV-ELEC', 'Government Electricity', 'Government buildings and institutions', 0, (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP017')),
(@WaterID, 'DOM-WATER', 'Domestic Water Supply', 'Residential water connections', 1, (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP017')),
(@WaterID, 'IND-WATER', 'Industrial Water Supply', 'Commercial and industrial water', 0, (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP017')),
(@GasID, 'DOM-GAS', 'Domestic Gas Supply', 'Residential LPG connections', 0, (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP017'));
GO

-- Tariff Slabs for Electricity (Domestic Category I - Subsidized)
DECLARE @TariffCat1 BIGINT = (SELECT tariff_category_id FROM dbo.TariffCategory WHERE code = 'DOM-ELEC-1');
DECLARE @TariffCat2 BIGINT = (SELECT tariff_category_id FROM dbo.TariffCategory WHERE code = 'DOM-ELEC-2');
DECLARE @TariffCat5 BIGINT = (SELECT tariff_category_id FROM dbo.TariffCategory WHERE code = 'DOM-WATER');

INSERT INTO dbo.TariffSlab (tariff_category_id, from_unit, to_unit, rate_per_unit, fixed_charge, valid_from, valid_to, unit_price) VALUES
-- Electricity Domestic I (per CEB rates)
(@TariffCat1, 0, 30, 8.00, 30.00, '2025-01-01', NULL, 8.00),
(@TariffCat1, 31, 60, 12.00, 30.00, '2025-01-01', NULL, 12.00),
(@TariffCat1, 61, 90, 25.00, 60.00, '2025-01-01', NULL, 25.00),
(@TariffCat1, 91, 120, 35.00, 60.00, '2025-01-01', NULL, 35.00),
(@TariffCat1, 121, NULL, 50.00, 100.00, '2025-01-01', NULL, 50.00),

-- Electricity Domestic II
(@TariffCat2, 0, 60, 15.00, 60.00, '2025-01-01', NULL, 15.00),
(@TariffCat2, 61, 120, 30.00, 60.00, '2025-01-01', NULL, 30.00),
(@TariffCat2, 121, NULL, 55.00, 100.00, '2025-01-01', NULL, 55.00),

-- Water Domestic
(@TariffCat5, 0, 10, 25.00, 100.00, '2025-01-01', NULL, 25.00),
(@TariffCat5, 11, 25, 35.00, 100.00, '2025-01-01', NULL, 35.00),
(@TariffCat5, 26, 50, 55.00, 150.00, '2025-01-01', NULL, 55.00),
(@TariffCat5, 51, NULL, 85.00, 150.00, '2025-01-01', NULL, 85.00);
GO

DECLARE @TariffCat1 BIGINT = (SELECT tariff_category_id FROM dbo.TariffCategory WHERE code = 'DOM-ELEC-1');
DECLARE @TariffCat2 BIGINT = (SELECT tariff_category_id FROM dbo.TariffCategory WHERE code = 'DOM-ELEC-2');
DECLARE @TariffCat5 BIGINT = (SELECT tariff_category_id FROM dbo.TariffCategory WHERE code = 'DOM-WATER');

-- Customers (Realistic Sri Lankan names)
INSERT INTO dbo.Customer (first_name, middle_name, last_name, password_hash, email, customer_address_id, customer_type, status, registration_date, identity_type, identity_ref, employee_id, tariff_category_id) VALUES
('Kamal', 'Dharmasena', 'Weerasinghe', '$2a$10$customer123', 'kamal.w@gmail.com', 1, 'DOMESTIC', 'ACTIVE', '2020-03-15', 'NIC', '197234567V', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP016'), @TariffCat1),
('Nimali', NULL, 'Samaraweera', '$2a$10$customer123', 'nimali.s@yahoo.com', 2, 'DOMESTIC', 'ACTIVE', '2019-07-22', 'NIC', '198567890V', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP016'), @TariffCat1),
('Rajitha', 'Kumar', 'Jayasinghe', '$2a$10$customer123', 'rajitha.j@outlook.com', 3, 'DOMESTIC', 'ACTIVE', '2021-02-10', 'NIC', '198876543V', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP016'), @TariffCat2),
('Chandrika', 'Malini', 'Gunasekera', '$2a$10$customer123', 'chandrika.g@gmail.com', 4, 'DOMESTIC', 'ACTIVE', '2018-11-05', 'NIC', '196745632V', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP016'), @TariffCat1),
('Anura', NULL, 'Wijetunge', '$2a$10$customer123', 'anura.w@hotmail.com', 5, 'DOMESTIC', 'ACTIVE', '2020-08-18', 'NIC', '199123456V', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP016'), @TariffCat1),
('Sunethra', 'Kumari', 'Ranasinghe', '$2a$10$customer123', NULL, 6, 'DOMESTIC', 'ACTIVE', '2017-05-30', 'NIC', '195834567V', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP016'), @TariffCat2),
('Prasanna', 'Lakshman', 'Mendis', '$2a$10$customer123', 'prasanna.m@slt.lk', 7, 'DOMESTIC', 'ACTIVE', '2022-01-12', 'NIC', '199287654V', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP016'), @TariffCat1),
('Malini', NULL, 'Fonseka', '$2a$10$customer123', 'malini.f@gmail.com', 8, 'DOMESTIC', 'ACTIVE', '2019-09-25', 'NIC', '197654321V', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP016'), @TariffCat1),
('Colombo Hotels Ltd', NULL, 'Colombo Hotels Ltd', '$2a$10$customer123', 'accounts@colombohotels.lk', 9, 'INDUSTRIAL', 'ACTIVE', '2015-03-01', 'BRN', 'PV00123456', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP016'), (SELECT tariff_category_id FROM dbo.TariffCategory WHERE code = 'IND-ELEC')),
('Gayan', 'Sampath', 'Liyanage', '$2a$10$customer123', 'gayan.l@dialog.lk', 10, 'DOMESTIC', 'ACTIVE', '2020-06-15', 'NIC', '199098765V', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP016'), @TariffCat1),
('Tharindi', 'Madhubhashini', 'Perera', '$2a$10$customer123', 'tharindi.p@yahoo.com', 11, 'DOMESTIC', 'ACTIVE', '2021-11-08', 'NIC', '199445678V', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP016'), @TariffCat2),
('Ministry of Health', NULL, 'Ministry of Health', '$2a$10$customer123', 'facilities@health.gov.lk', 12, 'GOVERNMENT', 'ACTIVE', '2010-01-01', 'BRN', 'GOV001234', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP016'), (SELECT tariff_category_id FROM dbo.TariffCategory WHERE code = 'GOV-ELEC')),
('Saman', NULL, 'Kumara', '$2a$10$customer123', NULL, 13, 'DOMESTIC', 'ACTIVE', '2023-04-20', 'NIC', '199567890V', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP016'), @TariffCat1),
('Dilini', 'Hansika', 'Rodrigo', '$2a$10$customer123', 'dilini.r@gmail.com', 14, 'DOMESTIC', 'ACTIVE', '2018-12-03', 'NIC', '198712345V', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP016'), @TariffCat1),
('Ruwan', 'Chathuranga', 'Amarasekera', '$2a$10$customer123', 'ruwan.a@mobitel.lk', 15, 'DOMESTIC', 'SUSPENDED', '2016-08-14', 'NIC', '199223456V', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP016'), @TariffCat2);
GO

-- Customer Phone Numbers
INSERT INTO dbo.CustomerPhoneNumbers (customer_id, phone) VALUES
(1, '+94771112233'),
(1, '+94112345678'),
(2, '+94773334455'),
(3, '+94765556677'),
(3, '+94112223344'),
(4, '+94778889900'),
(5, '+94771223344'),
(7, '+94775667788'),
(10, '+94773456789'),
(11, '+94772345678'),
(14, '+94776789012');
GO

DECLARE @ElecID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'ELEC');
DECLARE @WaterID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'WATER');
DECLARE @GasID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'GAS');
-- Network Nodes (Substations, Treatment Plants, etc.)
INSERT INTO dbo.NetworkNode (name, status, node_type, utility_type_id) VALUES
-- Electricity Substations
('Colombo Grid Substation', 'OPERATIONAL', 'SUBSTATION', @ElecID),
('Nugegoda 33kV Substation', 'OPERATIONAL', 'SUBSTATION', @ElecID),
('Dehiwala 11kV Substation', 'OPERATIONAL', 'SUBSTATION', @ElecID),
('Kandy Main Substation', 'OPERATIONAL', 'SUBSTATION', @ElecID),
('Galle Distribution Point', 'OPERATIONAL', 'DISTRIBUTION_POINT', @ElecID),

-- Water Treatment Plants & Pump Stations
('Ambatale Water Treatment Plant', 'OPERATIONAL', 'TREATMENT_PLANT', @WaterID),
('Labugama Reservoir', 'OPERATIONAL', 'RESERVOIR', @WaterID),
('Bolgoda Pump Station', 'OPERATIONAL', 'PUMP_STATION', @WaterID),
('Kandy Water Treatment Plant', 'OPERATIONAL', 'TREATMENT_PLANT', @WaterID),
('Galle Distribution Tank', 'OPERATIONAL', 'DISTRIBUTION_TANK', @WaterID),

-- Gas Distribution Points
('Colombo Gas Regulator Station', 'OPERATIONAL', 'REGULATOR_STATION', @GasID);
GO

DECLARE @ElecID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'ELEC');
DECLARE @WaterID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'WATER');
DECLARE @GasID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'GAS');
-- Network Links
INSERT INTO dbo.NetworkLink (link_type, status, length_km, diameter_mm, to_node_id, from_node_id, max_capacity, capacity_uom, utility_type_id) VALUES
-- Electricity transmission lines
('TRANSMISSION_LINE', 'OPERATIONAL', 12.5, NULL, 2, 1, 50000.00, 'kVA', @ElecID),
('TRANSMISSION_LINE', 'OPERATIONAL', 8.3, NULL, 3, 2, 25000.00, 'kVA', @ElecID),
('TRANSMISSION_LINE', 'OPERATIONAL', 145.2, NULL, 4, 1, 75000.00, 'kVA', @ElecID),

-- Water pipelines
('MAIN_PIPELINE', 'OPERATIONAL', 25.8, 800.00, 8, 6, 50000.00, 'cu.m/day', @WaterID),
('DISTRIBUTION_PIPE', 'OPERATIONAL', 15.3, 600.00, 10, 8, 25000.00, 'cu.m/day', @WaterID),
('DISTRIBUTION_PIPE', 'OPERATIONAL', 8.7, 400.00, 8, 7, 15000.00, 'cu.m/day', @WaterID);
GO

-- Area-Node Associations
INSERT INTO dbo.AreaNode (node_id, geo_area_id) VALUES
(1, (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Colombo City')),
(2, (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Nugegoda')),
(3, (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Dehiwala-Mount Lavinia')),
(4, (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Kandy City')),
(6, (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Colombo City')),
(8, (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Dehiwala-Mount Lavinia'));
GO

-- Connection Addresses
INSERT INTO dbo.ConnectionAddress (line1, city, postal_code, geo_area_id) VALUES
('45, Flower Road, Colombo 7', 'Colombo', '00700', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Colombo City')),
('123, Galle Road, Colombo 4', 'Colombo', '00400', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Colombo City')),
('78/2, Stanley Thilakaratne Mawatha', 'Nugegoda', '01000', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Nugegoda')),
('234, De Saram Road', 'Mount Lavinia', '10100', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Dehiwala-Mount Lavinia')),
('15, Sri Jayawardenepura Mawatha', 'Kotte', '10350', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Colombo City')),
('89, Main Street', 'Negombo', '11010', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Negombo')),
('56, Dalada Veediya', 'Kandy', '20000', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Kandy City')),
('12, University Road', 'Peradeniya', '20400', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Peradeniya')),
('234, Rampart Street', 'Galle', '80000', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Galle City')),
('67, Ward Place', 'Colombo', '00300', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Colombo City')),
('189, Ramakrishna Road', 'Wellawatta', '00500', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Colombo City')),
('45, High Level Road', 'Maharagama', '10230', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Maharagama')),
('78, Colombo Road', 'Gampaha', '11500', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Gampaha')),
('156, Baseline Road', 'Borella', '00800', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Colombo City')),
('234, Galle Road, Dehiwala', 'Dehiwala', '10120', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Dehiwala-Mount Lavinia'));
GO

DECLARE @ElecID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'ELEC');
DECLARE @WaterID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'WATER');
DECLARE @GasID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'GAS');
-- Meters
INSERT INTO dbo.Meter (meter_serial_no, utility_type_id, installation_date, is_smart_meter, status) VALUES
-- Electricity Meters
('ELEC-COL-001234', @ElecID, '2020-03-15', 1, 'ACTIVE'),
('ELEC-COL-001235', @ElecID, '2019-07-22', 0, 'ACTIVE'),
('ELEC-NUG-002456', @ElecID, '2021-02-10', 1, 'ACTIVE'),
('ELEC-MLV-003567', @ElecID, '2018-11-05', 0, 'ACTIVE'),
('ELEC-KOT-004678', @ElecID, '2020-08-18', 1, 'ACTIVE'),
('ELEC-NEG-005789', @ElecID, '2017-05-30', 0, 'ACTIVE'),
('ELEC-KDY-006890', @ElecID, '2022-01-12', 1, 'ACTIVE'),
('ELEC-PER-007901', @ElecID, '2019-09-25', 0, 'ACTIVE'),
('ELEC-IND-HOT-001', @ElecID, '2015-03-01', 1, 'ACTIVE'),
('ELEC-COL-008012', @ElecID, '2020-06-15', 1, 'ACTIVE'),
('ELEC-WEL-009123', @ElecID, '2021-11-08', 1, 'ACTIVE'),
('ELEC-GOV-MH-001', @ElecID, '2010-01-01', 1, 'ACTIVE'),
('ELEC-GAM-010234', @ElecID, '2023-04-20', 1, 'ACTIVE'),
('ELEC-BOR-011345', @ElecID, '2018-12-03', 0, 'ACTIVE'),
('ELEC-DEH-012456', @ElecID, '2016-08-14', 0, 'FAULTY'),

-- Water Meters
('WATER-COL-W01234', @WaterID, '2020-04-01', 0, 'ACTIVE'),
('WATER-NUG-W02345', @WaterID, '2021-03-15', 0, 'ACTIVE'),
('WATER-MLV-W03456', @WaterID, '2019-08-20', 0, 'ACTIVE'),
('WATER-KDY-W04567', @WaterID, '2022-02-10', 1, 'ACTIVE'),
('WATER-GAL-W05678', @WaterID, '2020-11-05', 0, 'ACTIVE');
GO

DECLARE @ElecID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'ELEC');
DECLARE @WaterID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'WATER');
DECLARE @GasID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'GAS');
DECLARE @TariffCat1 BIGINT = (SELECT tariff_category_id FROM dbo.TariffCategory WHERE code = 'DOM-ELEC-1');
DECLARE @TariffCat2 BIGINT = (SELECT tariff_category_id FROM dbo.TariffCategory WHERE code = 'DOM-ELEC-2');
DECLARE @TariffCat5 BIGINT = (SELECT tariff_category_id FROM dbo.TariffCategory WHERE code = 'DOM-WATER');

-- Service Connections
INSERT INTO dbo.ServiceConnection (customer_id, utility_type_id, tariff_category_id, connection_status, connection_date, meter_id, connection_address_id, node_id) VALUES
-- Electricity connections
(1, @ElecID, @TariffCat1, 'ACTIVE', '2020-03-15', 1, 1, 1),
(2, @ElecID, @TariffCat1, 'ACTIVE', '2019-07-22', 2, 2, 1),
(3, @ElecID, @TariffCat2, 'ACTIVE', '2021-02-10', 3, 3, 2),
(4, @ElecID, @TariffCat1, 'ACTIVE', '2018-11-05', 4, 4, 3),
(5, @ElecID, @TariffCat1, 'ACTIVE', '2020-08-18', 5, 5, 1),
(6, @ElecID, @TariffCat2, 'ACTIVE', '2017-05-30', 6, 6, NULL),
(7, @ElecID, @TariffCat1, 'ACTIVE', '2022-01-12', 7, 7, 4),
(8, @ElecID, @TariffCat1, 'ACTIVE', '2019-09-25', 8, 8, 4),
(9, @ElecID, (SELECT tariff_category_id FROM dbo.TariffCategory WHERE code = 'IND-ELEC'), 'ACTIVE', '2015-03-01', 9, 9, NULL),
(10, @ElecID, @TariffCat1, 'ACTIVE', '2020-06-15', 10, 10, 1),
(11, @ElecID, @TariffCat2, 'ACTIVE', '2021-11-08', 11, 11, 1),
(12, @ElecID, (SELECT tariff_category_id FROM dbo.TariffCategory WHERE code = 'GOV-ELEC'), 'ACTIVE', '2010-01-01', 12, 12, NULL),
(13, @ElecID, @TariffCat1, 'ACTIVE', '2023-04-20', 13, 13, NULL),
(14, @ElecID, @TariffCat1, 'ACTIVE', '2018-12-03', 14, 14, 1),
(15, @ElecID, @TariffCat2, 'DISCONNECTED', '2016-08-14', 15, 15, 3),

-- Water connections
(1, @WaterID, @TariffCat5, 'ACTIVE', '2020-04-01', 16, 1, 6),
(3, @WaterID, @TariffCat5, 'ACTIVE', '2021-03-15', 17, 3, 8),
(4, @WaterID, @TariffCat5, 'ACTIVE', '2019-08-20', 18, 4, 8),
(7, @WaterID, @TariffCat5, 'ACTIVE', '2022-02-10', 19, 7, 9),
(9, @WaterID, (SELECT tariff_category_id FROM dbo.TariffCategory WHERE code = 'IND-WATER'), 'ACTIVE', '2015-03-15', 20, 9, NULL);
GO

-- Meter Readings (Recent readings for December 2025 - January 2026)
DECLARE @MeterReader1 BIGINT = (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP009');
DECLARE @MeterReader2 BIGINT = (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP010');

INSERT INTO dbo.MeterReading (reading_source, reading_date, reading_status, import_reading, prev_import_reading, export_reading, prev_export_reading, created_at, device_id, meter_id, meter_reader_id) VALUES
-- December 2025 readings
('MANUAL', '2025-12-05 10:30:00', 'VERIFIED', 15420.50, 15285.00, NULL, NULL, '2025-12-05 10:30:00', 'MR-DEVICE-001', 1, @MeterReader1),
('MANUAL', '2025-12-06 14:15:00', 'VERIFIED', 8734.20, 8612.50, NULL, NULL, '2025-12-06 14:15:00', 'MR-DEVICE-001', 2, @MeterReader1),
('SMART_METER', '2025-12-05 00:00:00', 'VERIFIED', 22567.80, 22398.30, NULL, NULL, '2025-12-05 00:05:00', NULL, 3, NULL),
('MANUAL', '2025-12-07 09:45:00', 'VERIFIED', 12890.40, 12776.00, NULL, NULL, '2025-12-07 09:45:00', 'MR-DEVICE-002', 4, @MeterReader2),
('SMART_METER', '2025-12-06 00:00:00', 'VERIFIED', 9876.50, 9731.00, 45.20, 38.50, '2025-12-06 00:05:00', NULL, 5, NULL),
('MANUAL', '2025-12-08 11:20:00', 'VERIFIED', 18234.70, 18056.20, NULL, NULL, '2025-12-08 11:20:00', 'MR-DEVICE-001', 6, @MeterReader1),
('SMART_METER', '2025-12-05 00:00:00', 'VERIFIED', 5432.10, 5367.80, NULL, NULL, '2025-12-05 00:05:00', NULL, 7, NULL),
('MANUAL', '2025-12-09 15:30:00', 'VERIFIED', 7654.30, 7589.20, NULL, NULL, '2025-12-09 15:30:00', 'MR-DEVICE-002', 8, @MeterReader2),
('SMART_METER', '2025-12-06 00:00:00', 'VERIFIED', 145678.90, 143256.40, NULL, NULL, '2025-12-06 00:05:00', NULL, 9, NULL),
('SMART_METER', '2025-12-07 00:00:00', 'VERIFIED', 11234.60, 11098.30, NULL, NULL, '2025-12-07 00:05:00', NULL, 10, NULL),

-- January 2026 readings
('MANUAL', '2026-01-05 10:15:00', 'VERIFIED', 15562.80, 15420.50, NULL, NULL, '2026-01-05 10:15:00', 'MR-DEVICE-001', 1, @MeterReader1),
('MANUAL', '2026-01-06 13:45:00', 'VERIFIED', 8856.70, 8734.20, NULL, NULL, '2026-01-06 13:45:00', 'MR-DEVICE-001', 2, @MeterReader1),
('SMART_METER', '2026-01-05 00:00:00', 'VERIFIED', 22742.30, 22567.80, NULL, NULL, '2026-01-05 00:05:00', NULL, 3, NULL),
('MANUAL', '2026-01-07 09:20:00', 'VERIFIED', 13008.90, 12890.40, NULL, NULL, '2026-01-07 09:20:00', 'MR-DEVICE-002', 4, @MeterReader2),
('SMART_METER', '2026-01-06 00:00:00', 'VERIFIED', 10025.30, 9876.50, 52.40, 45.20, '2026-01-06 00:05:00', NULL, 5, NULL);
GO

-- ============================================================
-- 4) BILLING & PAYMENTS
-- ============================================================

-- Tax Configuration
INSERT INTO dbo.TaxConfig (tax_name, rate_percent, effective_from, effective_to, status) VALUES
('VAT', 15.000, '2024-01-01', NULL, 'ACTIVE'),
('Nation Building Tax', 2.000, '2024-01-01', NULL, 'ACTIVE'),
('Cess', 0.500, '2024-01-01', NULL, 'ACTIVE');
GO

-- Bills for December 2025
INSERT INTO dbo.Bill (meter_id, billing_period_start, billing_period_end, bill_date, due_date, total_import_unit, total_export_unit, energy_charge_amount, fixed_charge_amount, subsidy_amount, solar_export_credit) VALUES
-- Regular domestic bills
(1, '2025-11-05', '2025-12-05', '2025-12-08', '2025-12-28', 135.50, 0.00, 3150.00, 60.00, 200.00, 0.00),
(2, '2025-11-06', '2025-12-06', '2025-12-09', '2025-12-29', 121.70, 0.00, 2785.00, 60.00, 180.00, 0.00),
(3, '2025-11-05', '2025-12-05', '2025-12-08', '2025-12-28', 169.50, 0.00, 5520.00, 100.00, 0.00, 0.00),
(4, '2025-11-07', '2025-12-07', '2025-12-10', '2025-12-30', 114.40, 0.00, 2640.00, 60.00, 170.00, 0.00),
(5, '2025-11-06', '2025-12-06', '2025-12-09', '2025-12-29', 145.50, 6.70, 3680.00, 60.00, 220.00, 50.40),
(6, '2025-11-08', '2025-12-08', '2025-12-11', '2025-12-31', 178.50, 0.00, 5870.00, 100.00, 0.00, 0.00),
(7, '2025-11-05', '2025-12-05', '2025-12-08', '2025-12-28', 64.30, 0.00, 1250.00, 30.00, 100.00, 0.00),
(8, '2025-11-09', '2025-12-09', '2025-12-12', '2026-01-01', 65.10, 0.00, 1270.00, 30.00, 100.00, 0.00),
-- Industrial bill
(9, '2025-11-06', '2025-12-06', '2025-12-09', '2025-12-29', 2422.50, 0.00, 145350.00, 5000.00, 0.00, 0.00),
-- Government bill
(12, '2025-11-01', '2025-12-01', '2025-12-05', '2025-12-25', 3456.70, 0.00, 189850.00, 8000.00, 0.00, 0.00),

-- Water bills
(16, '2025-11-01', '2025-12-01', '2025-12-05', '2025-12-25', 28.50, 0.00, 1175.00, 150.00, 150.00, 0.00),
(17, '2025-11-01', '2025-12-01', '2025-12-05', '2025-12-25', 35.80, 0.00, 1648.00, 150.00, 180.00, 0.00),
(18, '2025-11-01', '2025-12-01', '2025-12-05', '2025-12-25', 42.30, 0.00, 2098.00, 150.00, 200.00, 0.00);
GO

DECLARE @TariffCat1 BIGINT = (SELECT tariff_category_id FROM dbo.TariffCategory WHERE code = 'DOM-ELEC-1');
DECLARE @TariffCat2 BIGINT = (SELECT tariff_category_id FROM dbo.TariffCategory WHERE code = 'DOM-ELEC-2');
DECLARE @TariffCat5 BIGINT = (SELECT tariff_category_id FROM dbo.TariffCategory WHERE code = 'DOM-WATER');

-- Bill Details (Slab breakdown for first bill)
DECLARE @Bill1 BIGINT = (SELECT bill_id FROM dbo.Bill WHERE meter_id = 1 AND billing_period_start = '2025-11-05');
DECLARE @Slab1 BIGINT = (SELECT slab_id FROM dbo.TariffSlab WHERE tariff_category_id = @TariffCat1 AND from_unit = 0);
DECLARE @Slab2 BIGINT = (SELECT slab_id FROM dbo.TariffSlab WHERE tariff_category_id = @TariffCat1 AND from_unit = 31);
DECLARE @Slab3 BIGINT = (SELECT slab_id FROM dbo.TariffSlab WHERE tariff_category_id = @TariffCat1 AND from_unit = 61);
DECLARE @Slab4 BIGINT = (SELECT slab_id FROM dbo.TariffSlab WHERE tariff_category_id = @TariffCat1 AND from_unit = 91);
DECLARE @Slab5 BIGINT = (SELECT slab_id FROM dbo.TariffSlab WHERE tariff_category_id = @TariffCat1 AND from_unit = 121);

INSERT INTO dbo.BillDetail (bill_id, slab_id, units_in_slab, amount) VALUES
(@Bill1, @Slab1, 30.00, 240.00),    -- 0-30 @ 8.00
(@Bill1, @Slab2, 30.00, 360.00),    -- 31-60 @ 12.00
(@Bill1, @Slab3, 30.00, 750.00),    -- 61-90 @ 25.00
(@Bill1, @Slab4, 30.00, 1050.00),   -- 91-120 @ 35.00
(@Bill1, @Slab5, 15.50, 775.00);    -- 121+ @ 50.00
GO

-- Bill Taxes
DECLARE @VAT_ID BIGINT = (SELECT tax_id FROM dbo.TaxConfig WHERE tax_name = 'VAT');

INSERT INTO dbo.BillTax (bill_id, tax_id, rate_percent_applied, taxable_base_amount) VALUES
(1, @VAT_ID, 15.000, 3010.00),  -- (3150 + 60 - 200)
(2, @VAT_ID, 15.000, 2665.00),
(3, @VAT_ID, 15.000, 5620.00),
(9, @VAT_ID, 15.000, 150350.00),
(10, @VAT_ID, 15.000, 197850.00);
GO

-- Payments
DECLARE @Cashier1 BIGINT = (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP012');
DECLARE @Cashier2 BIGINT = (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP013');

INSERT INTO dbo.Payment (payment_date, payment_amount, payment_method, payment_channel, payment_status, transaction_ref, bill_id, connection_id, employee_id, customer_id) VALUES
('2025-12-15 10:30:00', 3461.50, 'CASH', 'COUNTER', 'COMPLETED', 'PAY-2025-001234', 1, 1, @Cashier1, 1),
('2025-12-16 14:20:00', 3065.75, 'CARD', 'COUNTER', 'COMPLETED', 'PAY-2025-001235', 2, 2, @Cashier1, 2),
('2025-12-18 09:15:00', 6463.00, 'BANK_TRANSFER', 'ONLINE', 'COMPLETED', 'TXN-BOC-123456', 3, 3, NULL, 3),
('2025-12-20 11:45:00', 2853.00, 'CASH', 'COUNTER', 'COMPLETED', 'PAY-2025-001236', 4, 4, @Cashier2, 4),
('2025-12-17 16:30:00', 3919.60, 'ONLINE', 'MOBILE_APP', 'COMPLETED', 'APP-2025-987654', 5, 5, NULL, 5),
('2025-12-22 10:00:00', 6750.50, 'CARD', 'COUNTER', 'COMPLETED', 'PAY-2025-001237', 6, 6, @Cashier1, 6),
('2025-12-14 08:30:00', 1265.00, 'CASH', 'COUNTER', 'COMPLETED', 'PAY-2025-001238', 7, 7, @Cashier2, 7),
('2025-12-28 15:45:00', 172902.50, 'BANK_TRANSFER', 'BANK', 'COMPLETED', 'TXN-COM-567890', 9, 9, NULL, 9),
-- Water bill payments
('2025-12-10 09:30:00', 1381.25, 'CASH', 'COUNTER', 'COMPLETED', 'PAY-2025-001239', 11, 16, @Cashier1, 1),
('2025-12-12 13:20:00', 1847.20, 'CARD', 'COUNTER', 'COMPLETED', 'PAY-2025-001240', 12, 17, @Cashier2, 3);
GO

-- Bill Adjustments
INSERT INTO dbo.BillAdjustment (bill_id, adjustment_type, adjustment_amount, adjustment_reason, adjustment_date, employee_id) VALUES
(2, 'CREDIT', 120.00, 'Meter reading correction - actual consumption was lower', '2025-12-17', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP004')),
(5, 'CREDIT', 50.00, 'Good customer discount for solar installation', '2025-12-16', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP002'));
GO

-- ============================================================
-- 5) SUBSIDIES & SOLAR
-- ============================================================

-- Subsidy Schemes
INSERT INTO dbo.SubsidyScheme (name, description, discount_type, discount_value, valid_from, valid_to) VALUES
('Low Income Electricity Subsidy', 'Subsidy for households consuming less than 90 units per month', 'PERCENTAGE', 15.00, '2024-01-01', NULL),
('Samurdhi Beneficiary Discount', 'Additional discount for Samurdhi beneficiaries', 'FIXED_AMOUNT', 200.00, '2024-01-01', NULL),
('Water Supply Subsidy - Rural', 'Subsidy for rural water connections', 'PERCENTAGE', 20.00, '2024-01-01', NULL),
('Senior Citizen Discount', 'Discount for senior citizens above 65 years', 'PERCENTAGE', 10.00, '2024-01-01', NULL);
GO

-- Customer Subsidies
DECLARE @Subsidy1 BIGINT = (SELECT subsidy_id FROM dbo.SubsidyScheme WHERE name = 'Low Income Electricity Subsidy');
DECLARE @Subsidy2 BIGINT = (SELECT subsidy_id FROM dbo.SubsidyScheme WHERE name = 'Samurdhi Beneficiary Discount');
DECLARE @Subsidy3 BIGINT = (SELECT subsidy_id FROM dbo.SubsidyScheme WHERE name = 'Water Supply Subsidy - Rural');

INSERT INTO dbo.CustomerSubsidy (subsidy_id, customer_id, employee_id, approved_date, status) VALUES
(@Subsidy1, 1, (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP004'), '2020-03-20', 'ACTIVE'),
(@Subsidy1, 2, (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP004'), '2019-08-01', 'ACTIVE'),
(@Subsidy2, 4, (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP004'), '2018-11-15', 'ACTIVE'),
(@Subsidy1, 7, (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP004'), '2022-01-20', 'ACTIVE'),
(@Subsidy3, 1, (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP003'), '2020-04-10', 'ACTIVE');
GO
DECLARE @Subsidy1 BIGINT = (SELECT subsidy_id FROM dbo.SubsidyScheme WHERE name = 'Low Income Electricity Subsidy');
DECLARE @Subsidy2 BIGINT = (SELECT subsidy_id FROM dbo.SubsidyScheme WHERE name = 'Samurdhi Beneficiary Discount');
DECLARE @Subsidy3 BIGINT = (SELECT subsidy_id FROM dbo.SubsidyScheme WHERE name = 'Water Supply Subsidy - Rural');

-- Subsidy Approvers
INSERT INTO dbo.SubsidyApprove (employee_id, subsidy_id) VALUES
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP004'), @Subsidy1),
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP004'), @Subsidy2),
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP002'), @Subsidy1),
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP003'), @Subsidy3);
GO

-- Solar Installations
INSERT INTO dbo.SolarInstallation (meter_id, connection_id, scheme_type, installation_date, installation_capacity_kw, installer_company, approval_ref, agreement_start_date, agreement_end_date, status, employee_id) VALUES
(5, 5, 'NET_METERING', '2024-06-15', 3.50, 'Solar Lanka (Pvt) Ltd', 'SL-NET-2024-0045', '2024-06-15', '2044-06-15', 'ACTIVE', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP019')),
(10, 10, 'NET_METERING', '2023-09-20', 2.80, 'Green Energy Solutions', 'SL-NET-2023-0123', '2023-09-20', '2043-09-20', 'ACTIVE', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP019'));
GO

-- ============================================================
-- 6) GENERATION & STORAGE
-- ============================================================
DECLARE @ElecID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'ELEC');
DECLARE @WaterID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'WATER');
DECLARE @GasID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'GAS');
-- Item Categories
INSERT INTO dbo.ItemCategory (name, category_type, utility_type_id) VALUES
-- Electricity items
('Electrical Spare Parts', 'SPARE_PART', @ElecID),
('Electrical Tools', 'TOOL', @ElecID),
('Transformer Components', 'SPARE_PART', @ElecID),
('Safety Equipment', 'TOOL', @ElecID),

-- Water items
('Water Treatment Chemicals', 'CHEMICAL', @WaterID),
('Water Pipe Fittings', 'SPARE_PART', @WaterID),
('Pump Parts', 'SPARE_PART', @WaterID),
('Water Quality Testing Supplies', 'CONSUMABLE', @WaterID),

-- Fuel and general
('Diesel Fuel', 'FUEL', NULL),
('Lubricants', 'CONSUMABLE', NULL),
('General Maintenance Supplies', 'CONSUMABLE', NULL);
GO

-- Items
INSERT INTO dbo.Item (name, uom, standard_unit_cost, item_category_id, is_consumable, shelf_life_days, hazard_class, storage_requirements) VALUES
-- Electrical items
('33kV Circuit Breaker', 'UNIT', 450000.00, 1, 0, NULL, NULL, 'Keep dry, store indoors'),
('11kV Transformer Oil', 'LITER', 850.00, 3, 1, 1825, 'Class 3 Flammable', 'Store in approved containers, cool area'),
('Distribution Transformer 100kVA', 'UNIT', 850000.00, 3, 0, NULL, NULL, 'Indoor storage, vertical position'),
('Insulated Cables 25mm²', 'METER', 450.00, 1, 1, NULL, NULL, 'Protect from sunlight'),
('Safety Helmets', 'UNIT', 1200.00, 4, 0, NULL, NULL, 'Room temperature'),
('Insulated Gloves 11kV', 'PAIR', 2500.00, 4, 0, 730, NULL, 'Dry storage'),
('Voltage Tester', 'UNIT', 15000.00, 2, 0, NULL, NULL, 'Store in cases'),

-- Water items
('Chlorine Gas Cylinders', 'CYLINDER', 12500.00, 5, 1, 365, 'Class 2.3 Toxic Gas', 'Secure outdoor storage, well ventilated'),
('Alum (Aluminum Sulfate)', 'KG', 85.00, 5, 1, 730, NULL, 'Keep dry'),
('PVC Pipes 110mm', 'METER', 650.00, 6, 0, NULL, NULL, 'Store flat, away from heat'),
('Centrifugal Pump Impeller', 'UNIT', 35000.00, 7, 0, NULL, NULL, 'Indoor storage'),
('Water Quality Test Kits', 'KIT', 8500.00, 8, 1, 365, NULL, 'Store at room temperature'),
('Gate Valves 150mm', 'UNIT', 28000.00, 6, 0, NULL, NULL, 'Store indoors'),

-- Fuel and general
('Diesel Fuel', 'LITER', 285.00, 9, 1, 180, 'Class 3 Flammable', 'Approved fuel tanks only'),
('Engine Oil 15W-40', 'LITER', 950.00, 10, 1, 1095, NULL, 'Store sealed containers'),
('Grease', 'KG', 450.00, 10, 1, 730, NULL, 'Room temperature'),
('Cable Ties', 'PACK', 250.00, 11, 1, NULL, NULL, 'Normal storage'),
('Duct Tape', 'ROLL', 180.00, 11, 1, 1095, NULL, 'Room temperature');
GO

-- Site Storage Locations
INSERT INTO dbo.SiteStorageLocation (storage_type, name, status, item_id, capacity_uom, capacity_qty) VALUES
('FUEL_TANK', 'Colombo Grid Diesel Storage', 'OPERATIONAL', (SELECT item_id FROM dbo.Item WHERE name = 'Diesel Fuel'), 'LITER', 50000.00),
('CHEMICAL_TANK', 'Ambatale Chlorine Storage', 'OPERATIONAL', (SELECT item_id FROM dbo.Item WHERE name = 'Chlorine Gas Cylinders'), 'CYLINDER', 50.00),
('WAREHOUSE', 'Kandy Oil Storage', 'OPERATIONAL', (SELECT item_id FROM dbo.Item WHERE name = '11kV Transformer Oil'), 'LITER', 10000.00);
GO
DECLARE @ElecID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'ELEC');
DECLARE @WaterID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'WATER');
DECLARE @GasID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'GAS');
-- Generation Sites
INSERT INTO dbo.GenerationSite (name, site_type, status, commissioned_date, nameplate_capacity, capacity_uom, utility_type_id, storage_location_id) VALUES
-- Electricity generation
('Kelanitissa Power Station', 'THERMAL', 'OPERATIONAL', '1992-08-01', 165.00, 'MW', @ElecID, 1),
('Victoria Hydropower Plant', 'HYDRO', 'OPERATIONAL', '1985-04-15', 210.00, 'MW', @ElecID, NULL),
('Norochcholai Coal Power Plant', 'THERMAL', 'OPERATIONAL', '2011-03-20', 900.00, 'MW', @ElecID, NULL),

-- Water treatment
('Ambatale Water Treatment Plant', 'WATER_TREATMENT', 'OPERATIONAL', '1985-06-01', 180000.00, 'cu.m/day', @WaterID, 2),
('Labugama Reservoir', 'RESERVOIR', 'OPERATIONAL', '1968-03-15', 1500000.00, 'cu.m', @WaterID, NULL),
('Kandy Water Treatment Plant', 'WATER_TREATMENT', 'OPERATIONAL', '1995-09-10', 45000.00, 'cu.m/day', @WaterID, 3);
GO

-- Generation Units
DECLARE @GenSite1 BIGINT = (SELECT generation_site_id FROM dbo.GenerationSite WHERE name = 'Kelanitissa Power Station');
DECLARE @GenSite2 BIGINT = (SELECT generation_site_id FROM dbo.GenerationSite WHERE name = 'Victoria Hydropower Plant');
DECLARE @GenSite4 BIGINT = (SELECT generation_site_id FROM dbo.GenerationSite WHERE name = 'Ambatale Water Treatment Plant');

INSERT INTO dbo.GenerationUnit (generation_site_id, status, capacity_uom, unit_capacity) VALUES
-- Kelanitissa units
(@GenSite1, 'OPERATIONAL', 'MW', 55.00),
(@GenSite1, 'OPERATIONAL', 'MW', 55.00),
(@GenSite1, 'OPERATIONAL', 'MW', 55.00),

-- Victoria units
(@GenSite2, 'OPERATIONAL', 'MW', 70.00),
(@GenSite2, 'OPERATIONAL', 'MW', 70.00),
(@GenSite2, 'OPERATIONAL', 'MW', 70.00),

-- Ambatale pumps
(@GenSite4, 'OPERATIONAL', 'cu.m/hr', 7500.00),
(@GenSite4, 'OPERATIONAL', 'cu.m/hr', 7500.00),
(@GenSite4, 'MAINTENANCE', 'cu.m/hr', 7500.00);
GO

-- Generation Output Readings
INSERT INTO dbo.GenerationOutputReading (generation_unit_id, reading_ts, output_value, output_uom, quality_flag) VALUES
-- Recent electricity generation
(1, '2026-01-10 00:00:00', 54.2, 'MW', 'NORMAL'),
(1, '2026-01-10 01:00:00', 53.8, 'MW', 'NORMAL'),
(1, '2026-01-10 02:00:00', 54.5, 'MW', 'NORMAL'),
(2, '2026-01-10 00:00:00', 54.8, 'MW', 'NORMAL'),
(2, '2026-01-10 01:00:00', 55.0, 'MW', 'NORMAL'),
(4, '2026-01-10 00:00:00', 68.5, 'MW', 'NORMAL'),
(4, '2026-01-10 01:00:00', 69.2, 'MW', 'NORMAL'),

-- Water treatment output
(7, '2026-01-10 06:00:00', 7450.0, 'cu.m/hr', 'NORMAL'),
(7, '2026-01-10 12:00:00', 7480.0, 'cu.m/hr', 'NORMAL'),
(8, '2026-01-10 06:00:00', 7420.0, 'cu.m/hr', 'NORMAL'),
(8, '2026-01-10 12:00:00', 7500.0, 'cu.m/hr', 'NORMAL');
GO

DECLARE @GenSite1 BIGINT = (SELECT generation_site_id FROM dbo.GenerationSite WHERE name = 'Kelanitissa Power Station');
DECLARE @GenSite2 BIGINT = (SELECT generation_site_id FROM dbo.GenerationSite WHERE name = 'Victoria Hydropower Plant');
DECLARE @GenSite4 BIGINT = (SELECT generation_site_id FROM dbo.GenerationSite WHERE name = 'Ambatale Water Treatment Plant');

-- Operation Runs
INSERT INTO dbo.OperationRun (generation_site_id, generation_unit_id, start_ts, end_ts, output_qty, output_uom, run_status, notes) VALUES
(@GenSite1, 1, '2026-01-10 00:00:00', '2026-01-10 23:59:59', 1305.6, 'MWh', 'COMPLETED', 'Normal daily operation'),
(@GenSite1, 2, '2026-01-10 00:00:00', '2026-01-10 23:59:59', 1315.2, 'MWh', 'COMPLETED', 'Normal daily operation'),
(@GenSite4, 7, '2026-01-10 00:00:00', '2026-01-10 23:59:59', 178800.0, 'cu.m', 'COMPLETED', 'Normal water treatment'),
(@GenSite4, 8, '2026-01-10 00:00:00', '2026-01-10 23:59:59', 179400.0, 'cu.m', 'COMPLETED', 'Normal water treatment');
GO
DECLARE @GenSite1 BIGINT = (SELECT generation_site_id FROM dbo.GenerationSite WHERE name = 'Kelanitissa Power Station');
DECLARE @GenSite2 BIGINT = (SELECT generation_site_id FROM dbo.GenerationSite WHERE name = 'Victoria Hydropower Plant');
DECLARE @GenSite4 BIGINT = (SELECT generation_site_id FROM dbo.GenerationSite WHERE name = 'Ambatale Water Treatment Plant');

-- Water Quality Tests
INSERT INTO dbo.WaterQualityTest (generation_site_id, sample_ts, parameter, value, uom) VALUES
(@GenSite4, '2026-01-10 08:00:00', 'pH', 7.35, 'pH'),
(@GenSite4, '2026-01-10 08:00:00', 'Turbidity', 0.45, 'NTU'),
(@GenSite4, '2026-01-10 08:00:00', 'Chlorine Residual', 0.85, 'mg/L'),
(@GenSite4, '2026-01-10 08:00:00', 'Total Dissolved Solids', 245.0, 'mg/L'),
(@GenSite4, '2026-01-10 14:00:00', 'pH', 7.42, 'pH'),
(@GenSite4, '2026-01-10 14:00:00', 'Turbidity', 0.38, 'NTU'),
(@GenSite4, '2026-01-10 14:00:00', 'Chlorine Residual', 0.92, 'mg/L');
GO

-- ============================================================
-- 7) WAREHOUSE & INVENTORY
-- ============================================================

-- Warehouses
INSERT INTO dbo.Warehouse (name, status, geo_area_id) VALUES
('CEB Central Stores - Colombo', 'OPERATIONAL', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Colombo City')),
('CEB Regional Warehouse - Kandy', 'OPERATIONAL', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Kandy City')),
('NWSDB Central Stores - Ratmalana', 'OPERATIONAL', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Dehiwala-Mount Lavinia')),
('NWSDB Regional Store - Galle', 'OPERATIONAL', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Galle City'));
GO

-- Warehouse Stock
DECLARE @WH1 BIGINT = (SELECT warehouse_id FROM dbo.Warehouse WHERE name = 'CEB Central Stores - Colombo');
DECLARE @WH2 BIGINT = (SELECT warehouse_id FROM dbo.Warehouse WHERE name = 'CEB Regional Warehouse - Kandy');
DECLARE @WH3 BIGINT = (SELECT warehouse_id FROM dbo.Warehouse WHERE name = 'NWSDB Central Stores - Ratmalana');

INSERT INTO dbo.WarehouseStock (warehouse_id, item_id, on_hand_qty, reserved_qty, reorder_level, last_stocktake_ts) VALUES
-- CEB Colombo
(@WH1, (SELECT item_id FROM dbo.Item WHERE name = '33kV Circuit Breaker'), 12.00, 2.00, 5.00, '2026-01-01 10:00:00'),
(@WH1, (SELECT item_id FROM dbo.Item WHERE name = '11kV Transformer Oil'), 2500.00, 150.00, 500.00, '2026-01-01 10:00:00'),
(@WH1, (SELECT item_id FROM dbo.Item WHERE name = 'Distribution Transformer 100kVA'), 8.00, 1.00, 3.00, '2026-01-01 10:00:00'),
(@WH1, (SELECT item_id FROM dbo.Item WHERE name = 'Insulated Cables 25mm²'), 15000.00, 500.00, 2000.00, '2026-01-01 10:00:00'),
(@WH1, (SELECT item_id FROM dbo.Item WHERE name = 'Safety Helmets'), 250.00, 0.00, 50.00, '2026-01-01 10:00:00'),
(@WH1, (SELECT item_id FROM dbo.Item WHERE name = 'Diesel Fuel'), 28500.00, 1000.00, 5000.00, '2026-01-10 08:00:00'),
(@WH1, (SELECT item_id FROM dbo.Item WHERE name = 'Engine Oil 15W-40'), 450.00, 20.00, 100.00, '2026-01-01 10:00:00'),

-- CEB Kandy
(@WH2, (SELECT item_id FROM dbo.Item WHERE name = 'Insulated Cables 25mm²'), 5000.00, 200.00, 1000.00, '2025-12-28 14:00:00'),
(@WH2, (SELECT item_id FROM dbo.Item WHERE name = 'Safety Helmets'), 120.00, 0.00, 30.00, '2025-12-28 14:00:00'),
(@WH2, (SELECT item_id FROM dbo.Item WHERE name = 'Voltage Tester'), 15.00, 2.00, 5.00, '2025-12-28 14:00:00'),

-- NWSDB Ratmalana
(@WH3, (SELECT item_id FROM dbo.Item WHERE name = 'Chlorine Gas Cylinders'), 35.00, 5.00, 10.00, '2026-01-05 09:00:00'),
(@WH3, (SELECT item_id FROM dbo.Item WHERE name = 'Alum (Aluminum Sulfate)'), 8500.00, 200.00, 1000.00, '2026-01-05 09:00:00'),
(@WH3, (SELECT item_id FROM dbo.Item WHERE name = 'PVC Pipes 110mm'), 2500.00, 150.00, 500.00, '2026-01-05 09:00:00'),
(@WH3, (SELECT item_id FROM dbo.Item WHERE name = 'Centrifugal Pump Impeller'), 18.00, 3.00, 5.00, '2026-01-05 09:00:00'),
(@WH3, (SELECT item_id FROM dbo.Item WHERE name = 'Gate Valves 150mm'), 42.00, 4.00, 10.00, '2026-01-05 09:00:00');
GO

-- ============================================================
-- 8) ASSETS & MAINTENANCE
-- ============================================================
DECLARE @ElecID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'ELEC');
DECLARE @WaterID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'WATER');
DECLARE @GasID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'GAS');
-- Assets
INSERT INTO dbo.Asset (name, asset_type, status, utility_type_id) VALUES
-- Electrical assets
('Colombo Grid 33/11kV Transformer T1', 'TRANSFORMER', 'OPERATIONAL', @ElecID),
('Colombo Grid 33/11kV Transformer T2', 'TRANSFORMER', 'OPERATIONAL', @ElecID),
('Nugegoda Substation Breaker CB-01', 'CIRCUIT_BREAKER', 'OPERATIONAL', @ElecID),
('Dehiwala Distribution Transformer DT-045', 'TRANSFORMER', 'OPERATIONAL', @ElecID),
('Kandy Main Substation Breaker CB-M1', 'CIRCUIT_BREAKER', 'OPERATIONAL', @ElecID),

-- Water assets
('Ambatale Chlorine Dosing Pump P1', 'PUMP', 'OPERATIONAL', @WaterID),
('Ambatale Chlorine Dosing Pump P2', 'PUMP', 'OPERATIONAL', @WaterID),
('Ambatale High Lift Pump HL-3', 'PUMP', 'MAINTENANCE', @WaterID),
('Bolgoda Booster Pump Station Unit 1', 'PUMP', 'OPERATIONAL', @WaterID),
('Kandy Main Valve MV-234', 'VALVE', 'OPERATIONAL', @WaterID);
GO

-- Asset Outages
INSERT INTO dbo.AssetOutage (asset_id, outage_type, start_ts, end_ts, reason, derate_percent) VALUES
(3, 'PLANNED', '2025-12-20 01:00:00', '2025-12-20 05:00:00', 'Scheduled maintenance - annual inspection', NULL),
(8, 'UNPLANNED', '2026-01-08 14:30:00', NULL, 'Motor bearing failure - under repair', NULL),
(1, 'DERATE', '2026-01-05 10:00:00', '2026-01-05 18:00:00', 'Cooling system partial failure', 25.00);
GO

DECLARE @ElecID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'ELEC');
DECLARE @WaterID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'WATER');
DECLARE @GasID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'GAS');
-- Maintenance Requests
INSERT INTO dbo.MaintenanceRequest (requested_by_customer_id, request_ts, priority, issue_type, description, geo_area_id, utility_type_id) VALUES
-- Customer complaints
(2, '2026-01-09 08:30:00', 'HIGH', 'OUTAGE', 'Complete power outage in the area since 7:00 AM', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Colombo City'), @ElecID),
(4, '2026-01-08 15:45:00', 'MEDIUM', 'VOLTAGE_FLUCTUATION', 'Voltage fluctuations causing appliance issues', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Dehiwala-Mount Lavinia'), @ElecID),
(7, '2026-01-10 09:15:00', 'LOW', 'METER_ISSUE', 'Smart meter display not working', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Kandy City'), @ElecID),
(1, '2026-01-07 11:20:00', 'MEDIUM', 'LOW_PRESSURE', 'Very low water pressure for the past 3 days', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Colombo City'), @WaterID),
(3, '2026-01-06 16:30:00', 'HIGH', 'LEAKAGE', 'Major water leak on the main road near house', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Nugegoda'), @WaterID),

-- System-generated
(NULL, '2026-01-08 14:30:00', 'CRITICAL', 'EQUIPMENT_FAILURE', 'High lift pump HL-3 motor failure detected', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Colombo City'), @WaterID),
(NULL, '2026-01-05 10:00:00', 'HIGH', 'EQUIPMENT_FAULT', 'Transformer T1 cooling system malfunction', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Colombo City'), @ElecID);
GO

-- Work Orders
DECLARE @Req1 BIGINT = (SELECT request_id FROM dbo.MaintenanceRequest WHERE description LIKE 'Complete power outage%');
DECLARE @Req2 BIGINT = (SELECT request_id FROM dbo.MaintenanceRequest WHERE description LIKE 'Voltage fluctuations%');
DECLARE @Req4 BIGINT = (SELECT request_id FROM dbo.MaintenanceRequest WHERE description LIKE 'Very low water pressure%');
DECLARE @Req5 BIGINT = (SELECT request_id FROM dbo.MaintenanceRequest WHERE description LIKE 'Major water leak%');
DECLARE @Req6 BIGINT = (SELECT request_id FROM dbo.MaintenanceRequest WHERE description LIKE 'High lift pump%');

INSERT INTO dbo.WorkOrder (request_id, asset_id, geo_area_id, opened_ts, scheduled_start_ts, scheduled_end_ts, closed_ts, work_order_status, resolution_notes) VALUES
-- Completed work orders
(@Req5, NULL, (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Nugegoda'), '2026-01-06 16:45:00', '2026-01-06 17:00:00', '2026-01-06 22:00:00', '2026-01-06 21:30:00', 'COMPLETED', 'Replaced damaged 110mm PVC pipe section. Leak repaired successfully.'),
(@Req4, 9, (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Colombo City'), '2026-01-07 11:30:00', '2026-01-07 14:00:00', '2026-01-07 18:00:00', '2026-01-07 17:15:00', 'COMPLETED', 'Booster pump pressure adjusted. System now operating normally.'),

-- In progress
(@Req6, 8, (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Colombo City'), '2026-01-08 15:00:00', '2026-01-09 08:00:00', '2026-01-11 17:00:00', NULL, 'IN_PROGRESS', NULL),
(@Req1, 3, (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Colombo City'), '2026-01-09 08:45:00', '2026-01-09 09:30:00', '2026-01-09 14:00:00', NULL, 'IN_PROGRESS', NULL),

-- Scheduled
(@Req2, 4, (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Dehiwala-Mount Lavinia'), '2026-01-08 16:00:00', '2026-01-11 08:00:00', '2026-01-11 16:00:00', NULL, 'SCHEDULED', NULL);
GO

-- Work Order Labor
DECLARE @WO1 BIGINT = (SELECT work_order_id FROM dbo.WorkOrder WHERE resolution_notes LIKE 'Replaced damaged 110mm%');
DECLARE @WO2 BIGINT = (SELECT work_order_id FROM dbo.WorkOrder WHERE resolution_notes LIKE 'Booster pump pressure%');

INSERT INTO dbo.WorkOrderLabor (work_order_id, work_date, hours, hourly_rate_snapshot) VALUES
(@WO1, '2026-01-06', 4.50, 850.00),
(@WO2, '2026-01-07', 3.25, 800.00);
GO

DECLARE @WO1 BIGINT = (SELECT work_order_id FROM dbo.WorkOrder WHERE resolution_notes LIKE 'Replaced damaged 110mm%');
DECLARE @WO2 BIGINT = (SELECT work_order_id FROM dbo.WorkOrder WHERE resolution_notes LIKE 'Booster pump pressure%');

-- Work Order Labor Employees
DECLARE @Labor1 BIGINT = (SELECT work_order_labor_id FROM dbo.WorkOrderLabor WHERE work_order_id = @WO1);
DECLARE @Labor2 BIGINT = (SELECT work_order_labor_id FROM dbo.WorkOrderLabor WHERE work_order_id = @WO2);

INSERT INTO dbo.WorkOrderLaborEmployee (work_order_labor_id, employee_id) VALUES
(@Labor1, (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP007')),
(@Labor1, (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP008')),
(@Labor2, (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP008'));
GO

DECLARE @WH1 BIGINT = (SELECT warehouse_id FROM dbo.Warehouse WHERE name = 'CEB Central Stores - Colombo');
DECLARE @WH2 BIGINT = (SELECT warehouse_id FROM dbo.Warehouse WHERE name = 'CEB Regional Warehouse - Kandy');
DECLARE @WH3 BIGINT = (SELECT warehouse_id FROM dbo.Warehouse WHERE name = 'NWSDB Central Stores - Ratmalana');
DECLARE @WO1 BIGINT = (SELECT work_order_id FROM dbo.WorkOrder WHERE resolution_notes LIKE 'Replaced damaged 110mm%');
DECLARE @WO2 BIGINT = (SELECT work_order_id FROM dbo.WorkOrder WHERE resolution_notes LIKE 'Booster pump pressure%');


-- Stock Transactions
INSERT INTO dbo.StockTransaction (txn_type, txn_ts, qty, unit_cost, warehouse_id, reference_type, reference_id) VALUES
-- Receipts (purchases/deliveries)
('RECEIPT', '2026-01-03 10:30:00', 500.00, 450.00, @WH1, 'PURCHASE_ORDER', 10001),
('RECEIPT', '2026-01-05 14:20:00', 1000.00, 85.00, @WH3, 'PURCHASE_ORDER', 10002),
('RECEIPT', '2026-01-08 09:15:00', 5000.00, 285.00, @WH1, 'FUEL_DELIVERY', 20001),

-- Issues (for work orders - will link below)
('ISSUE', '2026-01-06 17:30:00', 15.00, 650.00, @WH3, 'WORK_ORDER', @WO1),
('ISSUE', '2026-01-07 14:45:00', 2.50, 450.00, @WH1, 'WORK_ORDER', @WO2),

-- Adjustments
('ADJUSTMENT', '2026-01-05 16:00:00', -3.00, 1200.00, @WH1, 'STOCKTAKE', 30001),
('ADJUSTMENT', '2026-01-09 11:00:00', 5.00, 28000.00, @WH3, 'FOUND_STOCK', 30002);
GO

-- Work Order Item Usage
DECLARE @StockTxn4 BIGINT = (SELECT stock_txn_id FROM dbo.StockTransaction WHERE txn_type = 'ISSUE' AND qty = 15.00);
DECLARE @StockTxn5 BIGINT = (SELECT stock_txn_id FROM dbo.StockTransaction WHERE txn_type = 'ISSUE' AND qty = 2.50);
DECLARE @WH1 BIGINT = (SELECT warehouse_id FROM dbo.Warehouse WHERE name = 'CEB Central Stores - Colombo');
DECLARE @WH2 BIGINT = (SELECT warehouse_id FROM dbo.Warehouse WHERE name = 'CEB Regional Warehouse - Kandy');
DECLARE @WH3 BIGINT = (SELECT warehouse_id FROM dbo.Warehouse WHERE name = 'NWSDB Central Stores - Ratmalana');
DECLARE @WO1 BIGINT = (SELECT work_order_id FROM dbo.WorkOrder WHERE resolution_notes LIKE 'Replaced damaged 110mm%');
DECLARE @WO2 BIGINT = (SELECT work_order_id FROM dbo.WorkOrder WHERE resolution_notes LIKE 'Booster pump pressure%');


INSERT INTO dbo.WorkOrderItemUsage (work_order_id, item_id, warehouse_id, qty_used, unit_cost_snapshot, item_cost_amount, issued_ts, stock_txn_id) VALUES
(@WO1, (SELECT item_id FROM dbo.Item WHERE name = 'PVC Pipes 110mm'), @WH3, 15.00, 650.00, 9750.00, '2026-01-06 17:30:00', @StockTxn4),
(@WO2, (SELECT item_id FROM dbo.Item WHERE name = 'Grease'), @WH1, 2.50, 450.00, 1125.00, '2026-01-07 14:45:00', @StockTxn5);
GO
DECLARE @StockTxn4 BIGINT = (SELECT stock_txn_id FROM dbo.StockTransaction WHERE txn_type = 'ISSUE' AND qty = 15.00);
DECLARE @StockTxn5 BIGINT = (SELECT stock_txn_id FROM dbo.StockTransaction WHERE txn_type = 'ISSUE' AND qty = 2.50);
-- Update StockTransaction with work_order_item_usage_id (circular reference)
UPDATE dbo.StockTransaction
SET work_order_item_usage_id = (SELECT work_order_item_usage_id FROM dbo.WorkOrderItemUsage WHERE stock_txn_id = @StockTxn4)
WHERE stock_txn_id = @StockTxn4;

UPDATE dbo.StockTransaction
SET work_order_item_usage_id = (SELECT work_order_item_usage_id FROM dbo.WorkOrderItemUsage WHERE stock_txn_id = @StockTxn5)
WHERE stock_txn_id = @StockTxn5;
GO

DECLARE @StockTxn4 BIGINT = (SELECT stock_txn_id FROM dbo.StockTransaction WHERE txn_type = 'ISSUE' AND qty = 15.00);
DECLARE @StockTxn5 BIGINT = (SELECT stock_txn_id FROM dbo.StockTransaction WHERE txn_type = 'ISSUE' AND qty = 2.50);
-- Item Stock Transactions
INSERT INTO dbo.ItemStockTransaction (stock_txn_id, item_id) VALUES
(1, (SELECT item_id FROM dbo.Item WHERE name = 'Insulated Cables 25mm²')),
(2, (SELECT item_id FROM dbo.Item WHERE name = 'Alum (Aluminum Sulfate)')),
(3, (SELECT item_id FROM dbo.Item WHERE name = 'Diesel Fuel')),
(@StockTxn4, (SELECT item_id FROM dbo.Item WHERE name = 'PVC Pipes 110mm')),
(@StockTxn5, (SELECT item_id FROM dbo.Item WHERE name = 'Grease')),
(6, (SELECT item_id FROM dbo.Item WHERE name = 'Safety Helmets')),
(7, (SELECT item_id FROM dbo.Item WHERE name = 'Gate Valves 150mm'));
GO

-- Operation Input Consumption
DECLARE @OpRun1 BIGINT = (SELECT operation_run_id FROM dbo.OperationRun WHERE generation_unit_id = 1 AND start_ts = '2026-01-10 00:00:00');
DECLARE @OpRun3 BIGINT = (SELECT operation_run_id FROM dbo.OperationRun WHERE generation_unit_id = 7);

INSERT INTO dbo.OperationInputConsumption (operation_run_id, item_id, storage_location_id, qty_used, uom, unit_cost_snapshot, total_cost_amount, consumed_ts, stock_txn_id) VALUES
-- Fuel consumption for power generation
(@OpRun1, (SELECT item_id FROM dbo.Item WHERE name = 'Diesel Fuel'), 1, 1250.00, 'LITER', 285.00, 356250.00, '2026-01-10 12:00:00', NULL),

-- Chemical consumption for water treatment
(@OpRun3, (SELECT item_id FROM dbo.Item WHERE name = 'Chlorine Gas Cylinders'), 2, 0.85, 'CYLINDER', 12500.00, 10625.00, '2026-01-10 08:00:00', NULL),
(@OpRun3, (SELECT item_id FROM dbo.Item WHERE name = 'Alum (Aluminum Sulfate)'), NULL, 145.00, 'KG', 85.00, 12325.00, '2026-01-10 08:00:00', NULL);
GO

-- ============================================================
-- 9) FLEET MANAGEMENT
-- ============================================================

-- Vehicles
INSERT INTO dbo.Vehicle (vehicle_type, reg_no, fuel_type, make, model, purchase_date, capacity_notes, status, geo_area_id) VALUES
-- Utility vehicles
('PICKUP_TRUCK', 'WP-CAE-1234', 'DIESEL', 'Toyota', 'Hilux', '2018-03-15', 'Double cab, 1 ton capacity', 'OPERATIONAL', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Colombo City')),
('PICKUP_TRUCK', 'WP-CAF-5678', 'DIESEL', 'Mitsubishi', 'L200', '2019-07-20', 'Single cab, 1.5 ton capacity', 'OPERATIONAL', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Colombo City')),
('VAN', 'WP-CAG-9012', 'DIESEL', 'Toyota', 'KDH', '2020-02-10', 'Crew transport, 12 seats', 'OPERATIONAL', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Nugegoda')),
('BUCKET_TRUCK', 'WP-CAH-3456', 'DIESEL', 'Isuzu', 'NQR', '2017-09-25', 'Aerial platform 12m reach', 'OPERATIONAL', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Colombo City')),
('EXCAVATOR', 'CP-CAA-7890', 'DIESEL', 'Caterpillar', '320D', '2016-05-12', 'Medium excavator for pipe laying', 'OPERATIONAL', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Kandy City')),
('DUMP_TRUCK', 'WP-CAJ-2345', 'DIESEL', 'Hino', '500 Series', '2019-11-08', '6 ton capacity', 'OPERATIONAL', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Dehiwala-Mount Lavinia')),
('MOTORCYCLE', 'WP-CAK-6789', 'PETROL', 'Hero', 'Splendor', '2021-04-15', 'For meter readers', 'OPERATIONAL', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Colombo City')),
('PICKUP_TRUCK', 'SP-CAB-4567', 'DIESEL', 'Toyota', 'Hilux', '2015-08-20', 'Double cab, 1 ton capacity', 'MAINTENANCE', (SELECT geo_area_id FROM dbo.GeoArea WHERE name = 'Galle City'));
GO

-- Vehicle Service Events
DECLARE @Veh1 BIGINT = (SELECT vehicle_id FROM dbo.Vehicle WHERE reg_no = 'WP-CAE-1234');
DECLARE @Veh2 BIGINT = (SELECT vehicle_id FROM dbo.Vehicle WHERE reg_no = 'WP-CAF-5678');
DECLARE @Veh4 BIGINT = (SELECT vehicle_id FROM dbo.Vehicle WHERE reg_no = 'WP-CAH-3456');
DECLARE @Veh5 BIGINT = (SELECT vehicle_id FROM dbo.Vehicle WHERE reg_no = 'CP-CAA-7890');

INSERT INTO dbo.VehicleServiceEvent (vehicle_id, service_date, service_type, cost_amount, description, odometer) VALUES
(@Veh1, '2025-12-15', 'ROUTINE_SERVICE', 15500.00, 'Oil change, filter replacement, brake inspection', 85234),
(@Veh1, '2025-09-10', 'TIRE_REPLACEMENT', 42000.00, 'Four new tires installed', 78450),
(@Veh2, '2025-11-20', 'ROUTINE_SERVICE', 14800.00, 'Oil change, air filter, coolant top-up', 65890),
(@Veh4, '2025-10-05', 'REPAIR', 28500.00, 'Hydraulic pump repair', 45670),
(@Veh4, '2025-12-28', 'ROUTINE_SERVICE', 18900.00, 'Oil change, brake pad replacement', 48920),
(@Veh5, '2025-11-15', 'REPAIR', 125000.00, 'Track replacement, hydraulic cylinder repair', 3456);
GO
DECLARE @Veh1 BIGINT = (SELECT vehicle_id FROM dbo.Vehicle WHERE reg_no = 'WP-CAE-1234');
DECLARE @Veh2 BIGINT = (SELECT vehicle_id FROM dbo.Vehicle WHERE reg_no = 'WP-CAF-5678');
DECLARE @Veh4 BIGINT = (SELECT vehicle_id FROM dbo.Vehicle WHERE reg_no = 'WP-CAH-3456');
DECLARE @Veh5 BIGINT = (SELECT vehicle_id FROM dbo.Vehicle WHERE reg_no = 'CP-CAA-7890');
DECLARE @WO1 BIGINT = (SELECT work_order_id FROM dbo.WorkOrder WHERE resolution_notes LIKE 'Replaced damaged 110mm%');
DECLARE @WO2 BIGINT = (SELECT work_order_id FROM dbo.WorkOrder WHERE resolution_notes LIKE 'Booster pump pressure%');

-- Vehicle Assignments
INSERT INTO dbo.VehicleAssignment (vehicle_id, work_order_id, assigned_from_ts, assigned_to_ts, fuel_cost_amount, usage_notes) VALUES
-- Completed assignments
(@Veh2, @WO1, '2026-01-06 16:30:00', '2026-01-06 22:00:00', 1850.00, 'Used for pipe leak repair in Nugegoda'),
(@Veh1, @WO2, '2026-01-07 13:30:00', '2026-01-07 17:30:00', 1200.00, 'Pump station maintenance visit'),

-- Ongoing assignments
(@Veh4, (SELECT work_order_id FROM dbo.WorkOrder WHERE opened_ts = '2026-01-09 08:45:00'), '2026-01-09 09:00:00', NULL, 2500.00, 'Power restoration work - substation repair');
GO

-- ============================================================
-- 10) ZONE SUPPLY METERING
-- ============================================================
DECLARE @ElecID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'ELEC');
DECLARE @WaterID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'WATER');
DECLARE @GasID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'GAS');
-- Zone Supply Meters
INSERT INTO dbo.ZoneSupplyMeter (utility_type_id, node_id, installed_date, status) VALUES
(@ElecID, 1, '2015-06-01', 'ACTIVE'),
(@ElecID, 2, '2016-03-15', 'ACTIVE'),
(@ElecID, 4, '2014-09-20', 'ACTIVE'),
(@WaterID, 6, '2017-02-10', 'ACTIVE'),
(@WaterID, 8, '2018-11-05', 'ACTIVE');
GO

-- Zone Supply Readings
INSERT INTO dbo.ZoneSupplyReading (zone_supply_meter_id, reading_ts, value, uom) VALUES
-- Electricity supply to zones (MWh)
(1, '2026-01-10 00:00:00', 2456.8, 'MWh'),
(1, '2026-01-10 01:00:00', 2389.2, 'MWh'),
(1, '2026-01-10 02:00:00', 2312.5, 'MWh'),
(2, '2026-01-10 00:00:00', 1234.6, 'MWh'),
(2, '2026-01-10 01:00:00', 1198.7, 'MWh'),
(3, '2026-01-10 00:00:00', 1876.4, 'MWh'),
(3, '2026-01-10 01:00:00', 1823.9, 'MWh'),

-- Water supply to zones (cu.m)
(4, '2026-01-10 06:00:00', 12456.5, 'cu.m'),
(4, '2026-01-10 12:00:00', 13890.2, 'cu.m'),
(4, '2026-01-10 18:00:00', 14234.8, 'cu.m'),
(5, '2026-01-10 06:00:00', 8765.3, 'cu.m'),
(5, '2026-01-10 12:00:00', 9123.7, 'cu.m');
GO

-- ============================================================
-- 11) OUTAGES & DISCONNECTIONS
-- ============================================================
DECLARE @ElecID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'ELEC');
DECLARE @WaterID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'WATER');
DECLARE @GasID BIGINT = (SELECT utility_type_id FROM dbo.UtilityType WHERE code = 'GAS');
-- Outages (System-wide)
INSERT INTO dbo.Outage (utility_type_id, start_time, end_time, outage_type, reason, employee_id) VALUES
-- Planned outages
(@ElecID, '2026-01-12 01:00:00', '2026-01-12 05:00:00', 'PLANNED', 'Scheduled maintenance - Colombo Grid transformer replacement', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP001')),
(@ElecID, '2026-01-15 09:00:00', '2026-01-15 13:00:00', 'PLANNED', 'Distribution line upgrade - Kandy area', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP005')),
(@WaterID, '2026-01-14 22:00:00', '2026-01-15 04:00:00', 'PLANNED', 'Pipeline valve replacement - Nugegoda area', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP003')),

-- Unplanned outages
(@ElecID, '2026-01-09 07:00:00', '2026-01-09 13:45:00', 'UNPLANNED', 'Circuit breaker trip due to tree branch contact', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP005')),
(@WaterID, '2026-01-08 14:30:00', '2026-01-09 10:00:00', 'UNPLANNED', 'High lift pump failure - reduced supply until repair', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP007'));
GO

-- Disconnection Orders
INSERT INTO dbo.DisconnectionOrder (connection_id, employee_id, issue_date, scheduled_date, executed_date, status, reason) VALUES
-- Executed disconnection
(15, (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP013'), '2025-11-15', '2025-12-01', '2025-12-05', 'EXECUTED', 'Non-payment of bills for 3 consecutive months. Outstanding amount: Rs. 18,450.00'),

-- Pending disconnections
(6, (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP013'), '2026-01-05', '2026-01-20', NULL, 'PENDING', 'Outstanding payment of Rs. 24,680.00 for 2 months'),
(11, (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP012'), '2026-01-08', '2026-01-25', NULL, 'PENDING', 'Non-payment - outstanding Rs. 15,320.00');
GO

-- Reconnection Orders
INSERT INTO dbo.ReconnectionOrder (connection_id, employee_id, scheduled_date, reconnection_date, reconnection_fee, status) VALUES
-- A customer who paid and got reconnected
(15, (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP006'), '2026-01-15', NULL, 2500.00, 'SCHEDULED');
GO

-- ============================================================
-- 12) COMPLAINTS
-- ============================================================

-- Customer Complaints
INSERT INTO dbo.Complaints (customer_id, complaint_type, created_date, status, description, assigned_employee_id, resolved_date) VALUES
-- Resolved complaints
(2, 'BILLING_ISSUE', '2025-12-20 10:30:00', 'RESOLVED', 'Bill amount seems incorrect. Last month was Rs. 2,450 but this month is Rs. 5,890 with similar usage.', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP015'), '2025-12-22 14:30:00'),
(4, 'POOR_SERVICE', '2025-12-28 14:15:00', 'RESOLVED', 'Water supply very irregular - only 2 hours per day for the past week', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP007'), '2026-01-02 16:00:00'),
(10, 'METER_ISSUE', '2026-01-03 09:20:00', 'RESOLVED', 'Electricity meter making strange clicking noises', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP005'), '2026-01-05 11:30:00'),

-- Pending complaints
(3, 'BILLING_ISSUE', '2026-01-08 11:45:00', 'PENDING', 'Charged for 169 units but I was away for 2 weeks. Please verify meter reading.', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP015'), NULL),
(7, 'LEAKAGE', '2026-01-09 15:30:00', 'IN_PROGRESS', 'Water leaking from meter box - wasting water', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP008'), NULL),
(1, 'POOR_SERVICE', '2026-01-10 08:15:00', 'PENDING', 'Frequent voltage fluctuations - lights dimming several times per day', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP005'), NULL),
(11, 'OUTAGE', '2026-01-09 07:15:00', 'RESOLVED', 'Complete power outage since 7:00 AM', (SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP005'), '2026-01-09 13:45:00');
GO

-- ============================================================
-- 13) REPORT REQUESTS
-- ============================================================

-- Report Requests
INSERT INTO dbo.ReportRequest (employee_id, requested_at, report_type, params) VALUES
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP001'), '2026-01-10 09:30:00', 'GENERATION_SUMMARY', '{"period":"2026-01","utility":"ELEC"}'),
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP002'), '2026-01-09 14:15:00', 'REVENUE_COLLECTION', '{"start_date":"2025-12-01","end_date":"2025-12-31"}'),
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP003'), '2026-01-08 10:45:00', 'MAINTENANCE_COST', '{"month":12,"year":2025,"utility":"WATER"}'),
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP004'), '2026-01-10 11:20:00', 'CUSTOMER_COMPLAINTS', '{"status":"PENDING","from_date":"2026-01-01"}'),
((SELECT employee_id FROM dbo.Employee WHERE employee_no = 'EMP001'), '2026-01-07 08:00:00', 'OUTAGE_REPORT', '{"utility":"ELEC","month":12,"year":2025}');
GO
-- Declare variables to hold the counts
DECLARE @UCount INT = (SELECT COUNT(*) FROM dbo.UtilityType);
DECLARE @GCount INT = (SELECT COUNT(*) FROM dbo.GeoArea);
DECLARE @ECount INT = (SELECT COUNT(*) FROM dbo.Employee);
DECLARE @CCount INT = (SELECT COUNT(*) FROM dbo.Customer);
DECLARE @PCount INT = (SELECT COUNT(*) FROM dbo.Payment);
DECLARE @Rev DECIMAL(18,2) = ISNULL((SELECT SUM(payment_amount) FROM dbo.Payment), 0);

PRINT '============================================================';
PRINT 'DATA LOADING COMPLETED SUCCESSFULLY';
PRINT '============================================================';
PRINT 'Summary:';
PRINT ' - Utility Types: ' + CAST(@UCount AS VARCHAR(10));
PRINT ' - Geographic Areas: ' + CAST(@GCount AS VARCHAR(10));
PRINT ' - Employees: ' + CAST(@ECount AS VARCHAR(10));
PRINT ' - Customers: ' + CAST(@CCount AS VARCHAR(10));
PRINT ' - Payments: ' + CAST(@PCount AS VARCHAR(10));
PRINT ' - Total Revenue: Rs. ' + FORMAT(@Rev, 'N2');
PRINT '============================================================';

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO


SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

/* =========================
   1) BILLING STORED PROCEDURES
   ========================= */

-- =============================================
-- SP: Calculate and Generate Bill
-- Description: Calculates bill with tariff slabs and taxes
-- =============================================
CREATE OR ALTER PROCEDURE dbo.sp_GenerateBill
    @meter_id BIGINT,
    @billing_period_start DATE,
    @billing_period_end DATE,
    @bill_date DATE,
    @due_date DATE,
    @bill_id BIGINT OUTPUT,
    @total_amount DECIMAL(12,2) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @first_reading DECIMAL(14,3);
    DECLARE @last_reading DECIMAL(14,3);
    DECLARE @consumption DECIMAL(14,3);
    DECLARE @tariff_category_id BIGINT;
    DECLARE @energy_charge DECIMAL(12,2) = 0;
    DECLARE @fixed_charge DECIMAL(12,2) = 0;
    DECLARE @subsidy_amount DECIMAL(12,2) = 0;
    DECLARE @export_reading_first DECIMAL(14,3) = 0;
    DECLARE @export_reading_last DECIMAL(14,3) = 0;
    DECLARE @solar_export_credit DECIMAL(12,2) = 0;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- 1) Get tariff category from service connection
        SELECT @tariff_category_id = tariff_category_id
        FROM dbo.ServiceConnection
        WHERE meter_id = @meter_id
        AND connection_status = 'ACTIVE';
        
        IF @tariff_category_id IS NULL
        BEGIN
            RAISERROR('No active service connection found for meter', 16, 1);
            RETURN;
        END
        
        -- 2) Get first and last readings for the period
        ;WITH OrderedReadings AS (
            SELECT 
                import_reading,
                export_reading,
                ROW_NUMBER() OVER (ORDER BY reading_date ASC) as rn_asc,
                ROW_NUMBER() OVER (ORDER BY reading_date DESC) as rn_desc
            FROM dbo.MeterReading
            WHERE meter_id = @meter_id
            AND reading_date BETWEEN @billing_period_start AND @billing_period_end
        )
        SELECT 
            @first_reading = MAX(CASE WHEN rn_asc = 1 THEN import_reading END),
            @last_reading = MAX(CASE WHEN rn_desc = 1 THEN import_reading END),
            @export_reading_first = ISNULL(MAX(CASE WHEN rn_asc = 1 THEN export_reading END), 0),
            @export_reading_last = ISNULL(MAX(CASE WHEN rn_desc = 1 THEN export_reading END), 0)
        FROM OrderedReadings;
        
        IF @first_reading IS NULL OR @last_reading IS NULL
        BEGIN
            RAISERROR('Insufficient meter readings for the billing period', 16, 1);
            RETURN;
        END
        
        -- 3) Calculate consumption
        SET @consumption = @last_reading - @first_reading;
        
        IF @consumption < 0
        BEGIN
            RAISERROR('Invalid consumption: negative value detected', 16, 1);
            RETURN;
        END
        
        -- 4) Calculate solar export credit
        DECLARE @export_consumption DECIMAL(14,3) = @export_reading_last - @export_reading_first;
        IF @export_consumption > 0
        BEGIN
            -- Use average import rate for export credit (simplified)
            DECLARE @avg_rate DECIMAL(12,4);
            SELECT @avg_rate = AVG(rate_per_unit)
            FROM dbo.TariffSlab
            WHERE tariff_category_id = @tariff_category_id
            AND GETDATE() BETWEEN valid_from AND ISNULL(valid_to, '9999-12-31');
            
            SET @solar_export_credit = @export_consumption * ISNULL(@avg_rate, 0);
        END
        
        -- 5) Calculate energy charges using tariff slabs
        DECLARE @remaining_consumption DECIMAL(14,3) = @consumption;
        DECLARE @slab_id BIGINT;
        DECLARE @from_unit DECIMAL(14,3);
        DECLARE @to_unit DECIMAL(14,3);
        DECLARE @rate_per_unit DECIMAL(12,4);
        DECLARE @slab_fixed_charge DECIMAL(12,2);
        DECLARE @units_in_slab DECIMAL(14,3);
        DECLARE @slab_amount DECIMAL(12,2);
        
        DECLARE slab_cursor CURSOR FOR
        SELECT slab_id, from_unit, to_unit, rate_per_unit, fixed_charge
        FROM dbo.TariffSlab
        WHERE tariff_category_id = @tariff_category_id
        AND GETDATE() BETWEEN valid_from AND ISNULL(valid_to, '9999-12-31')
        ORDER BY from_unit ASC;
        
        CREATE TABLE #SlabBreakdown (
            slab_id BIGINT,
            units_in_slab DECIMAL(14,3),
            amount DECIMAL(12,2)
        );
        
        OPEN slab_cursor;
        FETCH NEXT FROM slab_cursor INTO @slab_id, @from_unit, @to_unit, @rate_per_unit, @slab_fixed_charge;
        
        WHILE @@FETCH_STATUS = 0 AND @remaining_consumption > 0
        BEGIN
            IF @to_unit IS NULL
                SET @units_in_slab = @remaining_consumption;
            ELSE
                SET @units_in_slab = CASE 
                    WHEN @remaining_consumption <= (@to_unit - @from_unit) 
                    THEN @remaining_consumption 
                    ELSE (@to_unit - @from_unit) 
                END;
            
            SET @slab_amount = @units_in_slab * @rate_per_unit;
            SET @energy_charge = @energy_charge + @slab_amount;
            SET @fixed_charge = @fixed_charge + @slab_fixed_charge;
            
            INSERT INTO #SlabBreakdown (slab_id, units_in_slab, amount)
            VALUES (@slab_id, @units_in_slab, @slab_amount);
            
            SET @remaining_consumption = @remaining_consumption - @units_in_slab;
            
            FETCH NEXT FROM slab_cursor INTO @slab_id, @from_unit, @to_unit, @rate_per_unit, @slab_fixed_charge;
        END
        
        CLOSE slab_cursor;
        DEALLOCATE slab_cursor;
        
        -- 6) Check for subsidies
        SELECT @subsidy_amount = SUM(
            CASE 
                WHEN ss.discount_type = 'PERCENTAGE' 
                THEN (@energy_charge + @fixed_charge) * (ss.discount_value / 100)
                WHEN ss.discount_type = 'FIXED_AMOUNT'
                THEN ss.discount_value
                ELSE 0
            END
        )
        FROM dbo.CustomerSubsidy cs
        INNER JOIN dbo.SubsidyScheme ss ON cs.subsidy_id = ss.subsidy_id
        INNER JOIN dbo.ServiceConnection sc ON cs.customer_id = sc.customer_id
        WHERE sc.meter_id = @meter_id
        AND cs.status = 'ACTIVE'
        AND GETDATE() BETWEEN ss.valid_from AND ISNULL(ss.valid_to, '9999-12-31');
        
        SET @subsidy_amount = ISNULL(@subsidy_amount, 0);
        
        -- 7) Create bill record
        INSERT INTO dbo.Bill (
            meter_id,
            billing_period_start,
            billing_period_end,
            bill_date,
            due_date,
            total_import_unit,
            total_export_unit,
            energy_charge_amount,
            fixed_charge_amount,
            subsidy_amount,
            solar_export_credit
        )
        VALUES (
            @meter_id,
            @billing_period_start,
            @billing_period_end,
            @bill_date,
            @due_date,
            @consumption,
            @export_consumption,
            @energy_charge,
            @fixed_charge,
            @subsidy_amount,
            @solar_export_credit
        );
        
        SET @bill_id = SCOPE_IDENTITY();
        
        -- 8) Insert bill details (slab breakdown)
        INSERT INTO dbo.BillDetail (bill_id, slab_id, units_in_slab, amount)
        SELECT @bill_id, slab_id, units_in_slab, amount
        FROM #SlabBreakdown;
        
        DROP TABLE #SlabBreakdown;
        
        -- 9) Calculate and insert taxes
        DECLARE @taxable_base DECIMAL(12,2) = @energy_charge + @fixed_charge - @subsidy_amount;
        DECLARE @tax_id BIGINT;
        DECLARE @tax_rate DECIMAL(6,3);
        
        DECLARE tax_cursor CURSOR FOR
        SELECT tax_id, rate_percent
        FROM dbo.TaxConfig
        WHERE status = 'ACTIVE'
        AND GETDATE() BETWEEN effective_from AND ISNULL(effective_to, '9999-12-31');
        
        OPEN tax_cursor;
        FETCH NEXT FROM tax_cursor INTO @tax_id, @tax_rate;
        
        WHILE @@FETCH_STATUS = 0
        BEGIN
            INSERT INTO dbo.BillTax (bill_id, tax_id, rate_percent_applied, taxable_base_amount)
            VALUES (@bill_id, @tax_id, @tax_rate, @taxable_base);
            
            FETCH NEXT FROM tax_cursor INTO @tax_id, @tax_rate;
        END
        
        CLOSE tax_cursor;
        DEALLOCATE tax_cursor;
        
        -- 10) Calculate total amount
        DECLARE @tax_total DECIMAL(12,2);
        SELECT @tax_total = SUM(taxable_base_amount * (rate_percent_applied / 100))
        FROM dbo.BillTax
        WHERE bill_id = @bill_id;
        
        SET @total_amount = @taxable_base + ISNULL(@tax_total, 0) - @solar_export_credit;
        
        COMMIT TRANSACTION;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO

-- =============================================
-- SP: Get Bill Total Amount
-- Description: Calculates total bill amount including taxes
-- =============================================
CREATE OR ALTER PROCEDURE dbo.sp_GetBillTotalAmount
    @bill_id BIGINT,
    @total_amount DECIMAL(12,2) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @energy_charge DECIMAL(12,2);
    DECLARE @fixed_charge DECIMAL(12,2);
    DECLARE @subsidy DECIMAL(12,2);
    DECLARE @export_credit DECIMAL(12,2);
    DECLARE @tax_total DECIMAL(12,2);
    
    SELECT 
        @energy_charge = energy_charge_amount,
        @fixed_charge = fixed_charge_amount,
        @subsidy = subsidy_amount,
        @export_credit = solar_export_credit
    FROM dbo.Bill
    WHERE bill_id = @bill_id;
    
    IF @energy_charge IS NULL
    BEGIN
        RAISERROR('Bill not found', 16, 1);
        RETURN;
    END
    
    -- Calculate taxes
    SELECT @tax_total = SUM(taxable_base_amount * (rate_percent_applied / 100))
    FROM dbo.BillTax
    WHERE bill_id = @bill_id;
    
    SET @total_amount = @energy_charge + @fixed_charge - @subsidy + ISNULL(@tax_total, 0) - @export_credit;
END
GO
/* =========================
   1) METER READING TRIGGERS
   ========================= */

-- =============================================
-- Trigger: Auto-Generate Bill After Reading
-- Description: Automatically generates bill when a valid reading is recorded
-- Fires: AFTER INSERT on MeterReading
-- Note: This is optional - you may want to control billing manually
-- =============================================
CREATE OR ALTER TRIGGER trg_AutoGenerateBill_AfterReading
ON dbo.MeterReading
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Only generate bills for readings that mark the end of a billing period
    -- You can control this with a flag or by checking the date
    
    DECLARE @meter_id BIGINT;
    DECLARE @reading_id BIGINT;
    DECLARE @connection_id BIGINT;
    DECLARE @billing_period_start DATE;
    DECLARE @billing_period_end DATE;
    DECLARE @new_bill_id BIGINT;
    DECLARE @result_message NVARCHAR(500);
    
    -- Process each inserted reading
    DECLARE bill_cursor CURSOR FOR
    SELECT 
        i.meter_id,
        i.reading_id,
        i.reading_date,
        sc.connection_id
    FROM inserted i
    INNER JOIN dbo.ServiceConnection sc ON i.meter_id = sc.meter_id
    WHERE sc.connection_status = 'ACTIVE'
    AND i.reading_source = 'SCHEDULED'; -- Only for scheduled readings
    
    OPEN bill_cursor;
    FETCH NEXT FROM bill_cursor INTO @meter_id, @reading_id, @billing_period_end, @connection_id;
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Calculate billing period start (last bill date or 30 days ago)
        SELECT TOP 1 @billing_period_start = billing_period_end
        FROM dbo.Bill
        WHERE meter_id = @meter_id
        ORDER BY billing_period_end DESC;
        
        IF @billing_period_start IS NULL
            SET @billing_period_start = DATEADD(DAY, -30, @billing_period_end);
        
        -- Check if bill already exists for this period
        IF NOT EXISTS (
            SELECT 1 FROM dbo.Bill
            WHERE meter_id = @meter_id
            AND billing_period_start = @billing_period_start
            AND billing_period_end = @billing_period_end
        )
        BEGIN
            -- Generate bill using stored procedure
            BEGIN TRY
                DECLARE @due_date_calc DATE = DATEADD(DAY, 15, @billing_period_end);
                DECLARE @bill_total DECIMAL(12,2);
                
                EXEC dbo.sp_GenerateBill
                    @meter_id = @meter_id,
                    @billing_period_start = @billing_period_start,
                    @billing_period_end = @billing_period_end,
                    @bill_date = @billing_period_end,
                    @due_date = @due_date_calc,
                    @bill_id = @new_bill_id OUTPUT,
                    @total_amount = @bill_total OUTPUT;
                
                PRINT 'Auto-generated Bill ID ' + CAST(@new_bill_id AS VARCHAR(20)) + 
                      ' for Meter ID ' + CAST(@meter_id AS VARCHAR(20)) + 
                      ' - Amount: Rs ' + CAST(@bill_total AS VARCHAR(20));
            END TRY
            BEGIN CATCH
                PRINT 'Failed to auto-generate bill for Meter ID ' + CAST(@meter_id AS VARCHAR(20)) + 
                      ': ' + ERROR_MESSAGE();
            END CATCH
        END
        
        FETCH NEXT FROM bill_cursor INTO @meter_id, @reading_id, @billing_period_end, @connection_id;
    END
    
    CLOSE bill_cursor;
    DEALLOCATE bill_cursor;
END
GO

/* =========================
   2) PAYMENT TRIGGERS
   ========================= */

-- =============================================
-- Trigger: Update Bill Status After Payment
-- Description: Recalculates bill payment status when payment is recorded
-- Fires: AFTER INSERT on Payment
-- =============================================
CREATE OR ALTER TRIGGER trg_UpdateBillStatus_AfterPayment
ON dbo.Payment
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Update bill payment tracking
    -- Note: Since Bill table doesn't have a payment_status column in the schema,
    -- this trigger logs the payment status for reporting purposes
    
    DECLARE @bill_id BIGINT;
    DECLARE @total_amount DECIMAL(12,2);
    DECLARE @paid_amount DECIMAL(12,2);
    DECLARE @payment_status VARCHAR(20);
    
    -- Process each inserted payment
    DECLARE payment_cursor CURSOR FOR
    SELECT DISTINCT bill_id
    FROM inserted;
    
    OPEN payment_cursor;
    FETCH NEXT FROM payment_cursor INTO @bill_id;
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Calculate total bill amount
        SELECT @total_amount = (
            energy_charge_amount + fixed_charge_amount - subsidy_amount +
            (SELECT ISNULL(SUM(taxable_base_amount * (rate_percent_applied / 100)), 0)
             FROM dbo.BillTax WHERE bill_id = b.bill_id) -
            solar_export_credit
        )
        FROM dbo.Bill b
        WHERE bill_id = @bill_id;
        
        -- Calculate total paid amount
        SELECT @paid_amount = ISNULL(SUM(payment_amount), 0)
        FROM dbo.Payment
        WHERE bill_id = @bill_id;
        
        -- Determine payment status
        IF @paid_amount >= @total_amount
            SET @payment_status = 'PAID';
        ELSE IF @paid_amount > 0
            SET @payment_status = 'PARTIAL';
        ELSE
            SET @payment_status = 'UNPAID';
        
        PRINT 'Bill ID ' + CAST(@bill_id AS VARCHAR(20)) + 
              ' Status: ' + @payment_status + 
              ' (Paid: ' + CAST(@paid_amount AS VARCHAR(20)) + 
              ' of ' + CAST(@total_amount AS VARCHAR(20)) + ')';
        
        -- You could insert into a BillStatusLog table here for audit trail
        -- INSERT INTO dbo.BillStatusLog (bill_id, status, updated_at)
        -- VALUES (@bill_id, @payment_status, GETDATE());
        
        FETCH NEXT FROM payment_cursor INTO @bill_id;
    END
    
    CLOSE payment_cursor;
    DEALLOCATE payment_cursor;
END
GO

CREATE OR ALTER FUNCTION dbo.fn_GetCustomerFullName
(
    @customer_id BIGINT
)
RETURNS VARCHAR(250)
AS
BEGIN
    DECLARE @full_name VARCHAR(250);
    
    SELECT @full_name = 
        first_name + 
        CASE WHEN middle_name IS NOT NULL THEN ' ' + middle_name ELSE '' END +
        ' ' + last_name
    FROM dbo.Customer
    WHERE customer_id = @customer_id;
    
    RETURN @full_name;
END
GO

CREATE OR ALTER FUNCTION dbo.fn_GetCustomerTypeDescription
(
    @customer_type VARCHAR(30)
)
RETURNS VARCHAR(100)
AS
BEGIN
    DECLARE @description VARCHAR(100);
    
    SET @description = CASE @customer_type
        WHEN 'RESIDENTIAL' THEN 'Residential Customer'
        WHEN 'COMMERCIAL' THEN 'Commercial Business'
        WHEN 'INDUSTRIAL' THEN 'Industrial Facility'
        WHEN 'GOVERNMENT' THEN 'Government Agency'
        WHEN 'AGRICULTURAL' THEN 'Agricultural Use'
        ELSE 'Unknown Type'
    END;
    
    RETURN @description;
END
GO

CREATE OR ALTER FUNCTION dbo.fn_GetDaysSinceLastReading
(
    @meter_id BIGINT
)
RETURNS INT
AS
BEGIN
    DECLARE @days INT;
    DECLARE @last_reading_date DATE;
    
    SELECT TOP 1 @last_reading_date = reading_date
    FROM dbo.MeterReading
    WHERE meter_id = @meter_id
    ORDER BY reading_date DESC;
    
    IF @last_reading_date IS NOT NULL
        SET @days = DATEDIFF(DAY, @last_reading_date, GETDATE());
    ELSE
        SET @days = NULL;
    
    RETURN @days;
END
GO
CREATE OR ALTER FUNCTION dbo.fn_GetCustomerActiveMeters
(
    @customer_id BIGINT
)
RETURNS TABLE
AS
RETURN
(
    SELECT 
        m.meter_id,
        m.meter_serial_no,
        ut.name as utility_type,
        ut.code as utility_code,
        m.installation_date,
        m.is_smart_meter,
        m.status,
        sc.connection_id,
        sc.connection_status,
        dbo.fn_GetDaysSinceLastReading(m.meter_id) as days_since_last_reading
    FROM dbo.Meter m
    INNER JOIN dbo.ServiceConnection sc ON m.meter_id = sc.meter_id
    INNER JOIN dbo.UtilityType ut ON m.utility_type_id = ut.utility_type_id
    WHERE sc.customer_id = @customer_id
    AND sc.connection_status = 'ACTIVE'
);
GO



-- =============================================
-- 1. REVENUE TRENDS - DAILY REVENUE SUMMARY
-- =============================================
IF OBJECT_ID('dbo.vw_DailyRevenue', 'V') IS NOT NULL
    DROP VIEW dbo.vw_DailyRevenue;
GO

CREATE VIEW dbo.vw_DailyRevenue AS
SELECT 
    CAST(p.payment_date AS DATE) as revenue_date,
    YEAR(p.payment_date) as year,
    MONTH(p.payment_date) as month,
    DAY(p.payment_date) as day,
    DATENAME(WEEKDAY, p.payment_date) as day_of_week,
    ut.name as utility_type,
    COUNT(DISTINCT p.payment_id) as transaction_count,
    COUNT(DISTINCT p.connection_id) as unique_connections,
    COUNT(DISTINCT sc.customer_id) as unique_customers,
    SUM(p.payment_amount) as total_revenue,
    AVG(p.payment_amount) as avg_transaction_amount,
    MIN(p.payment_amount) as min_transaction,
    MAX(p.payment_amount) as max_transaction
FROM dbo.Payment p
INNER JOIN dbo.ServiceConnection sc ON p.connection_id = sc.connection_id
INNER JOIN dbo.Meter m ON sc.meter_id = m.meter_id
INNER JOIN dbo.UtilityType ut ON m.utility_type_id = ut.utility_type_id
WHERE p.payment_status = 'COMPLETED'
GROUP BY CAST(p.payment_date AS DATE), YEAR(p.payment_date), MONTH(p.payment_date), 
         DAY(p.payment_date), DATENAME(WEEKDAY, p.payment_date), ut.name;
GO

-- =============================================
-- 2. REVENUE TRENDS - MONTHLY REVENUE SUMMARY
-- =============================================
IF OBJECT_ID('dbo.vw_MonthlyRevenue', 'V') IS NOT NULL
    DROP VIEW dbo.vw_MonthlyRevenue;
GO

CREATE VIEW dbo.vw_MonthlyRevenue AS
SELECT 
    YEAR(p.payment_date) as year,
    MONTH(p.payment_date) as month,
    DATENAME(MONTH, p.payment_date) as month_name,
    ut.name as utility_type,
    COUNT(DISTINCT p.payment_id) as transaction_count,
    COUNT(DISTINCT p.connection_id) as unique_connections,
    COUNT(DISTINCT sc.customer_id) as unique_customers,
    SUM(p.payment_amount) as total_revenue,
    AVG(p.payment_amount) as avg_transaction_amount,
    SUM(CASE WHEN p.payment_method = 'CASH' THEN p.payment_amount ELSE 0 END) as cash_revenue,
    SUM(CASE WHEN p.payment_method = 'CARD' THEN p.payment_amount ELSE 0 END) as card_revenue,
    SUM(CASE WHEN p.payment_method = 'BANK_TRANSFER' THEN p.payment_amount ELSE 0 END) as bank_transfer_revenue,
    SUM(CASE WHEN p.payment_method = 'MOBILE_MONEY' THEN p.payment_amount ELSE 0 END) as mobile_money_revenue,
    SUM(CASE WHEN p.payment_method = 'ONLINE' THEN p.payment_amount ELSE 0 END) as online_revenue
FROM dbo.Payment p
INNER JOIN dbo.ServiceConnection sc ON p.connection_id = sc.connection_id
INNER JOIN dbo.Meter m ON sc.meter_id = m.meter_id
INNER JOIN dbo.UtilityType ut ON m.utility_type_id = ut.utility_type_id
WHERE p.payment_status = 'COMPLETED'
GROUP BY YEAR(p.payment_date), MONTH(p.payment_date), DATENAME(MONTH, p.payment_date), ut.name;
GO

-- =============================================
-- 3. REVENUE TRENDS - YEARLY REVENUE SUMMARY
-- =============================================
IF OBJECT_ID('dbo.vw_YearlyRevenue', 'V') IS NOT NULL
    DROP VIEW dbo.vw_YearlyRevenue;
GO

CREATE VIEW dbo.vw_YearlyRevenue AS
SELECT 
    YEAR(p.payment_date) as year,
    ut.name as utility_type,
    COUNT(DISTINCT p.payment_id) as transaction_count,
    COUNT(DISTINCT p.connection_id) as unique_connections,
    COUNT(DISTINCT sc.customer_id) as unique_customers,
    SUM(p.payment_amount) as total_revenue,
    AVG(p.payment_amount) as avg_transaction_amount,
    SUM(b.total_amount) as total_billed_amount,
    SUM(p.payment_amount) * 100.0 / NULLIF(SUM(b.total_amount), 0) as collection_rate_percentage
FROM dbo.Payment p
INNER JOIN dbo.Bill b ON p.bill_id = b.bill_id
INNER JOIN dbo.ServiceConnection sc ON p.connection_id = sc.connection_id
INNER JOIN dbo.Meter m ON sc.meter_id = m.meter_id
INNER JOIN dbo.UtilityType ut ON m.utility_type_id = ut.utility_type_id
WHERE p.payment_status = 'COMPLETED'
GROUP BY YEAR(p.payment_date), ut.name;
GO

