// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { RoutingEventHubProperties } from "@azure/arm-iothub";
import { TokenCredential } from "@azure/core-auth";
import { TreeItem } from "vscode";

export class EventHubItem extends TreeItem {
    constructor(
        public readonly credential: TokenCredential,
        public readonly subscriptionId: string,
        public readonly eventHubProperty: RoutingEventHubProperties) {
        super(eventHubProperty.name);
        this.contextValue = "event-hub";
    }
}
