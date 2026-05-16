// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { ISubscriptionContext } from "@microsoft/vscode-azext-utils";
import { VSCodeAccountTreeItemBase, VSCodeSubscriptionTreeItemBase } from "../VSCodeAccountTreeItemBase";
import { IoTHubSubscriptionTreeItem } from "./IoTHubSubscriptionTreeItem";

// The root of IoT Hub treeview, represents an Azure account
export class IoTHubAccountTreeItem extends VSCodeAccountTreeItemBase {
  public async createSubscriptionTreeItem(root: ISubscriptionContext): Promise<VSCodeSubscriptionTreeItemBase> {
    return new IoTHubSubscriptionTreeItem(this, root);
  }
}
