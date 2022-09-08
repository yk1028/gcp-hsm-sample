# gcp-hsm-sample

# terra-classic vs xpla
- `xpla`에서는 `terra-classic`과 다르게 `ethsepc256k1` 방식을 사용하기 때문에 `GcpHsmKey.ts`에서 digest 생성 방식이 다르다.

# .key-info.json example
- key 정보를 숨기기 위해 `.gitignore`에 추가한 파일 별도 생성 필요.
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