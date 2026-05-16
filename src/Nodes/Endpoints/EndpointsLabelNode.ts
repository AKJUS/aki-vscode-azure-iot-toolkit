// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { IotHubClient } from "@azure/arm-iothub";
import * as vscode from "vscode";
import { Constants } from "../../constants";
import { TelemetryClient } from "../../telemetryClient";
import { Utility } from "../../utility";
import { CommandNode } from "../CommandNode";
import { INode } from "../INode";
import { BuiltInEndpointLabelNode } from "./BuiltInEndpointLabelNode";
import { CustomEndpointLabelNode } from "./CustomEndpointLabelNode";
import { EventHubLabelNode } from "./EventHubLabelNode";

export class EndpointsLabelNode implements INode {
    constructor() {
    }

    public getTreeItem(): vscode.TreeItem {
        return {
            label: "Endpoints",
            collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
            contextValue: "endpoints-label",
        };
    }

    public async getChildren(): Promise<INode[]> {
        TelemetryClient.sendEvent(Constants.IoTHubAILoadEndpointsTreeStartEvent);

        try {
            const accountApi = Utility.getAzureAccountApi();
            const subscriptionId = Constants.ExtensionContext.globalState.get(Constants.StateKeySubsID);
            if (!subscriptionId || !(await accountApi.waitForLogin())) {
                return [this.getSelectIoTHubCommandNode()];
            }

            const subscription = accountApi.subscriptions.find((element) => element.subscription.subscriptionId === subscriptionId);
            const client = new IotHubClient(subscription.session.credentials2 as any, subscription.subscription.subscriptionId);
            const iotHubIterator = client.iotHubResource.listBySubscription();
            let iothub = undefined;
            const targetId = Constants.ExtensionContext.globalState.get(Constants.StateKeyIoTHubID);
            for await (const element of iotHubIterator) {
                if (element.id === targetId) {
                    iothub = element;
                    break;
                }
            }
            TelemetryClient.sendEvent(Constants.IoTHubAILoadEndpointsTreeDoneEvent, { Result: "Success" });

            if (!iothub) {
                return [this.getSelectIoTHubCommandNode()];
            }

            return [new BuiltInEndpointLabelNode(),
                new EventHubLabelNode(subscription, iothub.properties.routing.endpoints.eventHubs),
                new CustomEndpointLabelNode("Service Bus queue", iothub.properties.routing.endpoints.serviceBusQueues),
                new CustomEndpointLabelNode("Service Bus topic", iothub.properties.routing.endpoints.serviceBusTopics),
                new CustomEndpointLabelNode("Blob storage", iothub.properties.routing.endpoints.storageContainers)];
        } catch (err) {
            TelemetryClient.sendEvent(Constants.IoTHubAILoadEndpointsTreeDoneEvent, { Result: "Fail", [Constants.errorProperties.Message]: err.message });
            return Utility.getErrorMessageTreeItems("endpoints", err.message);
        }
    }

    private getSelectIoTHubCommandNode(): CommandNode {
        return new CommandNode("-> Please select an IoT Hub", "azure-iot-toolkit.selectIoTHub");
    }
}
