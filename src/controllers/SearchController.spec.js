import {
  expect, it, vi, beforeEach, describe,
} from 'vitest';
import searchController from './SearchController';
import LookUpService from '../services/LookUpService';
import authVerifier from '../utilities/SignVerify/AuthHeaderVerifier';
import GenericResponse from '../utilities/GenericResponse';
import SearchService from '../services/SearchService';

vi.mock('../services/LookUpService');
vi.mock('../services/SearchService');
vi.mock('../utilities/SignVerify/AuthHeaderVerifier');

beforeEach(() => {
  authVerifier.authorize = vi.fn(() => Promise.resolve(true));
  LookUpService.getPublicKey = vi.fn(() => Promise.resolve());
  GenericResponse.sendAcknowledgement = vi.fn();
  GenericResponse.sendErrorWithAuthorization = vi.fn();
  SearchService.search = vi.fn();
});

GenericResponse.sendErrorWithAuthorization = vi.fn((res) => {
  res.status(401).send('Status: NOT');
});

const request = {
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
};
describe('Seach Controller', () => {
  it('should test for lookupservice is called', async () => {
    await searchController.search(request);
    expect(LookUpService.getPublicKey).toBeCalled();
  });

  it('should test for authorize is called', async () => {
    await searchController.search(request);
    expect(authVerifier.authorize).toHaveBeenCalled();
  });

  it('should test for Search service is called', async () => {
    await searchController.search(request);
    expect(SearchService.search).toHaveBeenCalled();
  });

  it('should test for authorization failure', async () => {
    authVerifier.authorize = vi.fn(() => Promise.reject(new Error('fail')));
    const res = {};
    await searchController.search(request, res);
    expect(GenericResponse.sendErrorWithAuthorization).toBeCalled();
  });

  it('should test for search response', async () => {
    const res = {};
    await searchController.search(request, res);
    expect(GenericResponse.sendAcknowledgement).toBeCalledWith(res);
  });
});
