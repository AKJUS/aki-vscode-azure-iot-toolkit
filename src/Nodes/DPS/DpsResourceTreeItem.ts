// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { ProvisioningServiceDescription } from "@azure/arm-deviceprovisioningservices";
import { AzExtParentTreeItem, AzExtTreeItem } from "@microsoft/vscode-azext-utils";
import { TreeUtils } from "../../Utility/treeUtils";

// Represents a DPS resource
export class DpsResourceTreeItem extends AzExtTreeItem {
    private static contextValue: string = "IotDps";
    public readonly contextValue: string = DpsResourceTreeItem.contextValue;
    public readonly dps: ProvisioningServiceDescription;
    constructor(parent: AzExtParentTreeItem, dps: ProvisioningServiceDescription) {
        super(parent);
        this.dps = dps;
        this.id = this.dps.id || "";
        this.iconPath = TreeUtils.getThemedIconPath("dps");
    }

    public get label(): string {
        if (this.dps.name) {
            return this.dps.name;
        } else {
            return "";
        }
    }
}
