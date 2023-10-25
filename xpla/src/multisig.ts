import { LCDClient, Key, MsgSend, SimplePublicKey, LegacyAminoMultisigPublicKey, MultiSignature, SignDoc, SignatureV2, Account, Tx } from '@xpla/xpla.js';
import { GcpHsmKey } from './hsm/GcpHsmKey';
import { GcpHsmSigner } from './hsm/GcpHsmSigner';

import { kms, mnemonicKey, versionName, xpla_testnet } from './config';

const signature = async (key: Key, client: LCDClient, accInfo: Account, tx: Tx) => {
    return await key.createSignatureAmino(
        new SignDoc(
            client.config.chainID,
            accInfo.getAccountNumber(),
            accInfo.getSequenceNumber(),
            tx.auth_info,
            tx.body
        )
    );
}

const multisig = async () => {

    // GCP HSM
    const gcpHsmUtils = new GcpHsmSigner(kms, versionName);
    const pubkey = await gcpHsmUtils.getPublicKey();
    const gcpHsmKey: Key = new GcpHsmKey(gcpHsmUtils, pubkey);

    const multisigPubkey = new LegacyAminoMultisigPublicKey(2, [
        mnemonicKey.publicKey as SimplePublicKey,
        gcpHsmKey.publicKey as SimplePublicKey
    ]);

    const address = multisigPubkey.address();
    const multisig = new MultiSignature(multisigPubkey);

    // create a simple message that moves coin balances
    const send = new MsgSend(
        address,
        'xpla1sxp7gwuf32fc077s9szqpylgr44xuzz2zqawr0',
        { uluna: 1 }
    );

    const accInfo = await xpla_testnet.auth.accountInfo(address);
    const tx = await xpla_testnet.tx.create(
        [
            {
                address,
                sequenceNumber: accInfo.getSequenceNumber(),
                publicKey: accInfo.getPublicKey(),
            },
        ],
        {
            msgs: [send],
            memo: 'memo'
        }
    );

    // project 1
    const sig1 = await signature(mnemonicKey, xpla_testnet, accInfo, tx);

    // project 2
    const sig2 = await signature(gcpHsmKey, xpla_testnet, accInfo, tx);

    multisig.appendSignatureV2s([sig1, sig2]);

    tx.appendSignatures([
        new SignatureV2(
            multisigPubkey,
            multisig.toSignatureDescriptor(),
            accInfo.getSequenceNumber()
        ),
    ]);

    console.log(JSON.stringify(tx.toData()));
    xpla_testnet.tx.broadcast(tx).then(console.log);
}

multisig();