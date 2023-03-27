import {
  expect, it, vi, beforeEach, describe,
} from 'vitest';
import LookUpService from '../services/LookUpService';
import TrackController from './TrackController';
import TrackService from '../services/TrackService';
import AuthVerifier from '../utilities/SignVerify/AuthHeaderVerifier';
import GenericResponse from '../utilities/GenericResponse';

vi.mock('../services/LookUpService');
vi.mock('../utilities/SignVerify/AuthHeaderVerifier');
vi.mock('../utilities/GenericResponse');
vi.mock('../services/TrackService');

beforeEach(() => {
  AuthVerifier.authorize = vi.fn(() => Promise.resolve(true));
  LookUpService.getPublicKeyWithSubscriberId = vi.fn(() => Promise.resolve('1111'));
  GenericResponse.sendAcknowledgement = vi.fn();
  GenericResponse.sendErrorWithAuthorization = vi.fn();
  TrackService.track = vi.fn();
});

const req = {
  body: {
    context: {
      action: 'select',
      transaction_id: '280d0bf3-f26f-4ef0-a148-050b6d3341dc',
      bpp_uri: 'http://localhost:4010',
      domain: 'nic2004:60221',
      country: 'IND',
      city: 'std:080',
      core_version: '1.0.0',
      bap_id: 'sample_mobility_bap',
      bap_uri: 'http://localhost:2010',
      message_id: '4780236e-f85e-4939-8afa-2638f6e55401',
      timestamp: '2023-02-05T11:40:40+05:30',
    },
    message: {
      order: {
        provider: {
          id: '111-222-299',
        },
        items: [{
          id: 'TRAIN_22222_3A',
          descriptor: {
            name: 'CSMT RAJDHANI 3A',
            code: 'TRAIN_22222_3A',
          },
          price: {
            currency: 'INR',
            value: '825',
          },
          category_id: '3A',
        }],
        fulfillment: [{ tracking: false, start: { location: { gps: '12.9372469,77.6109981' } }, end: { location: { gps: '12.9702626,77.6099629' } } }],
      },
    },
  },
};

describe('Track Controller', () => {
  it('should test whether public key is attained', async () => {
    await TrackController.track(req);
    expect(
      LookUpService.getPublicKeyWithSubscriberId,
    ).toBeCalledWith(req.body.context.bap_id);
  });

  it('should test with request is authorised', async () => {
    await TrackController.track(req);
    expect(AuthVerifier.authorize).toBeCalled();
  });

  it('should test for track service is called', async () => {
    await TrackController.track(req);
    expect(TrackService.track).toBeCalledWith(req.body);
  });

  it('should test for authorization failure', async () => {
    AuthVerifier.authorize = vi.fn(() => Promise.reject(new Error('fail')));
    const res = {};
    await TrackController.track(req, res);
    expect(GenericResponse.sendErrorWithAuthorization).toBeCalledWith(res);
  });

  it('should test for generic response is called', async () => {
    const res = {};
    await TrackController.track(req, res);
    expect(GenericResponse.sendAcknowledgement).toBeCalledWith(res);
  });
});
