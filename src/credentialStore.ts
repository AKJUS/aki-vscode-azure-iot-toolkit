// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

"use strict";
import * as vscode from "vscode";
import { Constants } from "./constants";

export class CredentialStore {
    private static _secrets: vscode.SecretStorage;

    public static initialize(context: vscode.ExtensionContext) {
        this._secrets = context.secrets;
    }

    public static async getPassword(account: string): Promise<string | undefined> {
        if (this._secrets) {
            const value = await this._secrets.get(`${Constants.ExtensionId}.${account}`);
            if (value !== undefined) {
                return value;
            }
        }
        // Fallback to globalState for legacy stored values
        return Constants.ExtensionContext.globalState.get(account);
    }

    public static async setPassword(account: string, password: string) {
        if (this._secrets) {
            await this._secrets.store(`${Constants.ExtensionId}.${account}`, password);
            // Clear legacy globalState to prevent fallback to stale values
            await Constants.ExtensionContext.globalState.update(account, undefined);
        } else {
            await Constants.ExtensionContext.globalState.update(account, password);
        }
    }

    public static async deletePassword(account: string) {
        if (this._secrets) {
            await this._secrets.delete(`${Constants.ExtensionId}.${account}`);
        }
        // Also clear legacy globalState to prevent fallback from resurfacing old values
        await Constants.ExtensionContext.globalState.update(account, undefined);
    }
}
