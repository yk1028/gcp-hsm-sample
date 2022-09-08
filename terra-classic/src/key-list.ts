import { KeyManagementServiceClient } from '@google-cloud/kms';

import * as keyInfo from '../.key-info.json';

const keyList = () => {

    // Instantiates a client
    const client = new KeyManagementServiceClient();
    
    const listKeyRings = async (projectId: string, locationId: string): Promise<void> => {
        const locationName = client.locationPath(projectId, locationId);

        const [keyRings] = await client.listKeyRings({
            parent: locationName,
        });

        for (const keyRing of keyRings) {
            console.log(keyRing.name);
            const [keys] = await client.listCryptoKeys({
                parent: keyRing.name,
            });

            for (const key of keys) {
                console.log("    " +key.name)
            }
            console.log();
        }
    }

    listKeyRings(keyInfo.gcpInfo.projectId, keyInfo.gcpInfo.locationId);
}

keyList();