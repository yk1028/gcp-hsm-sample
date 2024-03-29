import { Key } from '@xpla/xpla.js';
import { GcpHsmKey } from './hsm/GcpHsmKey';
import { GcpHsmSigner } from './hsm/GcpHsmSigner';

import { kms, versionName, xpla_testnet } from './config';

const printPubkey = async () => {

	const gcpHsmUtils = new GcpHsmSigner(kms, versionName);
	const pubkey = await gcpHsmUtils.getPublicKey();
	const gcpHsmKey: Key = new GcpHsmKey(gcpHsmUtils, pubkey);
	const gcpHsmWallet = xpla_testnet.wallet(gcpHsmKey);

	console.log(`Version Name: \n\t${versionName}`)

	console.log(`GCP HSM wallet address: \n\t${gcpHsmWallet.key.accAddress}`);
}

printPubkey();