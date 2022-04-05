import { LCDClient, Key, MnemonicKey, MsgSend, SimplePublicKey, LegacyAminoMultisigPublicKey, MultiSignature, SignDoc, SignatureV2, Account, Tx } from '@terra-money/terra.js';
import { KeyManagementServiceClient } from "@google-cloud/kms";
import { GcpHsmKey } from './hsm/GcpHsmKey';
import { GcpHsmSigner } from './hsm/GcpHsmSigner';

import * as keyInfo from '../.key-info.json';

const terra = new LCDClient({
    URL: 'https://bombay-lcd.terra.dev',
    chainID: 'bombay-12',
    gasPrices: { uluna: 0.01133 },
});

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

    const multisigPubkey = new LegacyAminoMultisigPublicKey(2, [
        mnemonicKey.publicKey as SimplePublicKey,
        gcpHsmKey.publicKey as SimplePublicKey
    ]);

    const address = multisigPubkey.address();
    const multisig = new MultiSignature(multisigPubkey);

    // create a simple message that moves coin balances
    const send = new MsgSend(
        address,
        'terra1sxp7gwuf32fc077s9szqpylgr44xuzz2zqawr0',
        { uluna: 1 }
    );

    const accInfo = await terra.auth.accountInfo(address);
    const tx = await terra.tx.create(
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
    const sig1 = await signature(mnemonicKey, terra, accInfo, tx);

    // project 2
    const sig2 = await signature(gcpHsmKey, terra, accInfo, tx);

    multisig.appendSignatureV2s([sig1, sig2]);

    tx.appendSignatures([
        new SignatureV2(
            multisigPubkey,
            multisig.toSignatureDescriptor(),
            accInfo.getSequenceNumber()
        ),
    ]);

    console.log(JSON.stringify(tx.toData()));
    terra.tx.broadcast(tx).then(console.log);
}

multisig();