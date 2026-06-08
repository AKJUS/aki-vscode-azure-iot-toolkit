// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { IotDpsClient, ProvisioningServiceDescription } from "@azure/arm-deviceprovisioningservices";
import { TokenCredential } from "@azure/core-auth";
import { IActionContext } from "@microsoft/vscode-azext-utils";
import { VSCodeSubscriptionTreeItemBase } from "../VSCodeAccountTreeItemBase";
import { DpsResourceTreeItem } from "./DpsResourceTreeItem";

// Represents an Azure subscription
export class DpsSubscriptionTreeItem extends VSCodeSubscriptionTreeItemBase {
    public readonly childTypeLabel: string = "Device Provisioning Service";

    public hasMoreChildrenImpl(): boolean {
        return false;
    }

    public async loadMoreChildrenImpl(_clearCache: boolean, _context: IActionContext): Promise<DpsResourceTreeItem[]> {
        _context.telemetry.properties.nodeType = "IotDps";

        const sub = this.root;
        const client = new IotDpsClient(sub.credentials as TokenCredential, sub.subscriptionId);
        const results: DpsResourceTreeItem[] = [];
        for await (const dps of client.iotDpsResource.listBySubscription()) {
            results.push(new DpsResourceTreeItem(this, dps));
        }
        return results;
    }
}
