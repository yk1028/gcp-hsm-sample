import { Key, MsgSend } from '@xpla/xpla.js';
import { GcpHsmKey } from './hsm/GcpHsmKey';
import { GcpHsmSigner } from './hsm/GcpHsmSigner';

import { kms, mnemonicKey, versionName, xpla_testnet } from './config';

const sendToMnemonic = async () => {

	// GCP HSM
	const gcpHsmUtils = new GcpHsmSigner(kms, versionName);
	const pubkey = await gcpHsmUtils.getPublicKey();
	const gcpHsmKey: Key = new GcpHsmKey(gcpHsmUtils, pubkey);

	console.log(mnemonicKey.publicKey);
	console.log(gcpHsmKey.publicKey);

	const mnemonicWallet = xpla_testnet.wallet(mnemonicKey);
	const gcpHsmWallet = xpla_testnet.wallet(gcpHsmKey);

	console.log("mnemonic wallet addr = ", mnemonicWallet.key.accAddress);
	console.log("GCP HSM wallet addr = ", gcpHsmWallet.key.accAddress);

	const send = new MsgSend(
		gcpHsmWallet.key.accAddress,
		mnemonicWallet.key.accAddress,
		"1axpla"
	);

	try {
		const tx = await gcpHsmWallet.createAndSignTx({
			msgs: [send],
			memo: 'gcp hsm send test',
		})

		const result = await xpla_testnet.tx.broadcast(tx);

		console.log("+++ result: ", result);
	} catch (err) {
		console.log("+++ error: ", err);
	}
}

sendToMnemonic();