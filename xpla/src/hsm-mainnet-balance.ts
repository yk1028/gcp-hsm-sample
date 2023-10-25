import { Key } from '@xpla/xpla.js';
import { GcpHsmKey } from './hsm/GcpHsmKey';
import { GcpHsmSigner } from './hsm/GcpHsmSigner';

import { kms, mnemonicKey, versionName, xpla_mainnet } from './config';

const hsmBalance = async () => {

    const gcpHsmUtils = new GcpHsmSigner(kms, versionName);
	const pubkey = await gcpHsmUtils.getPublicKey();
	const gcpHsmKey: Key = new GcpHsmKey(gcpHsmUtils, pubkey);
	const gcpHsmWallet = xpla_mainnet.wallet(gcpHsmKey);
    const accAddress1 = gcpHsmWallet.key.accAddress
    const [coins1] = await xpla_mainnet.bank.balance(accAddress1)
    
    console.log("gcphsm : " + accAddress1)
    console.log(coins1.toData())

    const wallet2 = xpla_mainnet.wallet(mnemonicKey);
    const accAddress2 = wallet2.key.accAddress
    const [coins2] = await xpla_mainnet.bank.balance(accAddress2)

    console.log("mnemonic : " + accAddress2)
    console.log(coins2.toData())
}

hsmBalance()