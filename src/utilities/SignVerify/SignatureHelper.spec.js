import {
  expect, it, describe,
} from 'vitest';
import SignatureHelper from './SignatureHelper';

describe('Signature Helper', () => {
  const data = '7a8277f3-13b1-4f31-add5-d0d4a068c360';
  const privateKey = 'sUUXM0UOgF1WuBgbG1ILQWrqtWZTeN5XMVlMX2DsqqNNRg3uO0a/htwq5aLASya+mWtPeZPwEykw4NBT1LHosQ==';
  const publicKey = 'TUYN7jtGv4bcKuWiwEsmvplrT3mT8BMpMODQU9Sx6LE=';

  it('Should get signed data and verify', async () => {
    const signedData = SignatureHelper.createSignedData(data, privateKey);
    expect(signedData).toBe('amsYASB8Ia82qOtdWpLJSgW1FehmI3YVgnDvn+PBHqcTPaOcKlVXoZZHFPsNJ6aMc+YXLUB4ZaycUQU49pJmDw==');
    expect(SignatureHelper.verify(data, publicKey, signedData)).toBeTruthy();
  });
});
