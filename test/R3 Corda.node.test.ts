/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { R3Corda } from '../nodes/R3 Corda/R3 Corda.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('R3Corda Node', () => {
  let node: R3Corda;

  beforeAll(() => {
    node = new R3Corda();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('R3 Corda');
      expect(node.description.name).toBe('r3corda');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 5 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(5);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(5);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('VaultQueries Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        username: 'test-user',
        password: 'test-password',
        baseUrl: 'http://localhost:10006/api/rest/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('queryVaultStates', () => {
    it('should query vault states successfully', async () => {
      const mockResponse = {
        states: [
          { ref: 'state1', data: 'test data 1' },
          { ref: 'state2', data: 'test data 2' },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'queryVaultStates';
          case 'stateType':
            return 'com.example.TestState';
          case 'criteria':
            return '{"status": "ACTIVE"}';
          case 'sorting':
            return '{}';
          case 'paging':
            return '{"pageNumber": 1, "pageSize": 100}';
          default:
            return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeVaultQueriesOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });

    it('should handle errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'queryVaultStates';
          case 'stateType':
            return 'com.example.TestState';
          default:
            return '{}';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const items = [{ json: {} }];

      await expect(executeVaultQueriesOperations.call(mockExecuteFunctions, items))
        .rejects.toThrow('API Error');
    });
  });

  describe('getVaultState', () => {
    it('should retrieve specific vault state successfully', async () => {
      const mockResponse = {
        ref: 'test-state-ref',
        data: 'test state data',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getVaultState';
          case 'stateRef':
            return 'test-state-ref';
          default:
            return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeVaultQueriesOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('queryVaultTransactions', () => {
    it('should query vault transactions successfully', async () => {
      const mockResponse = {
        transactions: [
          { id: 'tx1', timestamp: '2023-01-01T00:00:00Z' },
          { id: 'tx2', timestamp: '2023-01-02T00:00:00Z' },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'queryVaultTransactions';
          case 'criteria':
            return '{"status": "VERIFIED"}';
          case 'sorting':
            return '{}';
          case 'paging':
            return '{"pageNumber": 1, "pageSize": 100}';
          default:
            return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeVaultQueriesOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('getVaultTransaction', () => {
    it('should retrieve specific transaction successfully', async () => {
      const mockResponse = {
        id: 'test-txn-id',
        timestamp: '2023-01-01T00:00:00Z',
        inputs: [],
        outputs: [],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getVaultTransaction';
          case 'txnId':
            return 'test-txn-id';
          default:
            return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeVaultQueriesOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });
  });
});

describe('FlowExecution Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        username: 'test-user',
        password: 'test-password',
        baseUrl: 'http://localhost:10006/api/rest/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('startFlow operation should start a new flow execution', async () => {
    const mockResponse = {
      runId: 'test-run-id-123',
      flowClass: 'com.example.TestFlow',
      status: 'RUNNING',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'startFlow';
        case 'flowClassName': return 'com.example.TestFlow';
        case 'flowArgs': return '{"param1": "value1"}';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeFlowExecutionOperations.call(mockExecuteFunctions, items);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'http://localhost:10006/api/rest/v1/flows/com.example.TestFlow',
      headers: {
        'Authorization': expect.stringContaining('Basic '),
        'Content-Type': 'application/json',
      },
      body: { param1: 'value1' },
      json: true,
    });

    expect(result).toEqual([
      { json: mockResponse, pairedItem: { item: 0 } }
    ]);
  });

  test('getCompletedFlows operation should list completed flows', async () => {
    const mockResponse = {
      flows: [
        { runId: 'flow-1', status: 'COMPLETED' },
        { runId: 'flow-2', status: 'COMPLETED' }
      ],
      total: 2
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getCompletedFlows';
        case 'limit': return 50;
        case 'offset': return 0;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeFlowExecutionOperations.call(mockExecuteFunctions, items);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'http://localhost:10006/api/rest/v1/flows/completed?limit=50&offset=0',
      headers: {
        'Authorization': expect.stringContaining('Basic '),
        'Content-Type': 'application/json',
      },
      json: true,
    });

    expect(result).toEqual([
      { json: mockResponse, pairedItem: { item: 0 } }
    ]);
  });

  test('getFlowStatus operation should get flow status', async () => {
    const mockResponse = {
      runId: 'test-run-id',
      status: 'RUNNING',
      progress: 0.5
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getFlowStatus';
        case 'runId': return 'test-run-id';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeFlowExecutionOperations.call(mockExecuteFunctions, items);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'http://localhost:10006/api/rest/v1/flows/test-run-id',
      headers: {
        'Authorization': expect.stringContaining('Basic '),
        'Content-Type': 'application/json',
      },
      json: true,
    });

    expect(result).toEqual([
      { json: mockResponse, pairedItem: { item: 0 } }
    ]);
  });

  test('killFlow operation should terminate a running flow', async () => {
    const mockResponse = {
      runId: 'test-run-id',
      status: 'KILLED',
      message: 'Flow terminated successfully'
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'killFlow';
        case 'runId': return 'test-run-id';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeFlowExecutionOperations.call(mockExecuteFunctions, items);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: 'http://localhost:10006/api/rest/v1/flows/test-run-id',
      headers: {
        'Authorization': expect.stringContaining('Basic '),
        'Content-Type': 'application/json',
      },
      json: true,
    });

    expect(result).toEqual([
      { json: mockResponse, pairedItem: { item: 0 } }
    ]);
  });

  test('should handle invalid JSON in flow arguments', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'startFlow';
        case 'flowClassName': return 'com.example.TestFlow';
        case 'flowArgs': return 'invalid json';
        default: return undefined;
      }
    });

    const items = [{ json: {} }];

    await expect(executeFlowExecutionOperations.call(mockExecuteFunctions, items))
      .rejects.toThrow('Invalid JSON in flow arguments');
  });

  test('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getFlowStatus';
        case 'runId': return 'non-existent-run-id';
        default: return undefined;
      }
    });

    const apiError = new Error('Flow not found');
    (apiError as any).httpCode = 404;
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

    const items = [{ json: {} }];

    await expect(executeFlowExecutionOperations.call(mockExecuteFunctions, items))
      .rejects.toThrow('Flow not found');
  });
});

describe('TokenManagement Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        username: 'test-user',
        password: 'test-password',
        baseUrl: 'http://localhost:10006/api/rest/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('issueTokens operation should work correctly', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'issueTokens';
        case 'tokenType': return 'USD';
        case 'amount': return 1000;
        case 'holder': return 'O=PartyA,L=London,C=GB';
        case 'notary': return 'O=Notary,L=London,C=GB';
        default: return undefined;
      }
    });

    const mockResponse = {
      transactionId: 'tx-123',
      tokenType: 'USD',
      amount: 1000,
      status: 'COMMITTED',
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTokenManagementOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([
      {
        json: mockResponse,
        pairedItem: { item: 0 },
      },
    ]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      headers: {
        'Authorization': expect.stringContaining('Basic '),
        'Content-Type': 'application/json',
      },
      json: true,
      method: 'POST',
      url: 'http://localhost:10006/api/rest/v1/tokens/issue',
      body: {
        tokenType: 'USD',
        amount: 1000,
        holder: 'O=PartyA,L=London,C=GB',
        notary: 'O=Notary,L=London,C=GB',
      },
    });
  });

  test('moveTokens operation should work correctly', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'moveTokens';
        case 'tokenType': return 'USD';
        case 'amount': return 500;
        case 'holder': return 'O=PartyA,L=London,C=GB';
        case 'newHolder': return 'O=PartyB,L=London,C=GB';
        default: return undefined;
      }
    });

    const mockResponse = {
      transactionId: 'tx-456',
      transferAmount: 500,
      status: 'COMMITTED',
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTokenManagementOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([
      {
        json: mockResponse,
        pairedItem: { item: 0 },
      },
    ]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      headers: {
        'Authorization': expect.stringContaining('Basic '),
        'Content-Type': 'application/json',
      },
      json: true,
      method: 'POST',
      url: 'http://localhost:10006/api/rest/v1/tokens/move',
      body: {
        tokenType: 'USD',
        amount: 500,
        holder: 'O=PartyA,L=London,C=GB',
        newHolder: 'O=PartyB,L=London,C=GB',
      },
    });
  });

  test('getTokenBalances operation should work correctly', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getTokenBalances';
        case 'tokenType': return 'USD';
        case 'holder': return 'O=PartyA,L=London,C=GB';
        default: return undefined;
      }
    });

    const mockResponse = {
      balances: [
        { tokenType: 'USD', amount: 1500, holder: 'O=PartyA,L=London,C=GB' },
      ],
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTokenManagementOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([
      {
        json: mockResponse,
        pairedItem: { item: 0 },
      },
    ]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      headers: {
        'Authorization': expect.stringContaining('Basic '),
        'Content-Type': 'application/json',
      },
      json: true,
      method: 'GET',
      url: expect.stringContaining('/tokens/balances?tokenType=USD&holder=O%3DPartyA%2CL%3DLondon%2CC%3DGB'),
    });
  });

  test('error handling should work correctly', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'issueTokens';
        default: return undefined;
      }
    });

    const mockError = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

    const items = [{ json: {} }];

    await expect(
      executeTokenManagementOperations.call(mockExecuteFunctions, items)
    ).rejects.toThrow('API Error');
  });

  test('continueOnFail should handle errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'issueTokens';
        default: return undefined;
      }
    });

    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    const mockError = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

    const items = [{ json: {} }];
    const result = await executeTokenManagementOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([
      {
        json: { error: 'API Error' },
        pairedItem: { item: 0 },
      },
    ]);
  });
});

describe('NetworkMap Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        username: 'test-user',
        password: 'test-password',
        baseUrl: 'http://localhost:10006/api/rest/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should get network nodes successfully', async () => {
    const mockNodes = [
      {
        nodeInfo: {
          addresses: ['localhost:10005'],
          legalIdentities: [{ name: 'O=PartyA,L=London,C=GB' }],
        },
      },
    ];

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getNetworkNodes';
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockNodes);

    const items = [{ json: {} }];
    const result = await executeNetworkMapOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockNodes);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'http://localhost:10006/api/rest/v1/network/nodes',
      headers: {
        'Authorization': expect.stringMatching(/^Basic /),
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should get specific network node successfully', async () => {
    const mockNode = {
      nodeInfo: {
        addresses: ['localhost:10005'],
        legalIdentities: [{ name: 'O=PartyA,L=London,C=GB' }],
      },
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getNetworkNode';
      if (param === 'party') return 'O=PartyA,L=London,C=GB';
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockNode);

    const items = [{ json: {} }];
    const result = await executeNetworkMapOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockNode);
  });

  test('should get network parties successfully', async () => {
    const mockParties = [
      { name: 'O=PartyA,L=London,C=GB' },
      { name: 'O=PartyB,L=New York,C=US' },
    ];

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getNetworkParties';
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockParties);

    const items = [{ json: {} }];
    const result = await executeNetworkMapOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockParties);
  });

  test('should get current node info successfully', async () => {
    const mockNodeInfo = {
      addresses: ['localhost:10005'],
      legalIdentities: [{ name: 'O=MyNode,L=London,C=GB' }],
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getNodeInfo';
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockNodeInfo);

    const items = [{ json: {} }];
    const result = await executeNetworkMapOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockNodeInfo);
  });

  test('should get notaries successfully', async () => {
    const mockNotaries = [
      {
        identity: { name: 'O=Notary,L=London,C=GB' },
        validating: false,
      },
    ];

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getNotaries';
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockNotaries);

    const items = [{ json: {} }];
    const result = await executeNetworkMapOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockNotaries);
  });

  test('should lookup party by name successfully', async () => {
    const mockParty = {
      name: 'O=PartyA,L=London,C=GB',
      owningKey: 'test-key',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'lookupPartyByName';
      if (param === 'name') return 'O=PartyA,L=London,C=GB';
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockParty);

    const items = [{ json: {} }];
    const result = await executeNetworkMapOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockParty);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'http://localhost:10006/api/rest/v1/network/parties/lookup',
      headers: {
        'Authorization': expect.stringMatching(/^Basic /),
        'Content-Type': 'application/json',
      },
      body: {
        name: 'O=PartyA,L=London,C=GB',
      },
      json: true,
    });
  });

  test('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getNetworkNodes';
      return null;
    });

    const apiError = new Error('Network error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

    const items = [{ json: {} }];

    await expect(executeNetworkMapOperations.call(mockExecuteFunctions, items)).rejects.toThrow('Network error');
  });

  test('should continue on fail when configured', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getNetworkNodes';
      return null;
    });

    const apiError = new Error('Network error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

    const items = [{ json: {} }];
    const result = await executeNetworkMapOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'Network error' });
  });
});

describe('Attachments Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        username: 'test-user',
        password: 'test-password',
        baseUrl: 'http://localhost:10006/api/rest/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  it('should upload attachment successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('uploadAttachment')
      .mockReturnValueOnce('/path/to/file.jar')
      .mockReturnValueOnce('contract.jar');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      attachmentId: 'att-123',
      filename: 'contract.jar',
      size: 1024,
      uploadedAt: '2024-01-01T00:00:00Z',
    });

    const result = await executeAttachmentsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.attachmentId).toBe('att-123');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'http://localhost:10006/api/rest/v1/attachments',
      headers: {
        'Authorization': expect.stringContaining('Basic '),
        'Content-Type': 'multipart/form-data',
      },
      formData: {
        file: '/path/to/file.jar',
        filename: 'contract.jar',
      },
      json: true,
    });
  });

  it('should get attachment successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAttachment')
      .mockReturnValueOnce('att-123');

    const mockFileBuffer = Buffer.from('mock file content');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockFileBuffer);

    const result = await executeAttachmentsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockFileBuffer);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'http://localhost:10006/api/rest/v1/attachments/att-123',
      headers: {
        'Authorization': expect.stringContaining('Basic '),
      },
      encoding: null,
    });
  });

  it('should list attachments successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('listAttachments');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      attachments: [
        { attachmentId: 'att-123', filename: 'contract1.jar', size: 1024 },
        { attachmentId: 'att-456', filename: 'contract2.jar', size: 2048 },
      ],
    });

    const result = await executeAttachmentsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.attachments).toHaveLength(2);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'http://localhost:10006/api/rest/v1/attachments',
      headers: {
        'Authorization': expect.stringContaining('Basic '),
      },
      json: true,
    });
  });

  it('should delete attachment successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('deleteAttachment')
      .mockReturnValueOnce('att-123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      message: 'Attachment deleted successfully',
      attachmentId: 'att-123',
    });

    const result = await executeAttachmentsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.message).toBe('Attachment deleted successfully');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: 'http://localhost:10006/api/rest/v1/attachments/att-123',
      headers: {
        'Authorization': expect.stringContaining('Basic '),
      },
      json: true,
    });
  });

  it('should get attachment metadata successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAttachmentMetadata')
      .mockReturnValueOnce('att-123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      attachmentId: 'att-123',
      filename: 'contract.jar',
      size: 1024,
      checksum: 'sha256-abcd1234',
      uploadedAt: '2024-01-01T00:00:00Z',
      contentType: 'application/java-archive',
    });

    const result = await executeAttachmentsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.attachmentId).toBe('att-123');
    expect(result[0].json.checksum).toBe('sha256-abcd1234');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'http://localhost:10006/api/rest/v1/attachments/att-123/metadata',
      headers: {
        'Authorization': expect.stringContaining('Basic '),
      },
      json: true,
    });
  });

  it('should verify attachment successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('verifyAttachment')
      .mockReturnValueOnce('att-123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      attachmentId: 'att-123',
      verified: true,
      checksum: 'sha256-abcd1234',
      message: 'Attachment integrity verified',
    });

    const result = await executeAttachmentsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.verified).toBe(true);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'http://localhost:10006/api/rest/v1/attachments/verify',
      headers: {
        'Authorization': expect.stringContaining('Basic '),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        attachmentId: 'att-123',
      }),
      json: true,
    });
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAttachment')
      .mockReturnValueOnce('invalid-id');

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
      new Error('Attachment not found'),
    );
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeAttachmentsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Attachment not found');
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    await expect(
      executeAttachmentsOperations.call(mockExecuteFunctions, [{ json: {} }]),
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});
});
