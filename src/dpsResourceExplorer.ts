// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { IotDpsClient, ProvisioningServiceDescription } from "@azure/arm-deviceprovisioningservices";
import { TokenCredential } from "@azure/core-auth";
import * as vscode from "vscode";
import { AzExtTreeDataProvider, AzExtTreeItem, IActionContext, openReadOnlyJson } from "@microsoft/vscode-azext-utils";
import { BaseExplorer } from "./baseExplorer";
import { Constants } from "./constants";
import { DpsResourceTreeItem } from "./Nodes/DPS/DpsResourceTreeItem";

export class DpsResourceExplorer extends BaseExplorer {
    private _dpsTreeDataProvider: AzExtTreeDataProvider;

    constructor(outputChannel: vscode.OutputChannel, dpsTreeDataProvider: AzExtTreeDataProvider) {
        super(outputChannel);
        this._dpsTreeDataProvider = dpsTreeDataProvider;
    }

    public async viewProperties(context: IActionContext, node?: DpsResourceTreeItem): Promise<void> {
        if (!node) {
            node = await this._dpsTreeDataProvider.showTreeItemPicker<DpsResourceTreeItem>("IotDps", context);
        }

        const sub = node.subscription;
        const client = new IotDpsClient(sub.credentials as TokenCredential, sub.subscriptionId);
        const matchResult = Constants.DpsResourceGroupNameRegex.exec(node.fullId);
        let dpsInfo: ProvisioningServiceDescription = null;
        if (matchResult != null) {
            const resourecGroupName = matchResult[1];
            dpsInfo = await client.iotDpsResource.get(node.dps.name, resourecGroupName);
        } else {
            dpsInfo = node.dps; // Fallback to use cached properties if regex match fails
        }
        const propertyInfo = {
            label: dpsInfo.name + "-properties",
            fullId: dpsInfo.id,
        };

        await openReadOnlyJson(propertyInfo, dpsInfo);
    }

    public async loadMore(actionContext: IActionContext, node: AzExtTreeItem): Promise<void> {
        await this._dpsTreeDataProvider.loadMore(node, actionContext);
    }

    public async refresh(actionContext: IActionContext, node?: AzExtTreeItem): Promise<void> {
        await this._dpsTreeDataProvider.refresh(actionContext, node);
    }
}
