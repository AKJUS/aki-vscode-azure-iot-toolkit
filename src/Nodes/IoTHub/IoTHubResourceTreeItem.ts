// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { IotHubDescription } from "@azure/arm-iothub";
import { AzExtParentTreeItem, AzExtTreeItem } from "@microsoft/vscode-azext-utils";
import { TreeUtils } from "../../Utility/treeUtils";

// Represents an IoT Hub resource
export class IoTHubResourceTreeItem extends AzExtTreeItem {
    private static contextValue: string = "IotHub";
    public readonly contextValue: string = IoTHubResourceTreeItem.contextValue;
    public readonly iotHub: IotHubDescription;
    constructor(parent: AzExtParentTreeItem, iotHub: IotHubDescription) {
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
