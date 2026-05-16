// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { TokenCredential, AccessToken } from "@azure/core-auth";
import { SubscriptionClient, Subscription } from "@azure/arm-subscriptions";
import * as vscode from "vscode";

const AZURE_SCOPES = ["https://management.azure.com/.default"];

/**
 * TokenCredential backed by VS Code's built-in Microsoft authentication provider.
 * Replaces the old azure-account extension dependency.
 */
export class VSCodeTokenCredential implements TokenCredential {
    private session: vscode.AuthenticationSession | undefined;

    async getToken(scopes: string | string[]): Promise<AccessToken> {
        const scopeArray = Array.isArray(scopes) ? scopes : [scopes];
        this.session = await vscode.authentication.getSession("microsoft", scopeArray, { createIfNone: false });
        if (!this.session) {
            throw new Error("Not signed in to Azure. Please sign in first.");
        }
        return {
            token: this.session.accessToken,
            // VS Code sessions don't expose expiry; set a short TTL so the SDK re-requests
            expiresOnTimestamp: Date.now() + 5 * 60 * 1000,
        };
    }
}

/**
 * Ensures the user is signed in to Azure via VS Code's Microsoft auth provider.
 * Prompts for login if no session exists.
 * @returns true if a session exists after the call
 */
export async function ensureLoggedIn(): Promise<boolean> {
    let session = await vscode.authentication.getSession("microsoft", AZURE_SCOPES, { createIfNone: false });
    if (!session) {
        session = await vscode.authentication.getSession("microsoft", AZURE_SCOPES, { createIfNone: true });
    }
    return !!session;
}

/**
 * Gets a TokenCredential for Azure management operations.
 */
export function getCredential(): VSCodeTokenCredential {
    return new VSCodeTokenCredential();
}

export interface AzureSubscriptionInfo {
    subscription: Subscription;
    subscriptionId: string;
    displayName: string;
}

/**
 * Lists all Azure subscriptions accessible with the current credential.
 */
export async function getSubscriptions(credential?: TokenCredential): Promise<AzureSubscriptionInfo[]> {
    const cred = credential || getCredential();
    const client = new SubscriptionClient(cred);
    const subscriptions: AzureSubscriptionInfo[] = [];
    for await (const sub of client.subscriptions.list()) {
        subscriptions.push({
            subscription: sub,
            subscriptionId: sub.subscriptionId,
            displayName: sub.displayName || sub.subscriptionId,
        });
    }
    return subscriptions;
}
