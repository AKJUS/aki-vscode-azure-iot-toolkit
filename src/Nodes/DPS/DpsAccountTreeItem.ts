// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { ISubscriptionContext } from "@microsoft/vscode-azext-utils";
import { VSCodeAccountTreeItemBase, VSCodeSubscriptionTreeItemBase } from "../VSCodeAccountTreeItemBase";
import { DpsSubscriptionTreeItem } from "./DpsSubscriptionTreeItem";

// The root of DPS treeview, represents an Azure account
export class DpsAccountTreeItem extends VSCodeAccountTreeItemBase {
  public async createSubscriptionTreeItem(root: ISubscriptionContext): Promise<VSCodeSubscriptionTreeItemBase> {
    return new DpsSubscriptionTreeItem(this, root);
  }
}
