import {
  expect, it, vi, beforeEach, describe,
} from 'vitest';
import LookUpService from '../services/LookUpService';
import StatusController from './StatusController';
import AuthVerifier from '../utilities/SignVerify/AuthHeaderVerifier';
import GenericResponse from '../utilities/GenericResponse';
import StatusService from '../services/StatusService';

vi.mock('../services/LookUpService');
vi.mock('../utilities/SignVerify/AuthHeaderVerifier');
vi.mock('../utilities/GenericResponse');
vi.mock('../services/StatusService');

beforeEach(() => {
  AuthVerifier.authorize = vi.fn(() => Promise.resolve(true));
  LookUpService.getPublicKeyWithSubscriberId = vi.fn(() => Promise.resolve('1111'));
  GenericResponse.sendAcknowledgement = vi.fn();
  GenericResponse.sendErrorWithAuthorization = vi.fn();
  StatusService.status = vi.fn();
});

const req = {
  body: {
    context: {
      action: 'status',
      transaction_id: '699a1f46-a0b4-4a20-a0a4-dc06b469bf2e',
      bpp_uri: 'http://localhost:4010',
      bpp_id: 'sample_mobility_bpp_trains',
      domain: 'nic2004:60221',
      country: 'IND',
      city: 'std:080',
      core_version: '1.0.0',
      bap_id: 'sample_mobility_bap',
      bap_uri: 'http://localhost:2010',
      message_id: 'ae032f87-64b2-414d-84f3-f0778bec1c9b',
      timestamp: '2023-02-06T13:07:48+05:30',
    },
    message: { order: { id: '9fe1f8d0-2861-4010-81fc-87e16824c2d2' } },
  },
};

describe('Status Controller', () => {
  it('should test whether public key is attained', async () => {
    await StatusController.status(req);
    expect(
      LookUpService.getPublicKeyWithSubscriberId,
    ).toBeCalledWith(req.body.context.bap_id);
  });

  it('should test with request is authorised', async () => {
    await StatusController.status(req);
    expect(AuthVerifier.authorize).toBeCalled();
  });

  it('should test for status service is called', async () => {
    await StatusController.status(req);
    expect(StatusService.status).toBeCalledWith(req.body);
  });

  it('should test for authorization failure', async () => {
    AuthVerifier.authorize = vi.fn(() => Promise.reject(new Error('fail')));
    const res = {};
    await StatusController.status(req, res);
    expect(GenericResponse.sendErrorWithAuthorization).toBeCalledWith(res);
  });

  it('should test for generic response is called', async () => {
    const res = {};
    await StatusController.status(req, res);
    expect(GenericResponse.sendAcknowledgement).toBeCalledWith(res);
  });
});
