import {
  it, expect, describe, beforeEach, vi,
} from 'vitest';
import Api from '../api/Api';
import Cache from '../utilities/Cache';
import LookUpService from './LookUpService';

vi.mock('../utilities/Cache');

beforeEach(() => {
  Cache.getCache = vi.fn();
  Cache.setCache = vi.fn();
  const responseJson = [{ signing_public_key: 'OK' }];
  Api.doPost = vi.fn(() => Promise.resolve({
    json: () => Promise.resolve(responseJson),
  }));
});

const sample = 'SAMPLE';

describe('LookUp Service', () => {
  it('should test whether cache is checked in getPublicKey', () => {
    LookUpService.getPublicKey(sample);
    expect(Cache.getCache).toBeCalled();
  });

  it('should test whether api call is made and public key is returned in getPublicKey', async () => {
    const publicKey = await LookUpService.getPublicKey(sample);
    expect(Api.doPost).toBeCalled();
    expect(publicKey).toBe('OK');
  });

  it('should test whether cache is set in getPublicKey', async () => {
    await LookUpService.getPublicKey(sample);
    expect(Cache.setCache).toBeCalledWith('publicKey - SAMPLE;', 'OK', 200000);
  });

  it('should test whether cache is checked in getPublicKeyWithSubscriberId', () => {
    LookUpService.getPublicKeyWithSubscriberId(sample);
    expect(Cache.getCache).toBeCalled();
  });

  it('should test whether api call is made and public key is returned in getPublicKeyWithSubscriberId', async () => {
    const publicKey = await LookUpService.getPublicKeyWithSubscriberId(sample);
    expect(Api.doPost).toBeCalled();
    expect(publicKey).toBe('OK');
  });

  it('should test whether api call is made and public key is returned in getProviderId', async () => {
    await LookUpService.getProviderId(sample, sample);
    expect(Api.doPost).toBeCalled();
  });
});
