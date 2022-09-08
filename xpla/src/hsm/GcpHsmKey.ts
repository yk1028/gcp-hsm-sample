import { Key, SimplePublicKey } from '@xpla/xpla.js';
import { GcpHsmSigner } from './GcpHsmSigner';
import { keccak256 } from '@ethersproject/keccak256';

export class GcpHsmKey extends Key {

  constructor(private signer: GcpHsmSigner, publicKey: Uint8Array) {
    super(new SimplePublicKey(Buffer.from(publicKey).toString('base64')));
  }

  public async sign(payload: Buffer): Promise<Buffer> {
    const digest = Buffer.from(keccak256(payload).substring(2), 'hex');
    
    return this.signer.sign(digest);
  }
}
