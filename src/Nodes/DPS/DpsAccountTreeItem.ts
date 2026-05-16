// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { AzureAccountTreeItemBase, SubscriptionTreeItemBase } from "@microsoft/vscode-azext-azureutils";
import { ISubscriptionContext } from "@microsoft/vscode-azext-utils";
import { DpsSubscriptionTreeItem } from "./DpsSubscriptionTreeItem";

// The root of DPS treeview, represents an Azure account
export class DpsAccountTreeItem extends AzureAccountTreeItemBase {
  // Creates the subscription item
  public async createSubscriptionTreeItem(root: ISubscriptionContext): Promise<SubscriptionTreeItemBase> {
    return new DpsSubscriptionTreeItem(this, root);
  }
}
