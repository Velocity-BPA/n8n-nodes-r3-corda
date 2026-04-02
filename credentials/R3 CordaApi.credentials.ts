import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class R3CordaApi implements ICredentialType {
	name = 'r3CordaApi';
	displayName = 'R3 Corda API';
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://localhost:10007/api/rest/v1',
			description: 'Base URL for the R3 Corda REST API',
			required: true,
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			description: 'Username for HTTP Basic Authentication',
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
			description: 'Password for HTTP Basic Authentication',
			required: true,
		},
	];
}