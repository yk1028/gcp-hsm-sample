import { Key } from '@xpla/xpla.js';
import { GcpHsmKey } from './hsm/GcpHsmKey';
import { GcpHsmSigner } from './hsm/GcpHsmSigner';

import { kms, mnemonicKey, versionName, xpla } from './config';

const balance = async () => {

    const gcpHsmUtils = new GcpHsmSigner(kms, versionName);
	const pubkey = await gcpHsmUtils.getPublicKey();
	const gcpHsmKey: Key = new GcpHsmKey(gcpHsmUtils, pubkey);
	const gcpHsmWallet = xpla.wallet(gcpHsmKey);
    const accAddress1 = gcpHsmWallet.key.accAddress
    const [coins1] = await xpla.bank.balance(accAddress1)
    
    console.log("gcphsm : " + accAddress1)
    console.log(coins1.toData())

    const wallet2 = xpla.wallet(mnemonicKey);
    const accAddress2 = wallet2.key.accAddress
    const [coins2] = await xpla.bank.balance(accAddress2)

    console.log("mnemonic : " + accAddress2)
    console.log(coins2.toData())
}

balance()