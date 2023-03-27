import {
  expect, it, vi, beforeEach, describe,
} from 'vitest';
import GenericResponse from '../utilities/GenericResponse';
import OnSubscribeController from './OnSubscribeController';

vi.mock('../utilities/GenericResponse');

beforeEach(() => {
  GenericResponse.sendAcknowledgement = vi.fn();
});

const req = {
  body: {
    context: {
      action: 'confirm',
      transaction_id: '45a1abb4-a4d2-4ec6-98d0-f06380322fa9',
      bpp_uri: 'http://localhost:4010',
      domain: 'nic2004:60221',
      country: 'IND',
      city: 'std:080',
      core_version: '1.0.0',
      bap_id: 'sample_mobility_bap',
      bap_uri: 'http://localhost:2010',
      message_id: 'db18fc58-87ce-423e-b2e9-3c007cc6bfc3',
      timestamp: '2023-02-06T11:48:06+05:30',
    },
    message: {
      order: {
        id: '6d3fd918-9844-478f-a552-49da3179097d',
        provider: { id: '111-222-299' },
        items: [{
          id: 'TRAIN_22222_3A', descriptor: { name: 'CSMT RAJDHANI 3A', code: 'TRAIN_22222_3A' }, price: { currency: 'INR', value: '825' }, category_id: '3A',
        }],
        fulfillment: { tracking: false, start: { location: { gps: '12.9372469,77.6109981' } }, end: { location: { gps: '12.9702626,77.6099629' } } },
      },
    },
  },
};

describe('OnSubscribe Controller', () => {
  it('should test for generic response is called', async () => {
    const res = {};
    await OnSubscribeController.onSubscribe(req, res);
    expect(GenericResponse.sendAcknowledgement).toBeCalledWith(res);
  });
});
