// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { IotHubClient, IotHubDescription } from "@azure/arm-iothub";
import { createAzureClient, SubscriptionTreeItemBase } from "@microsoft/vscode-azext-azureutils";
import { IActionContext } from "@microsoft/vscode-azext-utils";
import { IoTHubResourceTreeItem } from "./IoTHubResourceTreeItem";

// Represents an Azure sbuscription
export class IoTHubSubscriptionTreeItem extends SubscriptionTreeItemBase {
    public readonly childTypeLabel: string = "IoT Hub";

    public hasMoreChildrenImpl(): boolean {
        return false;
    }

    public async loadMoreChildrenImpl(_clearCache: boolean, _context: IActionContext): Promise<IoTHubResourceTreeItem[]> {
        _context.telemetry.properties.nodeType = "IotHub";

        const client: IotHubClient = createAzureClient([_context, this], IotHubClient);
        const results: IoTHubResourceTreeItem[] = [];
        for await (const iotHub of client.iotHubResource.listBySubscription()) {
            results.push(new IoTHubResourceTreeItem(this, iotHub));
        }
        return results;
    }
}
