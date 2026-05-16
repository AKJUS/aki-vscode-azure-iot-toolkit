// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { IotHubDescription } from "@azure/arm-iothub";
import { AzureParentTreeItem, AzureTreeItem, TreeItemIconPath } from "vscode-azureextensionui";
import { TreeUtils } from "../../Utility/treeUtils";

// Represents an IoT Hub resource
export class IoTHubResourceTreeItem extends AzureTreeItem {
    private static contextValue: string = "IotHub";
    public readonly contextValue: string = IoTHubResourceTreeItem.contextValue;
    public readonly iotHub: IotHubDescription;
    public readonly id: string;
    public readonly iconPath: TreeItemIconPath;
    constructor(parent: AzureParentTreeItem, iotHub: IotHubDescription) {
        super(parent);
        this.iotHub = iotHub;
        this.id = this.iotHub.id || "";
        this.iconPath = TreeUtils.getThemedIconPath("iothub");
    }

    public get label(): string {
        if (this.iotHub.name) {
            return this.iotHub.name;
        } else {
            return "";
        }
    }
}
