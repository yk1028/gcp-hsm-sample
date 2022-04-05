import { LCDClient, Key, MnemonicKey, MsgSend, AccAddress } from '@terra-money/terra.js';
import { KeyManagementServiceClient } from "@google-cloud/kms";
import { GcpHsmKey } from './hsm/GcpHsmKey';
import { GcpHsmSigner } from './hsm/GcpHsmSigner';

import * as keyInfo from '../.key-info.json';

const terra = new LCDClient({
	URL: 'https://bombay-lcd.terra.dev',
	chainID: 'bombay-12'
});

const sendToHsm = async () => {
	const mnemonicKey = new MnemonicKey({
		mnemonic: keyInfo.mnemonic
	})


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

	console.log(mnemonicKey.publicKey);
	console.log(gcpHsmKey.publicKey);

	const mnemonicWallet = terra.wallet(mnemonicKey);
	const gcpHsmWallet = terra.wallet(gcpHsmKey);

	console.log("mnemonic wallet addr = ", mnemonicWallet.key.accAddress);
	console.log("GCP HSM wallet addr = ", gcpHsmWallet.key.accAddress);

	const send = new MsgSend(
		mnemonicWallet.key.accAddress,
		gcpHsmWallet.key.accAddress,
		"1000000uluna"
	);

	console.log(mnemonicKey.valAddress);
	

	try {
		const tx = await mnemonicWallet.createAndSignTx({
			msgs: [send],
			memo: 'mnemonic send test',
		})

		const result = await terra.tx.broadcast(tx);

		console.log("+++ result: ", result);
	} catch (err) {
		console.log("+++ error: ", err);
	}
}

sendToHsm();