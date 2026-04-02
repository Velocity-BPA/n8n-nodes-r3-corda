# n8n-nodes-r3-corda

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides seamless integration with R3 Corda distributed ledger platform, offering 6 comprehensive resources for blockchain operations. Enable automated workflows for vault queries, flow execution, network management, identity operations, transaction handling, and attachment processing within your Corda network ecosystem.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Corda](https://img.shields.io/badge/R3%20Corda-Enterprise-green)
![DLT](https://img.shields.io/badge/DLT-Blockchain-orange)
![Enterprise](https://img.shields.io/badge/Enterprise-Ready-purple)

## Features

- **Comprehensive Vault Operations** - Query and manage states stored in your Corda vault with advanced filtering capabilities
- **Flow Execution Management** - Initiate, track, and manage Corda flows with full parameter support and status monitoring
- **Network Discovery** - Retrieve network map information, node details, and peer connectivity status
- **Identity Management** - Handle party lookups, certificate operations, and network identity verification
- **Transaction Processing** - Create, sign, verify, and query transactions across the Corda network
- **Attachment Handling** - Upload, download, and manage contract JARs and file attachments
- **Enterprise Security** - Full support for Corda's security model with proper authentication and authorization
- **Real-time Monitoring** - Track flow progress and transaction states with comprehensive error handling

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
| Node URL | Base URL of your Corda node RPC endpoint | Yes |
| API Key | Authentication key for node access | Yes |
| Username | RPC username for node authentication | Yes |
| Password | RPC password for node authentication | Yes |
| SSL Verify | Enable/disable SSL certificate verification | No |

## Resources & Operations

### 1. Vault Query

| Operation | Description |
|-----------|-------------|
| Query States | Query vault for states with filtering options |
| Query by Criteria | Advanced state queries using custom criteria |
| Get State by ID | Retrieve specific state by linear or state ID |
| Query Consumed States | Search for consumed/historical states |
| Get Page Results | Paginated vault query results |

### 2. Flow

| Operation | Description |
|-----------|-------------|
| Start Flow | Initiate a new Corda flow with parameters |
| Get Flow Status | Check the status and progress of running flows |
| List Flows | Retrieve all available flows on the node |
| Get Flow Result | Fetch completed flow results and outputs |
| Cancel Flow | Terminate running flows |

### 3. Network

| Operation | Description |
|-----------|-------------|
| Get Network Map | Retrieve current network topology and nodes |
| Get Node Info | Fetch detailed information about specific nodes |
| List Peers | Get all known peer nodes and their status |
| Get Network Parameters | Retrieve network-wide configuration parameters |
| Check Connectivity | Test connectivity to other network nodes |

### 4. Identity

| Operation | Description |
|-----------|-------------|
| Get Node Identity | Retrieve the identity of the current node |
| Lookup Party | Find party information by name or key |
| List Known Parties | Get all parties known to this node |
| Verify Certificate | Validate party certificates and signatures |
| Get Well Known Parties | Retrieve network-wide known parties |

### 5. Transaction

| Operation | Description |
|-----------|-------------|
| Get Transaction | Retrieve transaction details by ID |
| Create Transaction | Build new transactions with inputs and outputs |
| Sign Transaction | Apply digital signatures to transactions |
| Verify Transaction | Validate transaction signatures and structure |
| Query Transactions | Search transactions with filtering criteria |

### 6. Attachment

| Operation | Description |
|-----------|-------------|
| Upload Attachment | Upload files or JARs as Corda attachments |
| Download Attachment | Retrieve attachment content by hash |
| List Attachments | Get all attachments available on the node |
| Get Attachment Info | Fetch metadata for specific attachments |
| Verify Attachment | Check attachment integrity and signatures |

## Usage Examples

```javascript
// Query vault for cash states
{
  "resource": "VaultQuery",
  "operation": "Query States",
  "stateType": "net.corda.finance.contracts.asset.Cash$State",
  "criteria": {
    "owner": "O=PartyA,L=London,C=GB"
  }
}
```

```javascript
// Start a cash payment flow
{
  "resource": "Flow",
  "operation": "Start Flow",
  "flowName": "net.corda.finance.flows.CashPaymentFlow",
  "parameters": {
    "amount": "100.00 USD",
    "recipient": "O=PartyB,L=New York,C=US",
    "anonymous": false
  }
}
```

```javascript
// Get network map information
{
  "resource": "Network", 
  "operation": "Get Network Map",
  "includeInactive": false,
  "filterByServices": ["corda.notary.validating"]
}
```

```javascript
// Upload contract JAR attachment
{
  "resource": "Attachment",
  "operation": "Upload Attachment",
  "filename": "finance-contracts-4.8.jar",
  "content": "{{$binary.data}}",
  "uploader": "O=PartyA,L=London,C=GB"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| RPC Connection Failed | Cannot connect to Corda node RPC endpoint | Verify node URL, credentials, and network connectivity |
| Flow Not Found | Specified flow class doesn't exist on node | Check available flows and verify class name spelling |
| Insufficient Permissions | User lacks required permissions for operation | Ensure RPC user has appropriate role assignments |
| Invalid State Query | Vault query syntax or criteria is malformed | Review query parameters and state type specifications |
| Transaction Verification Failed | Transaction signatures or structure invalid | Check transaction inputs, outputs, and required signatures |
| Attachment Hash Mismatch | Downloaded attachment doesn't match expected hash | Verify attachment integrity and re-upload if corrupted |

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
- **Corda Developer Community**: [developer.r3.com](https://developer.r3.com)