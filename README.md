# gcp-hsm-sample
- google cloud platform의 key management service에서 제공하는 hsm 방식의 key를 활용해 terra-classic과 xpla의 wallet으로 활용하는 sample code.

## gcp kms key create options
- 보호 수준 : hsm
- 용도 : 비대칭 서명
- 알고리즘 타원 곡선 secp256k1 - SHA256 다이제스트

## terra-classic vs xpla
- `xpla`에서는 `terra-classic`과 다르게 `ethsepc256k1` 방식을 사용하기 때문에 `GcpHsmKey.ts`에서 digest 생성 방식이 다르다.

## .key-info.json example
- key 정보를 숨기기 위해 `.gitignore`에 추가해 숨긴 파일
- 별도 생성 필요
- 아래 형식은 단순 예시이며 꼭 지켜야하는 형식은 아닙니다. `@google-cloud/kms`의 `cryptoKeyVersionPath` 메서드에 key 정보만 정확하게 들어가면 됩니다.
``` json
{   
    "mnemonic": "your test mnemonic",
    "gcpInfo": {
        "projectId": "key-test-345902",
        "locationId": "asia-northeast3",
        "keyRingId": "test-key-ring3",
        "keyId": "test-key1",
        "versionId": "1"
    }
}
```

## gcp service account
- 방법1 - sample code는 gcp의 key의 접근 권한(`roles/cloudkms.admin`, `roles/cloudkms.signerVerifier`)이 있는 service account가 등록된 vm instance에서 실행되고 있다는 전재하에 정상 동작합니다.


- 방법2 - 다른 방법으로는 gcp의 key의 접근 권한이 있는 service account key file을 활용해 아래와 같이 접근하는 방법이 있습니다.
``` ts 
const kms = new KeyManagementServiceClient({ keyFile: './service-account.json' });
```
