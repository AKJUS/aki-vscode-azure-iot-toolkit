// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { Subscription } from  "@azure/arm-subscriptions";
import { QuickPickItem } from "vscode";
import { AzureSession } from "../azure-account.api";

export class SubscriptionItem implements QuickPickItem {
    public readonly label: string;
    public readonly description: string;
    constructor(public readonly subscription: Subscription, public readonly session: AzureSession) {
        this.label = subscription.displayName;
        this.description = subscription.subscriptionId;
    }
}
