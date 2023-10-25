import { KeyManagementServiceClient } from "@google-cloud/kms";
import { LCDClient, MnemonicKey } from "@xpla/xpla.js";

import * as keyInfo from '../.key-info.json';

export const xpla_testnet = new LCDClient({
	chainID: 'cube_47-5',
    URL: 'https://cube-lcd.xpla.dev',
    gasPrices: "850000000000axpla"
});

export const xpla_mainnet = new LCDClient({
	chainID: 'dimension_37-1',
    URL: 'https://dimension-lcd.xpla.dev',
    gasPrices: "850000000000axpla"
});

// GCP HSM
export const kms = new KeyManagementServiceClient();
export const versionName = kms.cryptoKeyVersionPath(
    keyInfo.gcpInfo.projectId,
    keyInfo.gcpInfo.locationId,
    keyInfo.gcpInfo.keyRingId,
    keyInfo.gcpInfo.keyId,
    keyInfo.gcpInfo.versionId
);

export const mnemonicKey = new MnemonicKey({
    mnemonic: keyInfo.mnemonic
})
