import { LCDClient, Key, MnemonicKey, MsgSend, AccAddress } from '@terra-money/terra.js';
import { KeyManagementServiceClient } from "@google-cloud/kms";
import { GcpHsmKey } from './hsm/GcpHsmKey';
import { GcpHsmSigner } from './hsm/GcpHsmSigner';

import * as keyInfo from '../.key-info.json';

const terra = new LCDClient({
	URL: 'https://bombay-lcd.terra.dev',
	chainID: 'bombay-12'
});

const printPubkey = async () => {

	// GCP HSM
	const kms = new KeyManagementServiceClient();
	const versionName = kms.cryptoKeyVersionPath(
		keyInfo.gcpInfo.projectId,
		keyInfo.gcpInfo.locationId,
		keyInfo.gcpInfo.keyRingId,
		keyInfo.gcpInfo.keyId,
		keyInfo.gcpInfo.versionId
	);
	const gcpHsmUtils = new GcpHsmSigner(kms, versionName);
	const pubkey = await gcpHsmUtils.getPublicKey();
	const gcpHsmKey: Key = new GcpHsmKey(gcpHsmUtils, pubkey);
	const gcpHsmWallet = terra.wallet(gcpHsmKey);

	console.log(`GCP HSM wallet addr: ${gcpHsmWallet.key.accAddress}`);	
}

printPubkey();