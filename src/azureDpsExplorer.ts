// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as vscode from "vscode";
import { AzExtTreeDataProvider, AzExtTreeItem, IActionContext } from "@microsoft/vscode-azext-utils";
import { DpsResourceExplorer } from "./dpsResourceExplorer";
import { DpsResourceTreeItem } from "./Nodes/DPS/DpsResourceTreeItem";

export class AzureDpsExplorer {
    private _dpsResourceExplorer: DpsResourceExplorer;

    constructor(outputChannel: vscode.OutputChannel, dpsTreeDataProvider: AzExtTreeDataProvider) {
        this._dpsResourceExplorer = new DpsResourceExplorer(outputChannel, dpsTreeDataProvider);
    }

    public async viewProperties(actionContext: IActionContext, node?: DpsResourceTreeItem): Promise<void> {
        return this._dpsResourceExplorer.viewProperties(actionContext, node);
    }

    public async loadMore(actionContext: IActionContext, node: AzExtTreeItem): Promise<void> {
        return this._dpsResourceExplorer.loadMore(actionContext, node);
    }

    public async refresh(actionContext: IActionContext, node?: AzExtTreeItem): Promise<void> {
        return this._dpsResourceExplorer.refresh(actionContext, node);
    }
}
