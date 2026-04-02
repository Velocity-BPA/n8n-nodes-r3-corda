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

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
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
describe('VaultQuery Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        username: 'test-user',
        password: 'test-password',
        baseUrl: 'https://localhost:10007/api/rest/v1'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  describe('queryVaultStates operation', () => {
    it('should query vault states successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('queryVaultStates')
        .mockReturnValueOnce('com.example.State')
        .mockReturnValueOnce('{}')
        .mockReturnValueOnce('{}')
        .mockReturnValueOnce('{"pageSize": 100, "pageNumber": 1}');
      
      const mockResponse = { states: [], totalStatesAvailable: 0 };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeVaultQueryOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/vault/query'),
          headers: expect.objectContaining({
            'Authorization': expect.stringMatching(/^Basic /),
          }),
        })
      );
    });

    it('should handle query vault states error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('queryVaultStates')
        .mockReturnValueOnce('com.example.State');
      
      const error = new Error('Network error');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeVaultQueryOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ error: 'Network error' });
    });
  });

  describe('getStateByRef operation', () => {
    it('should get state by reference successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getStateByRef')
        .mockReturnValueOnce('state-ref-123');
      
      const mockResponse = { state: { data: 'test' } };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeVaultQueryOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/vault/states/state-ref-123'),
        })
      );
    });
  });

  describe('getAllStates operation', () => {
    it('should get all states successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllStates')
        .mockReturnValueOnce(50)
        .mockReturnValueOnce(2);
      
      const mockResponse = { states: [], totalStatesAvailable: 0 };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeVaultQueryOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('pageSize=50&pageNumber=2'),
        })
      );
    });
  });
});

describe('Flow Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				baseUrl: 'https://localhost:10007/api/rest/v1',
				username: 'test-user',
				password: 'test-password',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('startFlow', () => {
		it('should start a flow successfully', async () => {
			const mockResponse = { flowId: 'test-flow-123', status: 'RUNNING' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('startFlow')
				.mockReturnValueOnce('com.example.TestFlow')
				.mockReturnValueOnce('{"param1": "value1"}');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeFlowOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://localhost:10007/api/rest/v1/flow/com.example.TestFlow',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Basic dGVzdC11c2VyOnRlc3QtcGFzc3dvcmQ=',
				},
				body: { param1: 'value1' },
				json: true,
				rejectUnauthorized: false,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle flow start errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('startFlow')
				.mockReturnValueOnce('com.example.TestFlow')
				.mockReturnValueOnce('{}');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Flow not found'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeFlowOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'Flow not found' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getFlowStatus', () => {
		it('should get flow status successfully', async () => {
			const mockResponse = { flowId: 'test-flow-123', status: 'COMPLETED' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getFlowStatus')
				.mockReturnValueOnce('test-flow-123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeFlowOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://localhost:10007/api/rest/v1/flow/test-flow-123',
				headers: {
					'Authorization': 'Basic dGVzdC11c2VyOnRlc3QtcGFzc3dvcmQ=',
				},
				json: true,
				rejectUnauthorized: false,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getAllFlows', () => {
		it('should get all flows successfully', async () => {
			const mockResponse = [{ flowId: 'flow1', status: 'RUNNING' }, { flowId: 'flow2', status: 'COMPLETED' }];
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllFlows');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeFlowOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://localhost:10007/api/rest/v1/flow',
				headers: {
					'Authorization': 'Basic dGVzdC11c2VyOnRlc3QtcGFzc3dvcmQ=',
				},
				json: true,
				rejectUnauthorized: false,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('killFlow', () => {
		it('should kill flow successfully', async () => {
			const mockResponse = { flowId: 'test-flow-123', status: 'KILLED' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('killFlow')
				.mockReturnValueOnce('test-flow-123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeFlowOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://localhost:10007/api/rest/v1/flow/test-flow-123',
				headers: {
					'Authorization': 'Basic dGVzdC11c2VyOnRlc3QtcGFzc3dvcmQ=',
				},
				json: true,
				rejectUnauthorized: false,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getFlowCheckpoint', () => {
		it('should get flow checkpoint successfully', async () => {
			const mockResponse = { flowId: 'test-flow-123', checkpoint: 'checkpoint-data' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getFlowCheckpoint')
				.mockReturnValueOnce('test-flow-123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeFlowOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://localhost:10007/api/rest/v1/flow/checkpoint/test-flow-123',
				headers: {
					'Authorization': 'Basic dGVzdC11c2VyOnRlc3QtcGFzc3dvcmQ=',
				},
				json: true,
				rejectUnauthorized: false,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});

describe('Network Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				baseUrl: 'https://localhost:10007/api/rest/v1',
				username: 'test-user',
				password: 'test-pass',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should get network nodes successfully', async () => {
		const mockNodes = [{ hash: 'node1', info: 'test' }];
		mockExecuteFunctions.getNodeParameter.mockReturnValue('getNetworkNodes');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockNodes);

		const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: mockNodes, pairedItem: { item: 0 } }]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://localhost:10007/api/rest/v1/network/nodes',
			headers: {
				'Authorization': expect.stringContaining('Basic'),
				'Content-Type': 'application/json',
			},
			json: true,
			rejectUnauthorized: false,
		});
	});

	it('should get node by hash successfully', async () => {
		const mockNode = { hash: 'test-hash', info: 'test' };
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getNodeByHash')
			.mockReturnValueOnce('test-hash');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockNode);

		const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: mockNode, pairedItem: { item: 0 } }]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://localhost:10007/api/rest/v1/network/nodes/test-hash',
			headers: {
				'Authorization': expect.stringContaining('Basic'),
				'Content-Type': 'application/json',
			},
			json: true,
			rejectUnauthorized: false,
		});
	});

	it('should get notaries successfully', async () => {
		const mockNotaries = [{ name: 'notary1' }];
		mockExecuteFunctions.getNodeParameter.mockReturnValue('getNotaries');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockNotaries);

		const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: mockNotaries, pairedItem: { item: 0 } }]);
	});

	it('should get peers successfully', async () => {
		const mockPeers = [{ name: 'peer1' }];
		mockExecuteFunctions.getNodeParameter.mockReturnValue('getPeers');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockPeers);

		const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: mockPeers, pairedItem: { item: 0 } }]);
	});

	it('should get network parameters successfully', async () => {
		const mockParams = { maxTransactionSize: 1000 };
		mockExecuteFunctions.getNodeParameter.mockReturnValue('getNetworkParameters');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockParams);

		const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: mockParams, pairedItem: { item: 0 } }]);
	});

	it('should handle errors when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('getNetworkNodes');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: { error: 'Network error' }, pairedItem: { item: 0 } }]);
	});

	it('should throw error when continueOnFail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('getNetworkNodes');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);

		await expect(executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Network error');
	});
});

describe('Identity Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        username: 'test-user',
        password: 'test-password',
        baseUrl: 'https://localhost:10007/api/rest/v1',
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

  describe('getNodeIdentity operation', () => {
    it('should successfully get node identity', async () => {
      const mockResponse = { name: 'O=TestNode,L=London,C=GB', owningKey: 'test-key' };
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getNodeIdentity');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeIdentityOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle errors in getNodeIdentity', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getNodeIdentity');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeIdentityOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Network error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getAllParties operation', () => {
    it('should successfully get all parties', async () => {
      const mockResponse = [{ name: 'Party1' }, { name: 'Party2' }];
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllParties');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeIdentityOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getPartyByName operation', () => {
    it('should successfully get party by name', async () => {
      const mockResponse = { name: 'TestParty', owningKey: 'test-key' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPartyByName')
        .mockReturnValueOnce('TestParty');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeIdentityOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('registerParty operation', () => {
    it('should successfully register party', async () => {
      const partyInfo = { name: 'NewParty', address: 'localhost:10008' };
      const mockResponse = { success: true, partyId: 'party-123' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('registerParty')
        .mockReturnValueOnce(partyInfo);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeIdentityOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getPublicKeys operation', () => {
    it('should successfully get public keys', async () => {
      const mockResponse = { keys: ['key1', 'key2'] };
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getPublicKeys');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeIdentityOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Transaction Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				username: 'test-user',
				password: 'test-pass',
				baseUrl: 'https://localhost:10007/api/rest/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getTransaction', () => {
		it('should get transaction by ID successfully', async () => {
			const mockResponse = { id: 'tx123', status: 'VERIFIED' };
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTransaction').mockReturnValueOnce('tx123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

			const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://localhost:10007/api/rest/v1/transactions/tx123',
				headers: { 'Content-Type': 'application/json' },
				auth: { username: 'test-user', password: 'test-pass' },
				json: true,
				rejectUnauthorized: false,
			});
		});

		it('should handle getTransaction error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTransaction').mockReturnValueOnce('tx123');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValueOnce(new Error('Transaction not found'));
			mockExecuteFunctions.continueOnFail.mockReturnValueOnce(true);

			const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'Transaction not found' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getAllTransactions', () => {
		it('should get all transactions successfully', async () => {
			const mockResponse = { transactions: [], totalCount: 0 };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllTransactions')
				.mockReturnValueOnce(10)
				.mockReturnValueOnce(1);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

			const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('verifyTransaction', () => {
		it('should verify transaction successfully', async () => {
			const mockTransaction = { id: 'tx123', data: 'test' };
			const mockResponse = { isValid: true };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('verifyTransaction')
				.mockReturnValueOnce(mockTransaction);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

			const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getTransactionOutputs', () => {
		it('should get transaction outputs successfully', async () => {
			const mockResponse = { outputs: [] };
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTransactionOutputs').mockReturnValueOnce('tx123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

			const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getTransactionInputs', () => {
		it('should get transaction inputs successfully', async () => {
			const mockResponse = { inputs: [] };
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTransactionInputs').mockReturnValueOnce('tx123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

			const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});

describe('Attachment Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				username: 'test-user',
				password: 'test-pass',
				baseUrl: 'https://localhost:10007',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('uploadAttachment', () => {
		it('should upload attachment successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('uploadAttachment')
				.mockReturnValueOnce('test-attachment-data');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'attachment-123',
				status: 'uploaded',
			});

			const result = await executeAttachmentOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://localhost:10007/api/rest/v1/attachments',
				headers: {
					'Authorization': expect.stringMatching(/^Basic /),
					'Content-Type': 'application/json',
				},
				body: {
					attachmentData: 'test-attachment-data',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: { id: 'attachment-123', status: 'uploaded' },
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle upload attachment error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('uploadAttachment')
				.mockReturnValueOnce('test-attachment-data');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Upload failed'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeAttachmentOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: { error: 'Upload failed' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getAttachment', () => {
		it('should get attachment successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAttachment')
				.mockReturnValueOnce('attachment-123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'attachment-123',
				data: 'attachment-content',
			});

			const result = await executeAttachmentOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://localhost:10007/api/rest/v1/attachments/attachment-123',
				headers: {
					'Authorization': expect.stringMatching(/^Basic /),
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: { id: 'attachment-123', data: 'attachment-content' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getAllAttachments', () => {
		it('should get all attachments successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllAttachments');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue([
				{ id: 'attachment-1', name: 'attachment1.jar' },
				{ id: 'attachment-2', name: 'attachment2.jar' },
			]);

			const result = await executeAttachmentOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://localhost:10007/api/rest/v1/attachments',
				headers: {
					'Authorization': expect.stringMatching(/^Basic /),
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: [
						{ id: 'attachment-1', name: 'attachment1.jar' },
						{ id: 'attachment-2', name: 'attachment2.jar' },
					],
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('deleteAttachment', () => {
		it('should delete attachment successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteAttachment')
				.mockReturnValueOnce('attachment-123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				message: 'Attachment deleted successfully',
			});

			const result = await executeAttachmentOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://localhost:10007/api/rest/v1/attachments/attachment-123',
				headers: {
					'Authorization': expect.stringMatching(/^Basic /),
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: { message: 'Attachment deleted successfully' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getAttachmentMetadata', () => {
		it('should get attachment metadata successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAttachmentMetadata')
				.mockReturnValueOnce('attachment-123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				id: 'attachment-123',
				filename: 'contract.jar',
				size: 1024,
				uploadDate: '2023-01-01T00:00:00Z',
			});

			const result = await executeAttachmentOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://localhost:10007/api/rest/v1/attachments/attachment-123/metadata',
				headers: {
					'Authorization': expect.stringMatching(/^Basic /),
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: {
						id: 'attachment-123',
						filename: 'contract.jar',
						size: 1024,
						uploadDate: '2023-01-01T00:00:00Z',
					},
					pairedItem: { item: 0 },
				},
			]);
		});
	});
});
});
