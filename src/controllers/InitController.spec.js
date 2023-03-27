import {
  expect, it, vi, beforeEach, describe,
} from 'vitest';
import InitService from '../services/InitService';
import LookUpService from '../services/LookUpService';
import GenericResponse from '../utilities/GenericResponse';
import AuthHeaderVerifier from '../utilities/SignVerify/AuthHeaderVerifier';
import InitController from './InitController';

vi.mock('../services/LookUpService');
vi.mock('../utilities/SignVerify/AuthHeaderVerifier');
vi.mock('../utilities/GenericResponse');
vi.mock('../services/InitService');

beforeEach(() => {
  AuthHeaderVerifier.authorize = vi.fn(() => Promise.resolve(true));
  LookUpService.getPublicKeyWithSubscriberId = vi.fn(() => Promise.resolve());
  GenericResponse.sendAcknowledgement = vi.fn();
  GenericResponse.sendErrorWithAuthorization = vi.fn();
  InitService.init = vi.fn();
});

const req = {
  body: {
    context: {
      action: 'init', transaction_id: 'f34bafcd-2644-4c47-b6bc-e248a0fbd83b', bpp_uri: 'http://localhost:4010', domain: 'nic2004:60221', country: 'IND', city: 'std:080', core_version: '1.0.0', bap_id: 'sample_mobility_bap', bap_uri: 'http://localhost:2010', message_id: '5d850532-ce26-4ac7-9e14-501dc29d8815', timestamp: '2023-02-06T11:23:50+05:30',
    },
    message: {
      order: {
        provider: { id: '111-222-299', fulfillments: [{ tracking: false, start: { location: { gps: '12.9372469,77.6109981' } }, end: { location: { gps: '12.9702626,77.6099629' } } }] },
        items: [{
          id: 'TRAIN_22222_3A', descriptor: { name: 'CSMT RAJDHANI 3A', code: 'TRAIN_22222_3A' }, price: { currency: 'INR', value: '825' }, category_id: '3A',
        }],
        quote: { price: { currency: 'INR', value: 855 }, breakup: [{ title: 'Fare', price: { currency: 'INR', value: '825' } }, { title: 'CGST', price: { currency: 'INR', value: '15' } }, { title: 'SGST', price: { currency: 'INR', value: '15' } }] },
        billing: {
          name: 'uy', email: 'p@g.c', phone: '1234567890', created_at: '2023-02-06T11:23:50+05:30', updated_at: '2023-02-06T11:23:50+05:30',
        },
      },
    },
  },
};

describe('Init Controller', () => {
  it('should check whether public key is obtained', async () => {
    await InitController.init(req);
    expect(LookUpService.getPublicKeyWithSubscriberId).
    toBeCalledWith(req.body.context.bap_id);
  });

  it('should test with request is authorised', async () => {
    await InitController.init(req);
    expect(AuthHeaderVerifier.authorize).toBeCalled();
  });

  it('should test for init service is called', async () => {
    await InitController.init(req);
    expect(InitService.init).toBeCalledWith(req.body);
  });

  it('should test for authorization failure', async () => {
    AuthHeaderVerifier.authorize = vi.fn(() => Promise.reject(new Error('fail')));
    const res = {};
    await InitController.init(req, res);
    expect(GenericResponse.sendErrorWithAuthorization).toBeCalledWith(res);
  });

  it('should test for generic response is called', async () => {
    const res = {};
    await InitController.init(req, res);
    expect(GenericResponse.sendAcknowledgement).toBeCalledWith(res);
  });
});
