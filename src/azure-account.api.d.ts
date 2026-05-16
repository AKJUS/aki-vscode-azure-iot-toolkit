/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event, Terminal, Progress, CancellationToken } from 'vscode';
import { Subscription } from "@azure/arm-subscriptions";
import { ReadStream } from 'fs';

export type AzureLoginStatus = 'Initializing' | 'LoggingIn' | 'LoggedIn' | 'LoggedOut';

export interface Environment {
	readonly name: string;
	readonly portalUrl: string;
	readonly managementEndpointUrl: string;
	readonly resourceManagerEndpointUrl: string;
	readonly activeDirectoryEndpointUrl: string;
	readonly activeDirectoryResourceId: string;
	[key: string]: any;
}

export interface AzureAccount {
	readonly status: AzureLoginStatus;
	readonly onStatusChanged: Event<AzureLoginStatus>;
	readonly waitForLogin: () => Promise<boolean>;
	readonly sessions: AzureSession[];
	readonly onSessionsChanged: Event<void>;
	readonly subscriptions: AzureSubscription[];
	readonly onSubscriptionsChanged: Event<void>;
	readonly waitForSubscriptions: () => Promise<boolean>;
	readonly filters: AzureResourceFilter[];
	readonly onFiltersChanged: Event<void>;
	readonly waitForFilters: () => Promise<boolean>;
	createCloudShell(os: 'Linux' | 'Windows'): CloudShell;
}

export interface AzureSession {
	readonly environment: Environment;
	readonly userId: string;
	readonly tenantId: string;
	readonly credentials2: any;
}

export interface AzureSubscription {
	readonly session: AzureSession;
	readonly subscription: Subscription;
}

export type AzureResourceFilter = AzureSubscription;

export type CloudShellStatus = 'Connecting' | 'Connected' | 'Disconnected';

export interface UploadOptions {
	contentLength?: number;
	progress?: Progress<{ message?: string; increment?: number }>;
	token?: CancellationToken;
}

export interface CloudShell {
	readonly status: CloudShellStatus;
	readonly onStatusChanged: Event<CloudShellStatus>;
	readonly waitForConnection: () => Promise<boolean>;
	readonly terminal: Promise<Terminal>;
	readonly session: Promise<AzureSession>;
	readonly uploadFile: (filename: string, stream: ReadStream, options?: UploadOptions) => Promise<void>;
}