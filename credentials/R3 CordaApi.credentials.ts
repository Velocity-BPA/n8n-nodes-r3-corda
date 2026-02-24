import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class R3CordaApi implements ICredentialType {
	name = 'r3CordaApi';
	displayName = 'R3 Corda API';
	documentationUrl = 'https://docs.r3.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'http://localhost:10006/api/rest/v1',
			description: 'The base URL of the R3 Corda RPC API endpoint',
			required: true,
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			description: 'RPC username configured in the Corda node',
			required: true,
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'RPC password for the configured user',
			required: true,
		},
	];
}