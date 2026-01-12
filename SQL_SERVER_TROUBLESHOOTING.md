# SQL Server Connection Troubleshooting Guide

This guide helps you resolve common SQL Server connection issues for the Govenly application.

## Common Connection Error

If you're seeing errors like:
- `ConnectionError: Failed to connect to localhost:1433`
- `Login failed for user`
- `Cannot connect to SQL Server`
- `A network-related or instance-specific error occurred`

Follow the steps below to resolve the issue.

---

## Step 1: Enable TCP/IP Protocol

TCP/IP protocol must be enabled for SQL Server to accept remote connections.

### Instructions:

1. **Open SQL Server Configuration Manager**
   - Press `Windows + R`
   - Type `SQLServerManager15.msc` (for SQL Server 2019)
     - SQL Server 2017: `SQLServerManager14.msc`
     - SQL Server 2016: `SQLServerManager13.msc`
     - SQL Server 2022: `SQLServerManager16.msc`
   - Click OK

2. **Navigate to SQL Server Network Configuration**
   - Expand **SQL Server Network Configuration**
   - Click on **Protocols for MSSQLSERVER** (or your instance name)

3. **Enable TCP/IP**
   - Find **TCP/IP** in the list
   - Right-click on **TCP/IP** → Select **Enable**
   - A confirmation dialog will appear

4. **Configure TCP/IP Port**
   - Right-click on **TCP/IP** → Select **Properties**
   - Go to the **IP Addresses** tab
   - Scroll down to **IPAll** section
   - Set **TCP Port** to `1433`
   - Clear the **TCP Dynamic Ports** field (leave it blank)
   - Click **OK**

5. **Restart SQL Server Service**
   - Go to **SQL Server Services** in the left panel
   - Right-click on **SQL Server (MSSQLSERVER)**
   - Select **Restart**

---

## Step 2: Enable SQL Server Browser Service

The SQL Server Browser service helps clients find SQL Server instances.

### Instructions:

1. **Open SQL Server Configuration Manager**
   - Follow Step 1 instructions above

2. **Start SQL Server Browser**
   - Click on **SQL Server Services** in the left panel
   - Find **SQL Server Browser** in the list
   - Right-click on **SQL Server Browser** → Select **Start**

3. **Set to Auto Start (Recommended)**
   - Right-click on **SQL Server Browser** → Select **Properties**
   - Change **Start Mode** to **Automatic**
   - Click **OK**

---

## Step 3: Enable SQL Server Authentication

The application requires SQL Server Authentication to be enabled.

### Instructions:

1. **Open SQL Server Management Studio (SSMS)**
   - Connect to your SQL Server instance

2. **Configure Server Authentication Mode**
   - Right-click on the **Server** name (root node in Object Explorer)
   - Select **Properties**

3. **Change Authentication Mode**
   - Go to the **Security** page
   - Under **Server authentication**, select:
     - **SQL Server and Windows Authentication mode**
   - Click **OK**

4. **Restart SQL Server**
   - A prompt will appear asking you to restart SQL Server
   - Restart the service for changes to take effect

---

## Step 4: Configure Windows Firewall

Ensure Windows Firewall allows SQL Server connections.

### Instructions:

1. **Open Windows Firewall with Advanced Security**
   - Press `Windows + R`
   - Type `wf.msc`
   - Click OK

2. **Create Inbound Rule for Port 1433**
   - Click **Inbound Rules** in the left panel
   - Click **New Rule** in the right panel
   - Select **Port** → Click **Next**
   - Select **TCP** and enter `1433` in **Specific local ports**
   - Click **Next** → Select **Allow the connection**
   - Click **Next** → Check all profiles (Domain, Private, Public)
   - Click **Next** → Give it a name: `SQL Server Port 1433`
   - Click **Finish**

3. **Create Inbound Rule for SQL Server Browser**
   - Follow the same steps but for **UDP port 1434**
   - Name it: `SQL Server Browser`

---

## Step 5: Verify SQL Server Login

Ensure your SQL Server user has proper permissions.

### Instructions:

1. **Open SSMS and connect to SQL Server**

2. **Create or Verify SQL Login**
   - Expand **Security** → **Logins**
   - Right-click **Logins** → **New Login**

3. **Configure Login**
   - Login name: `sa` (or your preferred username)
   - Select **SQL Server authentication**
   - Enter a strong password
   - Uncheck **Enforce password policy** (for development only)
   - Set **Default database** to your database name

4. **Grant Permissions**
   - Go to **User Mapping** page
   - Check your database
   - Assign **db_owner** role
   - Click **OK**

---

## Step 6: Update Application Configuration

Update your `.env` file with the correct connection details.

### Backend `.env` Configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=YourStrongPassword123
DB_NAME=GovernmentUtilityDB
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
```

### Important Notes:
- Use `localhost` or `127.0.0.1` for local connections
- If using a named instance: `localhost\\INSTANCENAME`
- Port 1433 is the default for SQL Server
- Set `DB_ENCRYPT=false` for local development
- Set `DB_TRUST_SERVER_CERTIFICATE=true` for local development

---

## Step 7: Test Connection

### Using Command Line:

```bash
# Test if SQL Server is listening on port 1433
telnet localhost 1433
```

If the screen goes blank, the connection is successful (press Ctrl+] then type `quit`).

### Using SSMS:

1. Open SQL Server Management Studio
2. Connect using:
   - **Server name**: `localhost` or `localhost,1433`
   - **Authentication**: SQL Server Authentication
   - **Login**: sa (or your username)
   - **Password**: Your password

If successful, you should be able to connect.

---

## Common Issues and Solutions

### Issue 1: "Named Pipes Provider: Could not open a connection"
**Solution**: Enable TCP/IP protocol (Step 1)

### Issue 2: "Login failed for user 'sa'"
**Solutions**:
- Enable SQL Server Authentication (Step 3)
- Reset the sa password
- Check if the login is enabled (right-click login → Properties → Status)

### Issue 3: "Cannot connect to localhost"
**Solutions**:
- Check if SQL Server service is running
- Verify port 1433 is configured correctly
- Check Windows Firewall settings (Step 4)

### Issue 4: "A network-related or instance-specific error"
**Solutions**:
- Enable TCP/IP and restart SQL Server (Step 1)
- Start SQL Server Browser service (Step 2)
- Check if the instance name is correct

### Issue 5: Connection works in SSMS but not in application
**Solutions**:
- Verify `.env` file configuration (Step 6)
- Check if the SQL Server user has database permissions
- Ensure `DB_TRUST_SERVER_CERTIFICATE=true` is set

---

## Quick Checklist

✅ TCP/IP protocol is enabled in SQL Server Configuration Manager  
✅ Port 1433 is configured in TCP/IP properties  
✅ SQL Server service has been restarted after enabling TCP/IP  
✅ SQL Server Browser service is running  
✅ SQL Server Authentication mode is enabled  
✅ Windows Firewall allows port 1433  
✅ SQL Server login exists with proper permissions  
✅ `.env` file has correct connection details  
✅ Database exists and user has access  

---

## Still Having Issues?

### Check SQL Server Error Log:

1. Open SQL Server Management Studio
2. Connect to your server
3. Expand **Management** → **SQL Server Logs**
4. Review the current log for error messages

### Enable Detailed Logging in Application:

Add to your `.env` file:
```env
DB_LOGGING=true
```

This will show detailed database queries and errors in the console.

### Contact Information:

For additional support, contact the development team:
- **Project**: Govenly - Government Utility Management System
- **Team**: NSBM Group 66

---

## Additional Resources

- [SQL Server Configuration Manager Documentation](https://docs.microsoft.com/en-us/sql/relational-databases/sql-server-configuration-manager)
- [Enable TCP/IP Network Protocol](https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/enable-or-disable-a-server-network-protocol)
- [Configure Windows Firewall for SQL Server](https://docs.microsoft.com/en-us/sql/sql-server/install/configure-the-windows-firewall-to-allow-sql-server-access)

---

**Last Updated**: January 12, 2026  
**Version**: 1.0
