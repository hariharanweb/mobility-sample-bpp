import {
  expect, it, vi, beforeEach, describe,
} from 'vitest';
import SearchController from './SearchController';
import LookUpService from '../services/LookUpService';
import AuthVerifier from '../utilities/SignVerify/AuthHeaderVerifier';
import GenericResponse from '../utilities/GenericResponse';
import SearchService from '../services/SearchService';

vi.mock('../services/LookUpService');
vi.mock('../services/SearchService');
vi.mock('../utilities/SignVerify/AuthHeaderVerifier');

beforeEach(() => {
  AuthVerifier.authorize = vi.fn(() => Promise.resolve(true));
  LookUpService.getPublicKey = vi.fn(() => Promise.resolve());
  GenericResponse.sendAcknowledgement = vi.fn();
  GenericResponse.sendErrorWithAuthorization = vi.fn();
  SearchService.search = vi.fn();
});

GenericResponse.sendErrorWithAuthorization = vi.fn((res) => {
  res.status(401).send('Status: NOT');
});

const req = {
  body:{
  context: {
    domain: 'nic2004:60221',
    country: 'IND',
    city: 'std:080',
    action: 'search',
    core_version: '1.0.0',
    bap_id: 'sample_mobility_bap',
    bap_uri: 'http://localhost:2010',
    transaction_id: 'd6f43bc3-3daf-4eca-9cde-54ae0c15a1fe',
    message_id: 'c39c712c-01ed-43e7-82cc-8ab08740b559',
    timestamp: '2023-02-02T10:46:23+05:30',
  },
  message: {
    intent: {
      fulfillment: {
        start: { location: { gps: '12.9372469,77.6109981' } },
        end: { location: { gps: '12.9702626,77.6099629' } },
      },
    },
  },
}};
describe('Seach Controller', () => {
  it('should test for lookupservice is called', async () => {
    await SearchController.search(req);
    expect(LookUpService.getPublicKey).toBeCalledWith("BG");
  });

  it('should test for authorize is called', async () => {
    await SearchController.search(req);
    expect(AuthVerifier.authorize).toBeCalled();
  });

  it('should test for Search service is called', async () => {
    await SearchController.search(req);
    expect(SearchService.search).toBeCalledWith(req.body);
  });

  it('should test for authorization failure', async () => {
    AuthVerifier.authorize = vi.fn(() => Promise.reject(new Error('fail')));
    const res = {};
    await SearchController.search(req, res);
    expect(GenericResponse.sendErrorWithAuthorization).toBeCalledWith(res);
  });

  it('should test for search response', async () => {
    const res = {};
    await SearchController.search(req, res);
    expect(GenericResponse.sendAcknowledgement).toBeCalledWith(res);
  });
});
