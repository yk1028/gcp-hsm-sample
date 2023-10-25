
import { mnemonicKey, xpla_testnet } from './config';

const mnemonicbalance = async () => {
    const wallet2 = xpla_testnet.wallet(mnemonicKey);
    const accAddress2 = wallet2.key.accAddress
    const [coins2] = await xpla_testnet.bank.balance(accAddress2)

    console.log("mnemonic : " + accAddress2)
    console.log(coins2.toData())
}

mnemonicbalance()