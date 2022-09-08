import { KeyManagementServiceClient } from "@google-cloud/kms";
import { LCDClient, MnemonicKey } from "@xpla/xpla.js";

import * as keyInfo from '../.key-info.json';

export const xpla = new LCDClient({
	chainID: 'cube_47-5',
    URL: 'http://34.64.165.123:1317',
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
