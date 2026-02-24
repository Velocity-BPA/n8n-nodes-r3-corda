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
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
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
        default: 'vaultQueries',
      },
      // Operation dropdowns per resource
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
      // Parameter definitions
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

async function executeVaultQueriesOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('r3cordaApi') as any;

  const baseUrl = credentials.baseUrl || 'http://localhost:10006/api/rest/v1';
  const auth = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'queryVaultStates': {
          const stateType = this.getNodeParameter('stateType', i) as string;
          const criteria = this.getNodeParameter('criteria', i, '{}') as string;
          const sorting = this.getNodeParameter('sorting', i, '{}') as string;
          const paging = this.getNodeParameter('paging', i, '{"pageNumber": 1, "pageSize": 100}') as string;

          const requestBody: any = {
            stateType,
            criteria: JSON.parse(criteria),
            sorting: JSON.parse(sorting),
            paging: JSON.parse(paging),
          };

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/vault/query`,
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'queryVaultStatesByCriteria': {
          const contractStateType = this.getNodeParameter('contractStateType', i) as string;
          const criteria = this.getNodeParameter('criteria', i, '{}') as string;
          const sorting = this.getNodeParameter('sorting', i, '{}') as string;
          const paging = this.getNodeParameter('paging', i, '{"pageNumber": 1, "pageSize": 100}') as string;

          const requestBody: any = {
            contractStateType,
            criteria: JSON.parse(criteria),
            sorting: JSON.parse(sorting),
            paging: JSON.parse(paging),
          };

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/vault/query/by/criteria`,
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getVaultState': {
          const stateRef = this.getNodeParameter('stateRef', i) as string;

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/vault/states/${encodeURIComponent(stateRef)}`,
            headers: {
              'Authorization': `Basic ${auth}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'queryConsumableStates': {
          const stateType = this.getNodeParameter('stateType', i) as string;
          const criteria = this.getNodeParameter('criteria', i, '{}') as string;
          const sorting = this.getNodeParameter('sorting', i, '{}') as string;
          const paging = this.getNodeParameter('paging', i, '{"pageNumber": 1, "pageSize": 100}') as string;

          const requestBody: any = {
            stateType,
            criteria: JSON.parse(criteria),
            sorting: JSON.parse(sorting),
            paging: JSON.parse(paging),
          };

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/vault/query/consumable`,
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'queryVaultTransactions': {
          const criteria = this.getNodeParameter('criteria', i, '{}') as string;
          const sorting = this.getNodeParameter('sorting', i, '{}') as string;
          const paging = this.getNodeParameter('paging', i, '{"pageNumber": 1, "pageSize": 100}') as string;

          const requestBody: any = {
            criteria: JSON.parse(criteria),
            sorting: JSON.parse(sorting),
            paging: JSON.parse(paging),
          };

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/vault/transactions`,
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getVaultTransaction': {
          const txnId = this.getNodeParameter('txnId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/vault/transactions/${encodeURIComponent(txnId)}`,
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
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.response?.body) {
          throw new NodeApiError(this.getNode(), error.response.body);
        }
        throw error;
      }
    }
  }

  return returnData;
}

async function executeFlowExecutionOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('r3cordaApi') as any;

  const baseUrl = credentials.baseUrl || 'http://localhost:10006/api/rest/v1';
  const auth = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'startFlow': {
          const flowClassName = this.getNodeParameter('flowClassName', i) as string;
          const flowArgs = this.getNodeParameter('flowArgs', i, '{}') as string;
          
          let parsedArgs: any = {};
          try {
            parsedArgs = JSON.parse(flowArgs);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), `Invalid JSON in flow arguments: ${error.message}`);
          }

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/flows/${encodeURIComponent(flowClassName)}`,
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json',
            },
            body: parsedArgs,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getCompletedFlows': {
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;
          
          const queryParams = new URLSearchParams();
          queryParams.append('limit', limit.toString());
          queryParams.append('offset', offset.toString());

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/flows/completed?${queryParams.toString()}`,
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getFlowStatus': {
          const runId = this.getNodeParameter('runId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/flows/${encodeURIComponent(runId)}`,
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getFlowProgress': {
          const runId = this.getNodeParameter('runId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/flows/${encodeURIComponent(runId)}/progress`,
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'killFlow': {
          const runId = this.getNodeParameter('runId', i) as string;
          
          const options: any = {
            method: 'DELETE',
            url: `${baseUrl}/flows/${encodeURIComponent(runId)}`,
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'startTrackedFlow': {
          const flowClassName = this.getNodeParameter('flowClassName', i) as string;
          const flowArgs = this.getNodeParameter('flowArgs', i, '{}') as string;
          
          let parsedArgs: any = {};
          try {
            parsedArgs = JSON.parse(flowArgs);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), `Invalid JSON in flow arguments: ${error.message}`);
          }

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/flows/tracked/${encodeURIComponent(flowClassName)}`,
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json',
            },
            body: parsedArgs,
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
        pairedItem: { item: i } 
      });
      
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }
  
  return returnData;
}

async function executeTokenManagementOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('r3cordaApi') as any;

  const baseOptions: any = {
    headers: {
      'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    json: true,
  };

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'issueTokens': {
          const tokenType = this.getNodeParameter('tokenType', i) as string;
          const amount = this.getNodeParameter('amount', i) as number;
          const holder = this.getNodeParameter('holder', i) as string;
          const notary = this.getNodeParameter('notary', i) as string;

          const options: any = {
            ...baseOptions,
            method: 'POST',
            url: `${credentials.baseUrl}/tokens/issue`,
            body: {
              tokenType,
              amount,
              holder,
              notary,
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'moveTokens': {
          const tokenType = this.getNodeParameter('tokenType', i) as string;
          const amount = this.getNodeParameter('amount', i) as number;
          const holder = this.getNodeParameter('holder', i) as string;
          const newHolder = this.getNodeParameter('newHolder', i) as string;

          const options: any = {
            ...baseOptions,
            method: 'POST',
            url: `${credentials.baseUrl}/tokens/move`,
            body: {
              tokenType,
              amount,
              holder,
              newHolder,
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'redeemTokens': {
          const tokenType = this.getNodeParameter('tokenType', i) as string;
          const amount = this.getNodeParameter('amount', i) as number;
          const issuer = this.getNodeParameter('issuer', i) as string;

          const options: any = {
            ...baseOptions,
            method: 'POST',
            url: `${credentials.baseUrl}/tokens/redeem`,
            body: {
              tokenType,
              amount,
              issuer,
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTokenBalances': {
          const tokenType = this.getNodeParameter('tokenType', i) as string;
          const holder = this.getNodeParameter('holder', i) as string;

          const queryParams = new URLSearchParams({
            tokenType,
            holder,
          });

          const options: any = {
            ...baseOptions,
            method: 'GET',
            url: `${credentials.baseUrl}/tokens/balances?${queryParams.toString()}`,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'queryTokenBalances': {
          const tokenType = this.getNodeParameter('tokenType', i) as string;
          const criteriaInput = this.getNodeParameter('criteria', i, '{}') as string;
          
          let criteria: any = {};
          try {
            criteria = typeof criteriaInput === 'string' ? JSON.parse(criteriaInput) : criteriaInput;
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), `Invalid criteria JSON: ${error.message}`);
          }

          const options: any = {
            ...baseOptions,
            method: 'POST',
            url: `${credentials.baseUrl}/tokens/balances/query`,
            body: {
              criteria,
              tokenType,
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTokenTypes': {
          const limit = this.getNodeParameter('limit', i, 50) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const queryParams = new URLSearchParams({
            limit: limit.toString(),
            offset: offset.toString(),
          });

          const options: any = {
            ...baseOptions,
            method: 'GET',
            url: `${credentials.baseUrl}/tokens/types?${queryParams.toString()}`,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ 
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        if (error.response) {
          throw new NodeApiError(this.getNode(), error.response, {
            message: `R3 Corda Token Management API error: ${error.response.body?.message || error.message}`,
            httpCode: error.response.statusCode?.toString(),
          });
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeNetworkMapOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('r3cordaApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const baseUrl = credentials.baseUrl || 'http://localhost:10006/api/rest/v1';
      const auth = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');

      switch (operation) {
        case 'getNetworkNodes': {
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/network/nodes`,
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getNetworkNode': {
          const party = this.getNodeParameter('party', i) as string;
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/network/nodes/${encodeURIComponent(party)}`,
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getNetworkParties': {
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/network/parties`,
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getNodeInfo': {
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/network/parties/me`,
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getNotaries': {
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/network/notaries`,
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'lookupPartyByName': {
          const name = this.getNodeParameter('name', i) as string;
          const options: any = {
            method: 'POST',
            url: `${baseUrl}/network/parties/lookup`,
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/json',
            },
            body: {
              name: name,
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
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeAttachmentsOperations(
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
        case 'uploadAttachment': {
          const filePath = this.getNodeParameter('filePath', i) as string;
          const filename = this.getNodeParameter('filename', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/attachments`,
            headers: {
              'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
              'Content-Type': 'multipart/form-data',
            },
            formData: {
              file: filePath,
              filename: filename,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAttachment': {
          const attachmentId = this.getNodeParameter('attachmentId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/attachments/${attachmentId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
            },
            encoding: null,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listAttachments': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/attachments`,
            headers: {
              'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteAttachment': {
          const attachmentId = this.getNodeParameter('attachmentId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/attachments/${attachmentId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAttachmentMetadata': {
          const attachmentId = this.getNodeParameter('attachmentId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/attachments/${attachmentId}/metadata`,
            headers: {
              'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'verifyAttachment': {
          const attachmentId = this.getNodeParameter('attachmentId', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/attachments/verify`,
            headers: {
              'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              attachmentId: attachmentId,
            }),
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
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}
