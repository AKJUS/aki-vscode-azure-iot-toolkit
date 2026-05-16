// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { Subscription } from  "@azure/arm-subscriptions";
import { TokenCredential } from "@azure/core-auth";
import { QuickPickItem } from "vscode";

export class SubscriptionItem implements QuickPickItem {
    public readonly label: string;
    public readonly description: string;
    constructor(
        public readonly subscription: Subscription,
        public readonly credential: TokenCredential,
    ) {
        this.label = subscription.displayName;
        this.description = subscription.subscriptionId;
    }
}
