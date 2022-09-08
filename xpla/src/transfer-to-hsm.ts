import { Key, MsgSend } from '@xpla/xpla.js';
import { GcpHsmKey } from './hsm/GcpHsmKey';
import { GcpHsmSigner } from './hsm/GcpHsmSigner';

import { kms, mnemonicKey, versionName, xpla } from './config';

const transferToHsm = async () => {

	// GCP HSM
	const gcpHsmUtils = new GcpHsmSigner(kms, versionName);
	const pubkey = await gcpHsmUtils.getPublicKey();
	const gcpHsmKey: Key = new GcpHsmKey(gcpHsmUtils, pubkey);

	console.log(mnemonicKey.publicKey);
	console.log(gcpHsmKey.publicKey);

	const mnemonicWallet = xpla.wallet(mnemonicKey);
	const gcpHsmWallet = xpla.wallet(gcpHsmKey);

	console.log("mnemonic wallet addr = ", mnemonicWallet.key.accAddress);
	console.log("GCP HSM wallet addr = ", gcpHsmWallet.key.accAddress);

	const send = new MsgSend(
		mnemonicWallet.key.accAddress,
		gcpHsmWallet.key.accAddress,
		"1axpla"
	);

	try {
		const tx = await mnemonicWallet.createAndSignTx({
			msgs: [send],
			memo: 'mnemonic send test',
		})

		const result = await xpla.tx.broadcast(tx);

		console.log("+++ result: ", result);
	} catch (err) {
		console.log("+++ error: ", err);
	}
}

transferToHsm();