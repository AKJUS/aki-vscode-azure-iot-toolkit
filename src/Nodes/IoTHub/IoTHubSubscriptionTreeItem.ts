// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { IotHubClient, IotHubDescription } from "@azure/arm-iothub";
import { IActionContext } from "@microsoft/vscode-azext-utils";
import { VSCodeSubscriptionTreeItemBase } from "../VSCodeAccountTreeItemBase";
import { IoTHubResourceTreeItem } from "./IoTHubResourceTreeItem";

// Represents an Azure subscription
export class IoTHubSubscriptionTreeItem extends VSCodeSubscriptionTreeItemBase {
    public readonly childTypeLabel: string = "IoT Hub";

    public hasMoreChildrenImpl(): boolean {
        return false;
    }

    public async loadMoreChildrenImpl(_clearCache: boolean, _context: IActionContext): Promise<IoTHubResourceTreeItem[]> {
        _context.telemetry.properties.nodeType = "IotHub";

        const sub = this.root;
        const client = new IotHubClient(sub.credentials as any, sub.subscriptionId);
        const results: IoTHubResourceTreeItem[] = [];
        for await (const iotHub of client.iotHubResource.listBySubscription()) {
            results.push(new IoTHubResourceTreeItem(this, iotHub));
        }
        return results;
    }
}
