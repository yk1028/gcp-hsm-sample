import { KeyManagementServiceClient } from "@google-cloud/kms";

import * as keyInfo from '../.key-info.json';

const deleteKey = async () => {

    const kms = new KeyManagementServiceClient();
    const versionName = kms.cryptoKeyVersionPath(
        keyInfo.gcpInfo.projectId,
        keyInfo.gcpInfo.locationId,
        keyInfo.gcpInfo.keyRingId,
        keyInfo.gcpInfo.keyId,
        keyInfo.gcpInfo.versionId
    );

    const [version] = await kms.destroyCryptoKeyVersion({
        name: versionName,
    });

    console.log(`Destroyed key version: ${version.name}`);
}

deleteKey();