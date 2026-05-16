// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { AzureAccountTreeItemBase, SubscriptionTreeItemBase } from "@microsoft/vscode-azext-azureutils";
import { ISubscriptionContext } from "@microsoft/vscode-azext-utils";
import { IoTHubSubscriptionTreeItem } from "./IoTHubSubscriptionTreeItem";

// The root of IoT Hub treeview, represents an Azure account
export class IoTHubAccountTreeItem extends AzureAccountTreeItemBase {
  // Creates the subscription item
  public async createSubscriptionTreeItem(root: ISubscriptionContext): Promise<SubscriptionTreeItemBase> {
    return new IoTHubSubscriptionTreeItem(this, root);
  }
}
