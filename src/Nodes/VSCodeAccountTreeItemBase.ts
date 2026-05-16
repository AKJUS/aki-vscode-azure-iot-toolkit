// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { SubscriptionClient } from "@azure/arm-subscriptions";
import { Environment } from "@azure/ms-rest-azure-env";
import * as vscode from "vscode";
import { AzExtParentTreeItem, AzExtTreeItem, IActionContext, ISubscriptionContext } from "@microsoft/vscode-azext-utils";
import { getCredential } from "../azureAuth";

const AZURE_SCOPES = ["https://management.azure.com/.default"];

/**
 * Base tree item representing an Azure account.
 * Replaces AzureAccountTreeItemBase from @microsoft/vscode-azext-azureutils
 * which requires the azure-account extension.
 */
export abstract class VSCodeAccountTreeItemBase extends AzExtParentTreeItem {
    public static readonly contextValue = "azureextensionui.azureAccount";
    public contextValue = VSCodeAccountTreeItemBase.contextValue;
    public label = "Azure";
    public childTypeLabel = "subscription";
    public autoSelectInTreeItemPicker = true;

    private _subscriptionItems: AzExtTreeItem[] | undefined;

    public abstract createSubscriptionTreeItem(root: ISubscriptionContext): VSCodeSubscriptionTreeItemBase | Promise<VSCodeSubscriptionTreeItemBase>;

    public dispose(): void {
        // No-op — no listeners to clean up
    }

    public hasMoreChildrenImpl(): boolean {
        return false;
    }

    public async loadMoreChildrenImpl(_clearCache: boolean, context: IActionContext): Promise<AzExtTreeItem[]> {
        const session = await vscode.authentication.getSession("microsoft", AZURE_SCOPES, { createIfNone: false });
        if (!session) {
            return [new SignInTreeItem(this)];
        }

        const credential = getCredential();
        const client = new SubscriptionClient(credential);
        const subscriptions: AzExtTreeItem[] = [];

        for await (const sub of client.subscriptions.list()) {
            if (!sub.subscriptionId) {
                continue;
            }
            const cred = getCredential();
            const subContext: ISubscriptionContext = {
                subscriptionDisplayName: sub.displayName || "",
                subscriptionId: sub.subscriptionId,
                subscriptionPath: `/subscriptions/${sub.subscriptionId}`,
                tenantId: sub.tenantId || "",
                userId: session.account.id,
                credentials: cred,
                createCredentialsForScopes: async () => cred as any,
                environment: Environment.AzureCloud,
                isCustomCloud: false,
            };
            subscriptions.push(await this.createSubscriptionTreeItem(subContext));
        }

        this._subscriptionItems = subscriptions;
        return subscriptions;
    }

    public async pickTreeItemImpl(expectedContextValues: (string | RegExp)[]): Promise<AzExtTreeItem | undefined> {
        if (this._subscriptionItems && this._subscriptionItems.length === 1) {
            return this._subscriptionItems[0];
        }
        return undefined;
    }

    public async getIsLoggedIn(): Promise<boolean> {
        const session = await vscode.authentication.getSession("microsoft", AZURE_SCOPES, { createIfNone: false });
        return !!session;
    }
}

/**
 * Base tree item representing an Azure subscription.
 * Replaces SubscriptionTreeItemBase from @microsoft/vscode-azext-azureutils.
 */
export abstract class VSCodeSubscriptionTreeItemBase extends AzExtParentTreeItem {
    public static readonly contextValue = "azureextensionui.azureSubscription";
    public readonly contextValue = VSCodeSubscriptionTreeItemBase.contextValue;
    public readonly label: string;

    constructor(parent: AzExtParentTreeItem, public readonly root: ISubscriptionContext) {
        super(parent);
        this.label = root.subscriptionDisplayName;
        this.id = root.subscriptionPath;
        // Set _subscription so child tree items can find it via .subscription getter
        (this as any)._subscription = root;
        // Also override the getter on this instance to ensure it always returns root
        Object.defineProperty(this, "subscription", {
            get: () => root,
            configurable: true,
        });
    }
}

/**
 * Tree item shown when user is not signed in.
 */
class SignInTreeItem extends AzExtTreeItem {
    public readonly contextValue = "azureSignIn";
    public readonly label = "Sign in to Azure...";

    constructor(parent: AzExtParentTreeItem) {
        super(parent);
        this.commandId = "azure-iot-toolkit.signInToAzure";
    }
}
