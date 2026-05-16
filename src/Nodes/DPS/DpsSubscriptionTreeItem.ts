// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { IotDpsClient, ProvisioningServiceDescription } from "@azure/arm-deviceprovisioningservices";
import { createAzureClient, SubscriptionTreeItemBase } from "@microsoft/vscode-azext-azureutils";
import { IActionContext } from "@microsoft/vscode-azext-utils";
import { DpsResourceTreeItem } from "./DpsResourceTreeItem";

// Represents an Azure sbuscription
export class DpsSubscriptionTreeItem extends SubscriptionTreeItemBase {
    public readonly childTypeLabel: string = "Device Provisioning Service";

    public hasMoreChildrenImpl(): boolean {
        return false;
    }

    public async loadMoreChildrenImpl(_clearCache: boolean, _context: IActionContext): Promise<DpsResourceTreeItem[]> {
        _context.telemetry.properties.nodeType = "IotDps";

        const client: IotDpsClient = createAzureClient([_context, this], IotDpsClient);
        const results: DpsResourceTreeItem[] = [];
        for await (const dps of client.iotDpsResource.listBySubscription()) {
            results.push(new DpsResourceTreeItem(this, dps));
        }
        return results;
    }
}
