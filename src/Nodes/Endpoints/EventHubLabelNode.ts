// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { RoutingEventHubProperties } from "@azure/arm-iothub";
import { TokenCredential } from "@azure/core-auth";
import * as vscode from "vscode";
import { EventHubItem } from "../../Model/EventHubItem";
import { INode } from "../INode";
import { EventHubItemNode } from "./EventHubItemNode";

export class EventHubLabelNode implements INode {
    constructor(
        private credential: TokenCredential,
        private subscriptionId: string,
        private eventHubProperties: RoutingEventHubProperties[],
    ) {}

    public getTreeItem(): vscode.TreeItem {
        return {
            label: "Event Hubs",
            collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
            contextValue: "event-hub-label",
        };
    }

    public getChildren(): INode[] {
        return this.eventHubProperties.map((eventHubProperty) =>
            new EventHubItemNode(new EventHubItem(this.credential, this.subscriptionId, eventHubProperty)));
    }
}
