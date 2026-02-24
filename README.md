# n8n-nodes-r3-corda

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides seamless integration with R3 Corda distributed ledger technology, offering 5 comprehensive resources for enterprise blockchain operations including vault queries, flow execution, token management, network mapping, and attachment handling.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![R3 Corda](https://img.shields.io/badge/R3%20Corda-4.x%2B-green)
![Blockchain](https://img.shields.io/badge/Blockchain-DLT-purple)
![Enterprise](https://img.shields.io/badge/Enterprise-Ready-orange)

## Features

- **Vault Queries** - Execute complex queries against Corda vault state data with flexible filtering and pagination
- **Flow Execution** - Initiate and monitor Corda flows for business logic automation and state transitions
- **Token Management** - Create, transfer, and manage tokens within Corda networks with full transaction support
- **Network Discovery** - Query network topology, node information, and peer connectivity for monitoring and administration
- **Attachment Handling** - Upload, retrieve, and manage contract attachments and supporting documents
- **State Monitoring** - Real-time tracking of transaction states and flow progress with detailed status information
- **Error Recovery** - Comprehensive error handling with automatic retry mechanisms for network resilience
- **Security Integration** - Full support for Corda's cryptographic security model and identity management

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-r3-corda`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-r3-corda
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-r3-corda.git
cd n8n-nodes-r3-corda
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-r3-corda
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Corda node RPC API key for authentication | Yes |
| Node Host | Hostname or IP address of the Corda node | Yes |
| RPC Port | RPC port number (typically 10006) | Yes |
| Username | RPC username for node access | Yes |
| Password | RPC password for node access | Yes |
| SSL Enabled | Enable SSL/TLS for secure connections | No |
| Connection Timeout | Timeout in milliseconds for RPC connections | No |

## Resources & Operations

### 1. Vault Queries

| Operation | Description |
|-----------|-------------|
| Query States | Retrieve vault states with custom criteria and filters |
| Query Transactions | Search transaction history with date ranges and participants |
| Get State by Ref | Fetch specific state using state reference |
| Query Contracts | Find states by contract type and constraints |
| Count States | Get state count matching query criteria |
| Track States | Monitor state changes and updates |

### 2. Flow Execution

| Operation | Description |
|-----------|-------------|
| Start Flow | Initiate a new Corda flow with parameters |
| Get Flow Status | Check the status and progress of running flows |
| List Flows | Retrieve all available flows on the node |
| Get Flow Result | Obtain the result of completed flows |
| Cancel Flow | Terminate a running flow execution |
| Monitor Flow | Track flow execution with real-time updates |

### 3. Token Management

| Operation | Description |
|-----------|-------------|
| Create Tokens | Issue new tokens with specified attributes |
| Transfer Tokens | Move tokens between parties |
| Redeem Tokens | Burn or redeem existing tokens |
| Query Token Balance | Check token balances for parties |
| Get Token Info | Retrieve token metadata and properties |
| List Token Types | Display available token types on the network |

### 4. Network Map

| Operation | Description |
|-----------|-------------|
| Get Network Map | Retrieve complete network topology |
| Query Nodes | Search for nodes by criteria |
| Get Node Info | Fetch detailed information about specific nodes |
| Check Node Status | Verify node connectivity and health |
| Get Notaries | List all notary services on the network |
| Query Services | Discover available network services |

### 5. Attachments

| Operation | Description |
|-----------|-------------|
| Upload Attachment | Add new attachments to the node |
| Download Attachment | Retrieve attachment content by hash |
| List Attachments | Get all attachments stored on the node |
| Query Attachment Info | Fetch attachment metadata and properties |
| Verify Attachment | Validate attachment integrity and signatures |
| Delete Attachment | Remove attachments from node storage |

## Usage Examples

```javascript
// Query vault states for IOUState contracts
{
  "resource": "vaultQueries",
  "operation": "queryStates",
  "contractType": "com.example.IOUState",
  "criteria": {
    "linearId": "550e8400-e29b-41d4-a716-446655440000"
  },
  "pageSize": 10
}
```

```javascript
// Execute a payment flow
{
  "resource": "flowExecution", 
  "operation": "startFlow",
  "flowName": "PaymentFlow",
  "parameters": {
    "amount": 1000,
    "currency": "USD",
    "recipient": "O=BankB,L=New York,C=US"
  }
}
```

```javascript
// Transfer tokens between parties
{
  "resource": "tokenManagement",
  "operation": "transferTokens",
  "tokenType": "com.example.DigitalCurrency",
  "amount": 500,
  "recipient": "O=PartyB,L=London,C=GB",
  "memo": "Payment for services"
}
```

```javascript
// Upload contract attachment
{
  "resource": "attachments",
  "operation": "uploadAttachment",
  "filename": "contract.jar",
  "content": "base64EncodedContent",
  "metadata": {
    "version": "1.0",
    "description": "Updated contract JAR"
  }
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| RPC Connection Failed | Cannot connect to Corda node RPC interface | Verify host, port, and credentials. Check node status |
| Flow Not Found | Specified flow class not available on node | Verify flow name and ensure CorDapp is installed |
| Invalid State Reference | State reference does not exist or is consumed | Check state reference format and vault status |
| Insufficient Permissions | API key lacks required permissions | Update RPC user permissions or use different credentials |
| Network Timeout | Operation exceeded timeout threshold | Increase timeout value or check network connectivity |
| Attachment Hash Mismatch | Uploaded attachment failed integrity check | Verify file content and retry upload |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-r3-corda/issues)
- **R3 Corda Documentation**: [docs.corda.net](https://docs.corda.net)
- **Corda Community**: [developer.r3.com](https://developer.r3.com)