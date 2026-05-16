// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { IotHubClient, IotHubDescription } from "@azure/arm-iothub";
import { createAzureClient, IActionContext, SubscriptionTreeItemBase } from "vscode-azureextensionui";
import { IoTHubResourceTreeItem } from "./IoTHubResourceTreeItem";

// Represents an Azure sbuscription
export class IoTHubSubscriptionTreeItem extends SubscriptionTreeItemBase {
    public readonly childTypeLabel: string = "IoT Hub";

    public hasMoreChildrenImpl(): boolean {
        return false;
    }

    public async loadMoreChildrenImpl(_clearCache: boolean, _context: IActionContext): Promise<IoTHubResourceTreeItem[]> {
        _context.telemetry.properties.nodeType = "IotHub";

        const client: IotHubClient = createAzureClient(this.root, IotHubClient);
        const results: IoTHubResourceTreeItem[] = [];
        for await (const iotHub of client.iotHubResource.listBySubscription()) {
            results.push(new IoTHubResourceTreeItem(this, iotHub));
        }
        return results;
    }
}
