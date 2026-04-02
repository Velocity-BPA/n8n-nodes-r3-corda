/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-r3corda/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class R3Corda implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'R3 Corda',
    name: 'r3corda',
    icon: 'file:r3corda.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the R3 Corda API',
    defaults: {
      name: 'R3 Corda',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'r3cordaApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'VaultQuery',
            value: 'vaultQuery',
          },
          {
            name: 'Flow',
            value: 'flow',
          },
          {
            name: 'Network',
            value: 'network',
          },
          {
            name: 'Identity',
            value: 'identity',
          },
          {
            name: 'Transaction',
            value: 'transaction',
          },
          {
            name: 'Attachment',
            value: 'attachment',
          },
          {
            name: 'VaultQueries',
            value: 'vaultQueries',
          },
          {
            name: 'FlowExecution',
            value: 'flowExecution',
          },
          {
            name: 'TokenManagement',
            value: 'tokenManagement',
          },
          {
            name: 'NetworkMap',
            value: 'networkMap',
          },
          {
            name: 'Attachments',
            value: 'attachments',
          }
        ],
        default: 'vaultQuery',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['vaultQuery'] } },
  options: [
    { name: 'Query Vault States', value: 'queryVaultStates', description: 'Query vault states with criteria', action: 'Query vault states' },
    { name: 'Query States By Type', value: 'queryStatesByType', description: 'Query states of specific contract type', action: 'Query states by type' },
    { name: 'Get All States', value: 'getAllStates', description: 'Retrieve all vault states', action: 'Get all states' },
    { name: 'Get State By Reference', value: 'getStateByRef', description: 'Get specific state by reference', action: 'Get state by reference' },
    { name: 'Get Linear Heads', value: 'getLinearHeads', description: 'Get linear state heads', action: 'Get linear heads' }
  ],
  default: 'queryVaultStates'
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['flow'] } },
	options: [
		{
			name: 'Start Flow',
			value: 'startFlow',
			description: 'Start a new Corda flow',
			action: 'Start a flow',
		},
		{
			name: 'Get Flow Status',
			value: 'getFlowStatus',
			description: 'Get the execution status of a flow',
			action: 'Get flow status',
		},
		{
			name: 'Get All Flows',
			value: 'getAllFlows',
			description: 'List all flows',
			action: 'Get all flows',
		},
		{
			name: 'Kill Flow',
			value: 'killFlow',
			description: 'Terminate a running flow',
			action: 'Kill a flow',
		},
		{
			name: 'Get Flow Checkpoint',
			value: 'getFlowCheckpoint',
			description: 'Get flow checkpoint data',
			action: 'Get flow checkpoint',
		},
	],
	default: 'startFlow',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['network'],
		},
	},
	options: [
		{
			name: 'Get Network Nodes',
			value: 'getNetworkNodes',
			description: 'Get all nodes in network',
			action: 'Get network nodes',
		},
		{
			name: 'Get Node by Hash',
			value: 'getNodeByHash',
			description: 'Get specific node by hash',
			action: 'Get node by hash',
		},
		{
			name: 'Get Notaries',
			value: 'getNotaries',
			description: 'Get all notary nodes',
			action: 'Get notaries',
		},
		{
			name: 'Get Peers',
			value: 'getPeers',
			description: 'Get peer nodes',
			action: 'Get peers',
		},
		{
			name: 'Get Network Parameters',
			value: 'getNetworkParameters',
			description: 'Get network parameters',
			action: 'Get network parameters',
		},
	],
	default: 'getNetworkNodes',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['identity'],
    },
  },
  options: [
    {
      name: 'Get Node Identity',
      value: 'getNodeIdentity',
      description: 'Get current node identity',
      action: 'Get current node identity',
    },
    {
      name: 'Get All Parties',
      value: 'getAllParties',
      description: 'Get all known parties',
      action: 'Get all known parties',
    },
    {
      name: 'Get Party By Name',
      value: 'getPartyByName',
      description: 'Get party by name',
      action: 'Get party by name',
    },
    {
      name: 'Register Party',
      value: 'registerParty',
      description: 'Register new party',
      action: 'Register new party',
    },
    {
      name: 'Get Public Keys',
      value: 'getPublicKeys',
      description: 'Get node public keys',
      action: 'Get node public keys',
    },
  ],
  default: 'getNodeIdentity',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
		},
	},
	options: [
		{
			name: 'Get Transaction',
			value: 'getTransaction',
			description: 'Get transaction by ID',
			action: 'Get transaction',
		},
		{
			name: 'Get All Transactions',
			value: 'getAllTransactions',
			description: 'List all transactions',
			action: 'Get all transactions',
		},
		{
			name: 'Verify Transaction',
			value: 'verifyTransaction',
			description: 'Verify transaction validity',
			action: 'Verify transaction',
		},
		{
			name: 'Get Transaction Outputs',
			value: 'getTransactionOutputs',
			description: 'Get transaction outputs',
			action: 'Get transaction outputs',
		},
		{
			name: 'Get Transaction Inputs',
			value: 'getTransactionInputs',
			description: 'Get transaction inputs',
			action: 'Get transaction inputs',
		},
	],
	default: 'getTransaction',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['attachment'],
		},
	},
	options: [
		{
			name: 'Upload Attachment',
			value: 'uploadAttachment',
			description: 'Upload new attachment',
			action: 'Upload attachment',
		},
		{
			name: 'Get Attachment',
			value: 'getAttachment',
			description: 'Download attachment by ID',
			action: 'Get attachment',
		},
		{
			name: 'Get All Attachments',
			value: 'getAllAttachments',
			description: 'List all attachments',
			action: 'Get all attachments',
		},
		{
			name: 'Delete Attachment',
			value: 'deleteAttachment',
			description: 'Remove attachment',
			action: 'Delete attachment',
		},
		{
			name: 'Get Attachment Metadata',
			value: 'getAttachmentMetadata',
			description: 'Get attachment metadata',
			action: 'Get attachment metadata',
		},
	],
	default: 'uploadAttachment',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['vaultQueries'],
    },
  },
  options: [
    {
      name: 'Query Vault States',
      value: 'queryVaultStates',
      description: 'Query vault states with criteria',
      action: 'Query vault states',
    },
    {
      name: 'Query Vault States By Criteria',
      value: 'queryVaultStatesByCriteria',
      description: 'Advanced vault state queries',
      action: 'Query vault states by criteria',
    },
    {
      name: 'Get Vault State',
      value: 'getVaultState',
      description: 'Retrieve specific vault state',
      action: 'Get vault state',
    },
    {
      name: 'Query Consumable States',
      value: 'queryConsumableStates',
      description: 'Query unconsumed states',
      action: 'Query consumable states',
    },
    {
      name: 'Query Vault Transactions',
      value: 'queryVaultTransactions',
      description: 'Query vault transactions',
      action: 'Query vault transactions',
    },
    {
      name: 'Get Vault Transaction',
      value: 'getVaultTransaction',
      description: 'Get specific transaction',
      action: 'Get vault transaction',
    },
  ],
  default: 'queryVaultStates',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['flowExecution'],
    },
  },
  options: [
    {
      name: 'Start Flow',
      value: 'startFlow',
      description: 'Start a new flow execution',
      action: 'Start flow',
    },
    {
      name: 'Get Completed Flows',
      value: 'getCompletedFlows',
      description: 'List completed flow executions',
      action: 'Get completed flows',
    },
    {
      name: 'Get Flow Status',
      value: 'getFlowStatus',
      description: 'Get status of running flow',
      action: 'Get flow status',
    },
    {
      name: 'Get Flow Progress',
      value: 'getFlowProgress',
      description: 'Get flow execution progress',
      action: 'Get flow progress',
    },
    {
      name: 'Kill Flow',
      value: 'killFlow',
      description: 'Terminate a running flow',
      action: 'Kill flow',
    },
    {
      name: 'Start Tracked Flow',
      value: 'startTrackedFlow',
      description: 'Start flow with progress tracking',
      action: 'Start tracked flow',
    },
  ],
  default: 'startFlow',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['tokenManagement'],
    },
  },
  options: [
    {
      name: 'Issue Tokens',
      value: 'issueTokens',
      description: 'Issue new tokens',
      action: 'Issue new tokens',
    },
    {
      name: 'Move Tokens',
      value: 'moveTokens',
      description: 'Transfer tokens between parties',
      action: 'Transfer tokens between parties',
    },
    {
      name: 'Redeem Tokens',
      value: 'redeemTokens',
      description: 'Redeem/burn existing tokens',
      action: 'Redeem/burn existing tokens',
    },
    {
      name: 'Get Token Balances',
      value: 'getTokenBalances',
      description: 'Query token balances',
      action: 'Query token balances',
    },
    {
      name: 'Query Token Balances',
      value: 'queryTokenBalances',
      description: 'Advanced token balance queries',
      action: 'Advanced token balance queries',
    },
    {
      name: 'Get Token Types',
      value: 'getTokenTypes',
      description: 'List available token types',
      action: 'List available token types',
    },
  ],
  default: 'issueTokens',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['networkMap'],
    },
  },
  options: [
    {
      name: 'Get Network Nodes',
      value: 'getNetworkNodes',
      description: 'List all network nodes',
      action: 'Get network nodes',
    },
    {
      name: 'Get Network Node',
      value: 'getNetworkNode',
      description: 'Get specific party information',
      action: 'Get network node',
    },
    {
      name: 'Get Network Parties',
      value: 'getNetworkParties',
      description: 'List all known parties',
      action: 'Get network parties',
    },
    {
      name: 'Get Node Info',
      value: 'getNodeInfo',
      description: 'Get current node information',
      action: 'Get node info',
    },
    {
      name: 'Get Notaries',
      value: 'getNotaries',
      description: 'List available notary services',
      action: 'Get notaries',
    },
    {
      name: 'Lookup Party By Name',
      value: 'lookupPartyByName',
      description: 'Find party by X.500 name',
      action: 'Lookup party by name',
    },
  ],
  default: 'getNetworkNodes',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['attachments'],
    },
  },
  options: [
    {
      name: 'Upload Attachment',
      value: 'uploadAttachment',
      description: 'Upload a new attachment file',
      action: 'Upload attachment',
    },
    {
      name: 'Get Attachment',
      value: 'getAttachment',
      description: 'Download an attachment by ID',
      action: 'Get attachment',
    },
    {
      name: 'List Attachments',
      value: 'listAttachments',
      description: 'List all available attachments',
      action: 'List attachments',
    },
    {
      name: 'Delete Attachment',
      value: 'deleteAttachment',
      description: 'Remove an attachment by ID',
      action: 'Delete attachment',
    },
    {
      name: 'Get Attachment Metadata',
      value: 'getAttachmentMetadata',
      description: 'Get metadata information for an attachment',
      action: 'Get attachment metadata',
    },
    {
      name: 'Verify Attachment',
      value: 'verifyAttachment',
      description: 'Verify the integrity of an attachment',
      action: 'Verify attachment',
    },
  ],
  default: 'uploadAttachment',
},
{
  displayName: 'Contract State Type',
  name: 'contractStateType',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['vaultQuery'], operation: ['queryVaultStates', 'queryStatesByType', 'getLinearHeads'] } },
  default: '',
  description: 'The fully qualified name of the contract state type'
},
{
  displayName: 'Criteria',
  name: 'criteria',
  type: 'json',
  required: false,
  displayOptions: { show: { resource: ['vaultQuery'], operation: ['queryVaultStates', 'queryStatesByType'] } },
  default: '{}',
  description: 'Query criteria for filtering states (JSON format)'
},
{
  displayName: 'Sorting',
  name: 'sorting',
  type: 'json',
  required: false,
  displayOptions: { show: { resource: ['vaultQuery'], operation: ['queryVaultStates'] } },
  default: '{}',
  description: 'Sorting criteria for results (JSON format)'
},
{
  displayName: 'Paging',
  name: 'paging',
  type: 'json',
  required: false,
  displayOptions: { show: { resource: ['vaultQuery'], operation: ['queryVaultStates'] } },
  default: '{"pageSize": 100, "pageNumber": 1}',
  description: 'Paging configuration (JSON format)'
},
{
  displayName: 'State Reference',
  name: 'ref',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['vaultQuery'], operation: ['getStateByRef'] } },
  default: '',
  description: 'The state reference to retrieve'
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['vaultQuery'], operation: ['getAllStates'] } },
  default: 100,
  description: 'Number of records per page'
},
{
  displayName: 'Page Number',
  name: 'pageNumber',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['vaultQuery'], operation: ['getAllStates'] } },
  default: 1,
  description: 'Page number to retrieve'
},
{
	displayName: 'Flow Name',
	name: 'flowName',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['flow'],
			operation: ['startFlow'],
		},
	},
	default: '',
	description: 'The name of the flow to start',
},
{
	displayName: 'Flow Arguments',
	name: 'flowArgs',
	type: 'json',
	required: false,
	displayOptions: {
		show: {
			resource: ['flow'],
			operation: ['startFlow'],
		},
	},
	default: '{}',
	description: 'Arguments to pass to the flow as JSON object',
},
{
	displayName: 'Flow ID',
	name: 'id',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['flow'],
			operation: ['getFlowStatus', 'killFlow', 'getFlowCheckpoint'],
		},
	},
	default: '',
	description: 'The ID of the flow',
},
{
	displayName: 'Node Hash',
	name: 'hash',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['network'],
			operation: ['getNodeByHash'],
		},
	},
	default: '',
	description: 'The hash of the node to retrieve',
},
{
  displayName: 'Party Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['identity'],
      operation: ['getPartyByName'],
    },
  },
  default: '',
  description: 'The name of the party to retrieve',
},
{
  displayName: 'Party Information',
  name: 'partyInfo',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['identity'],
      operation: ['registerParty'],
    },
  },
  default: '{}',
  description: 'JSON object containing party registration information',
},
{
	displayName: 'Transaction ID',
	name: 'transactionId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransaction'],
		},
	},
	default: '',
	description: 'The ID of the transaction to retrieve',
},
{
	displayName: 'Page Size',
	name: 'pageSize',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getAllTransactions'],
		},
	},
	default: 10,
	description: 'Number of transactions to return per page',
},
{
	displayName: 'Page Number',
	name: 'pageNumber',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getAllTransactions'],
		},
	},
	default: 1,
	description: 'Page number to retrieve',
},
{
	displayName: 'Transaction Data',
	name: 'transaction',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['verifyTransaction'],
		},
	},
	default: '{}',
	description: 'The transaction data to verify',
},
{
	displayName: 'Transaction ID',
	name: 'transactionId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransactionOutputs'],
		},
	},
	default: '',
	description: 'The ID of the transaction to get outputs for',
},
{
	displayName: 'Transaction ID',
	name: 'transactionId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransactionInputs'],
		},
	},
	default: '',
	description: 'The ID of the transaction to get inputs for',
},
{
	displayName: 'Attachment Data',
	name: 'attachmentData',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['attachment'],
			operation: ['uploadAttachment'],
		},
	},
	default: '',
	description: 'The attachment data to upload',
},
{
	displayName: 'Attachment ID',
	name: 'id',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['attachment'],
			operation: ['getAttachment', 'deleteAttachment', 'getAttachmentMetadata'],
		},
	},
	default: '',
	description: 'The ID of the attachment',
},
{
  displayName: 'State Type',
  name: 'stateType',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['vaultQueries'],
      operation: ['queryVaultStates', 'queryConsumableStates'],
    },
  },
  default: '',
  description: 'The contract state type to query',
},
{
  displayName: 'Contract State Type',
  name: 'contractStateType',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['vaultQueries'],
      operation: ['queryVaultStatesByCriteria'],
    },
  },
  default: '',
  description: 'The contract state type for advanced queries',
},
{
  displayName: 'Criteria',
  name: 'criteria',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['vaultQueries'],
      operation: ['queryVaultStates', 'queryVaultStatesByCriteria', 'queryConsumableStates', 'queryVaultTransactions'],
    },
  },
  default: '{}',
  description: 'Query criteria as JSON object',
},
{
  displayName: 'Sorting',
  name: 'sorting',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['vaultQueries'],
      operation: ['queryVaultStates', 'queryVaultStatesByCriteria', 'queryConsumableStates', 'queryVaultTransactions'],
    },
  },
  default: '{}',
  description: 'Sorting criteria as JSON object',
},
{
  displayName: 'Paging',
  name: 'paging',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['vaultQueries'],
      operation: ['queryVaultStates', 'queryVaultStatesByCriteria', 'queryConsumableStates', 'queryVaultTransactions'],
    },
  },
  default: '{"pageNumber": 1, "pageSize": 100}',
  description: 'Paging configuration as JSON object',
},
{
  displayName: 'State Reference',
  name: 'stateRef',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['vaultQueries'],
      operation: ['getVaultState'],
    },
  },
  default: '',
  description: 'The state reference identifier',
},
{
  displayName: 'Transaction ID',
  name: 'txnId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['vaultQueries'],
      operation: ['getVaultTransaction'],
    },
  },
  default: '',
  description: 'The transaction identifier',
},
{
  displayName: 'Flow Class Name',
  name: 'flowClassName',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['flowExecution'],
      operation: ['startFlow'],
    },
  },
  default: '',
  description: 'The fully qualified class name of the flow to start',
},
{
  displayName: 'Flow Arguments',
  name: 'flowArgs',
  type: 'json',
  required: false,
  displayOptions: {
    show: {
      resource: ['flowExecution'],
      operation: ['startFlow'],
    },
  },
  default: '{}',
  description: 'Arguments to pass to the flow constructor',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['flowExecution'],
      operation: ['getCompletedFlows'],
    },
  },
  default: 100,
  description: 'Maximum number of flows to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['flowExecution'],
      operation: ['getCompletedFlows'],
    },
  },
  default: 0,
  description: 'Number of flows to skip',
},
{
  displayName: 'Run ID',
  name: 'runId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['flowExecution'],
      operation: ['getFlowStatus'],
    },
  },
  default: '',
  description: 'The unique identifier of the flow run',
},
{
  displayName: 'Run ID',
  name: 'runId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['flowExecution'],
      operation: ['getFlowProgress'],
    },
  },
  default: '',
  description: 'The unique identifier of the flow run',
},
{
  displayName: 'Run ID',
  name: 'runId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['flowExecution'],
      operation: ['killFlow'],
    },
  },
  default: '',
  description: 'The unique identifier of the flow run to terminate',
},
{
  displayName: 'Flow Class Name',
  name: 'flowClassName',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['flowExecution'],
      operation: ['startTrackedFlow'],
    },
  },
  default: '',
  description: 'The fully qualified class name of the flow to start with tracking',
},
{
  displayName: 'Flow Arguments',
  name: 'flowArgs',
  type: 'json',
  required: false,
  displayOptions: {
    show: {
      resource: ['flowExecution'],
      operation: ['startTrackedFlow'],
    },
  },
  default: '{}',
  description: 'Arguments to pass to the flow constructor',
},
{
  displayName: 'Token Type',
  name: 'tokenType',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tokenManagement'],
      operation: ['issueTokens', 'moveTokens', 'redeemTokens', 'getTokenBalances', 'queryTokenBalances'],
    },
  },
  default: '',
  description: 'The type of token to operate on',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['tokenManagement'],
      operation: ['issueTokens', 'moveTokens', 'redeemTokens'],
    },
  },
  default: 0,
  description: 'The amount of tokens to operate on',
},
{
  displayName: 'Holder',
  name: 'holder',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tokenManagement'],
      operation: ['issueTokens', 'moveTokens', 'getTokenBalances'],
    },
  },
  default: '',
  description: 'The party that holds the tokens',
},
{
  displayName: 'Notary',
  name: 'notary',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tokenManagement'],
      operation: ['issueTokens'],
    },
  },
  default: '',
  description: 'The notary node for the transaction',
},
{
  displayName: 'New Holder',
  name: 'newHolder',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tokenManagement'],
      operation: ['moveTokens'],
    },
  },
  default: '',
  description: 'The party to receive the tokens',
},
{
  displayName: 'Issuer',
  name: 'issuer',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tokenManagement'],
      operation: ['redeemTokens'],
    },
  },
  default: '',
  description: 'The token issuer party',
},
{
  displayName: 'Criteria',
  name: 'criteria',
  type: 'json',
  required: false,
  displayOptions: {
    show: {
      resource: ['tokenManagement'],
      operation: ['queryTokenBalances'],
    },
  },
  default: '{}',
  description: 'Advanced query criteria as JSON object',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['tokenManagement'],
      operation: ['getTokenTypes'],
    },
  },
  default: 50,
  description: 'Maximum number of token types to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['tokenManagement'],
      operation: ['getTokenTypes'],
    },
  },
  default: 0,
  description: 'Number of token types to skip',
},
{
  displayName: 'Party Name',
  name: 'party',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['networkMap'],
      operation: ['getNetworkNode'],
    },
  },
  default: '',
  description: 'The party identifier to get information for',
},
{
  displayName: 'X.500 Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['networkMap'],
      operation: ['lookupPartyByName'],
    },
  },
  default: '',
  description: 'The X.500 distinguished name to search for',
},
{
  displayName: 'File Path',
  name: 'filePath',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['attachments'],
      operation: ['uploadAttachment'],
    },
  },
  default: '',
  description: 'Path to the file to upload as an attachment',
},
{
  displayName: 'Filename',
  name: 'filename',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['attachments'],
      operation: ['uploadAttachment'],
    },
  },
  default: '',
  description: 'Name for the uploaded file',
},
{
  displayName: 'Attachment ID',
  name: 'attachmentId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['attachments'],
      operation: ['getAttachment', 'deleteAttachment', 'getAttachmentMetadata'],
    },
  },
  default: '',
  description: 'The unique identifier of the attachment',
},
{
  displayName: 'Attachment ID',
  name: 'attachmentId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['attachments'],
      operation: ['verifyAttachment'],
    },
  },
  default: '',
  description: 'The unique identifier of the attachment to verify',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'vaultQuery':
        return [await executeVaultQueryOperations.call(this, items)];
      case 'flow':
        return [await executeFlowOperations.call(this, items)];
      case 'network':
        return [await executeNetworkOperations.call(this, items)];
      case 'identity':
        return [await executeIdentityOperations.call(this, items)];
      case 'transaction':
        return [await executeTransactionOperations.call(this, items)];
      case 'attachment':
        return [await executeAttachmentOperations.call(this, items)];
      case 'vaultQueries':
        return [await executeVaultQueriesOperations.call(this, items)];
      case 'flowExecution':
        return [await executeFlowExecutionOperations.call(this, items)];
      case 'tokenManagement':
        return [await executeTokenManagementOperations.call(this, items)];
      case 'networkMap':
        return [await executeNetworkMapOperations.call(this, items)];
      case 'attachments':
        return [await executeAttachmentsOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeVaultQueryOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('r3cordaApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      const auth = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');
      const baseHeaders = {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      switch (operation) {
        case 'queryVaultStates': {
          const contractStateType = this.getNodeParameter('contractStateType', i) as string;
          const criteria = this.getNodeParameter('criteria', i, '{}') as string;
          const sorting = this.getNodeParameter('sorting', i, '{}') as string;
          const paging = this.getNodeParameter('paging', i, '{"pageSize": 100, "pageNumber": 1}') as string;
          
          const queryParams = new URLSearchParams();
          queryParams.append('contractStateType', contractStateType);
          if (criteria && criteria !== '{}') queryParams.append('criteria', criteria);
          if (sorting && sorting !== '{}') queryParams.append('sorting', sorting);
          if (paging && paging !== '{}') queryParams.append('paging', paging);
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/vault/query?${queryParams.toString()}`,
            headers: baseHeaders,
            json: true,
            rejectUnauthorized: false
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'queryStatesByType': {
          const contractStateType = this.getNodeParameter('contractStateType', i) as string;
          const criteria = this.getNodeParameter('criteria', i, '{}') as string;
          
          const queryParams = new URLSearchParams();
          if (criteria && criteria !== '{}') queryParams.append('criteria', criteria);
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/vault/query/${encodeURIComponent(contractStateType)}${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
            headers: baseHeaders,
            json: true,
            rejectUnauthorized: false
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getAllStates': {
          const pageSize = this.getNodeParameter('pageSize', i, 100) as number;
          const pageNumber = this.getNodeParameter('pageNumber', i, 1) as number;
          
          const queryParams = new URLSearchParams();
          queryParams.append('pageSize', pageSize.toString());
          queryParams.append('pageNumber', pageNumber.toString());
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/vault/states?${queryParams.toString()}`,
            headers: baseHeaders,
            json: true,
            rejectUnauthorized: false
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getStateByRef': {
          const ref = this.getNodeParameter('ref', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/vault/states/${encodeURIComponent(ref)}`,
            headers: baseHeaders,
            json: true,
            rejectUnauthorized: false
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getLinearHeads': {
          const contractStateType = this.getNodeParameter('contractStateType', i) as string;
          
          const queryParams = new URLSearchParams();
          queryParams.append('contractStateType', contractStateType);
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/vault/linearheads?${queryParams.toString()}`,
            headers: baseHeaders,
            json: true,
            rejectUnauthorized: false
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeFlowOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('r3cordaApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'startFlow': {
					const flowName = this.getNodeParameter('flowName', i) as string;
					const flowArgsParam = this.getNodeParameter('flowArgs', i, '{}') as string;
					
					let flowArgs: any = {};
					if (flowArgsParam && flowArgsParam.trim() !== '{}') {
						try {
							flowArgs = JSON.parse(flowArgsParam);
						} catch (parseError: any) {
							throw new NodeOperationError(this.getNode(), `Invalid JSON in flow arguments: ${parseError.message}`, { itemIndex: i });
						}
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/flow/${encodeURIComponent(flowName)}`,
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
						},
						body: flowArgs,
						json: true,
						rejectUnauthorized: false,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getFlowStatus': {
					const flowId = this.getNodeParameter('id', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/flow/${encodeURIComponent(flowId)}`,
						headers: {
							'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
						},
						json: true,
						rejectUnauthorized: false,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAllFlows': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/flow`,
						headers: {
							'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
						},
						json: true,
						rejectUnauthorized: false,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'killFlow': {
					const flowId = this.getNodeParameter('id', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/flow/${encodeURIComponent(flowId)}`,
						headers: {
							'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
						},
						json: true,
						rejectUnauthorized: false,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getFlowCheckpoint': {
					const flowId = this.getNodeParameter('id', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/flow/checkpoint/${encodeURIComponent(flowId)}`,
						headers: {
							'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
						},
						json: true,
						rejectUnauthorized: false,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
						{ itemIndex: i },
					);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeNetworkOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('r3cordaApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getNetworkNodes': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/network/nodes`,
						headers: {
							'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
							'Content-Type': 'application/json',
						},
						json: true,
						rejectUnauthorized: false,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getNodeByHash': {
					const hash = this.getNodeParameter('hash', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/network/nodes/${hash}`,
						headers: {
							'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
							'Content-Type': 'application/json',
						},
						json: true,
						rejectUnauthorized: false,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getNotaries': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/network/notaries`,
						headers: {
							'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
							'Content-Type': 'application/json',
						},
						json: true,
						rejectUnauthorized: false,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getPeers': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/network/peers`,
						headers: {
							'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
							'Content-Type': 'application/json',
						},
						json: true,
						rejectUnauthorized: false,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getNetworkParameters': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/network/parameters`,
						headers: {
							'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
							'Content-Type': 'application/json',
						},
						json: true,
						rejectUnauthorized: false,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeIdentityOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('r3cordaApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getNodeIdentity': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/identity/me`,
            headers: {
              'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
              'Content-Type': 'application/json',
            },
            json: true,
            rejectUnauthorized: false,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAllParties': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/identity/parties`,
            headers: {
              'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
              'Content-Type': 'application/json',
            },
            json: true,
            rejectUnauthorized: false,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPartyByName': {
          const name = this.getNodeParameter('name', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/identity/parties/${encodeURIComponent(name)}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
              'Content-Type': 'application/json',
            },
            json: true,
            rejectUnauthorized: false,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'registerParty': {
          const partyInfo = this.getNodeParameter('partyInfo', i) as object;
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/identity/parties`,
            headers: {
              'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
              'Content-Type': 'application/json',
            },
            body: partyInfo,
            json: true,
            rejectUnauthorized: false,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPublicKeys': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/identity/keys`,
            headers: {
              'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
              'Content-Type': 'application/json',
            },
            json: true,
            rejectUnauthorized: false,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeTransactionOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('r3cordaApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			const baseOptions: any = {
				headers: {
					'Content-Type': 'application/json',
				},
				auth: {
					username: credentials.username,
					password: credentials.password,
				},
				json: true,
				rejectUnauthorized: false,
			};

			switch (operation) {
				case 'getTransaction': {
					const transactionId = this.getNodeParameter('transactionId', i) as string;
					const options: any = {
						...baseOptions,
						method: 'GET',
						url: `${credentials.baseUrl}/transactions/${transactionId}`,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getAllTransactions': {
					const pageSize = this.getNodeParameter('pageSize', i) as number;
					const pageNumber = this.getNodeParameter('pageNumber', i) as number;
					const options: any = {
						...baseOptions,
						method: 'GET',
						url: `${credentials.baseUrl}/transactions`,
						qs: {
							pageSize,
							pageNumber,
						},
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'verifyTransaction': {
					const transaction = this.getNodeParameter('transaction', i) as object;
					const options: any = {
						...baseOptions,
						method: 'POST',
						url: `${credentials.baseUrl}/transactions/verify`,
						body: transaction,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getTransactionOutputs': {
					const transactionId = this.getNodeParameter('transactionId', i) as string;
					const options: any = {
						...baseOptions,
						method: 'GET',
						url: `${credentials.baseUrl}/transactions/${transactionId}/outputs`,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getTransactionInputs': {
					const transactionId = this.getNodeParameter('transactionId', i) as string;
					const options: any = {
						...baseOptions,
						method: 'GET',
						url: `${credentials.baseUrl}/transactions/${transactionId}/inputs`,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeAttachmentOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('r3cordaApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			const baseUrl = credentials.baseUrl || 'https://localhost:10007';
			const auth = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');

			switch (operation) {
				case 'uploadAttachment': {
					const attachmentData = this.getNodeParameter('attachmentData', i) as string;
					
					const options: any = {
						method: 'POST',
						url: `${baseUrl}/api/rest/v1/attachments`,
						headers: {
							'Authorization': `Basic ${auth}`,
							'Content-Type': 'application/json',
						},
						body: {
							attachmentData,
						},
						json: true,
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAttachment': {
					const id = this.getNodeParameter('id', i) as string;
					
					const options: any = {
						method: 'GET',
						url: `${baseUrl}/api/rest/v1/attachments/${id}`,
						headers: {
							'Authorization': `Basic ${auth}`,
						},
						json: true,
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAllAttachments': {
					const options: any = {
						method: 'GET',
						url: `${baseUrl}/api/rest/v1/attachments`,
						headers: {
							'Authorization': `Basic ${auth}`,
						},
						json: true,
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteAttachment': {
					const id = this.getNodeParameter('id', i) as string;
					
					const options: any = {
						method: 'DELETE',
						url: `${baseUrl}/api/rest/v1/attachments/${id}`,
						headers: {
							'Authorization': `Basic ${auth}`,
						},
						json: true,
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAttachmentMetadata': {
					const id = this.getNodeParameter('id', i) as string;
					
					const options: any = {
						method: 'GET',
						url: `${baseUrl}/api/rest/v1/attachments/${id}/metadata`,
						headers: {
							'Authorization': `Basic ${auth}`,
						},
						json: true,
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,