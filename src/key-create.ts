// Imports the Cloud KMS library
import { KeyManagementServiceClient } from '@google-cloud/kms';

import * as keyInfo from '../.key-info.json';

// Instantiates a client
const client = new KeyManagementServiceClient();

const createKeyRing = async (projectId: string, locationId: string, keyRingId: string) => {

  // Build the parent location name
  const locationName = client.locationPath(projectId, locationId);

  const [keyRing] = await client.createKeyRing({
    parent: locationName,
    keyRingId: keyRingId,
  });

  console.log(`Created key ring: ${keyRing.name}`);
}

const createKeyHsm = async (projectId: string, locationId: string, keyRingId: string, keyId: string) => {

  // Build the parent key ring name
  const keyRingName = client.keyRingPath(projectId, locationId, keyRingId);

  const [key] = await client.createCryptoKey({
    parent: keyRingName,
    cryptoKeyId: keyId,
    cryptoKey: {
      purpose: 'ASYMMETRIC_SIGN',
      versionTemplate: {
        algorithm: 'EC_SIGN_SECP256K1_SHA256',
        protectionLevel: 'HSM',
      },

      // Optional: customize how long key versions should be kept before
      // destroying.
      destroyScheduledDuration: { seconds: 60 * 60 * 24 },
    },
  });

  console.log(`Created hsm key: ${key.name}`);
}

const keyProcess = async () => {
  const projectId = keyInfo.gcpInfo.projectId;
  const locationId = keyInfo.gcpInfo.locationId;
  const keyRingId = keyInfo.gcpInfo.keyRingId;
  const keyId = keyInfo.gcpInfo.keyId;

  await createKeyRing(projectId, locationId, keyRingId);
  await createKeyHsm(projectId, locationId, keyRingId, keyId);
}

keyProcess();