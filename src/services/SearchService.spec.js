import {
  expect, it, vi, beforeEach, describe,
} from 'vitest';
import fs from 'fs';
import LookUpService from './LookUpService';
import authVerifier from '../utilities/SignVerify/AuthHeaderVerifier';
import GenericResponse from '../utilities/GenericResponse';
import SearchService from './SearchService';
import Api from '../api/Api';
// import Api from '../api/Api';

vi.mock('../services/LookUpService');
vi.mock('../utilities/SignVerify/AuthHeaderVerifier');
vi.mock('../utilities/GenericResponse');
vi.mock('../services/TrackService');
vi.mock('fs');
// vi.mock('../api/Api');

const file = {
  catalog: {
    'bpp/descriptor': {
      name: 'Bake Taxi',
      code: 'Bake_TAXI',
    },
    'bpp/providers': [
      {
        id: '111-222-300',
        descriptor: {
          name: "Bake Taxi's",
          long_desc: 'We are Bake',
          images: [
            'https://s3.amazonaws.com/ionic-marketplace/uber-clone-using-ionic-and-firebase/icon.jpg',
          ],
        },
        locations: [
          {
            id: 'Bake_TAXI_LOCATION_ID',
            gps: '12.973614,77.608548',
          },
        ],
        categories: [
          {
            id: 'Bake_TAXI_SEDAN',
            descriptor: {
              name: 'Sedan Taxi',
            },
          },
          {
            id: 'Bake_TAXI_SUV',
            descriptor: {
              name: 'SUV Taxi',
            },
          },
        ],
        items: [
          {
            id: 'Bake_SEDAN_ID',
            fulfillment_id: 'Bake_SEDAN_FULFILLMENT_ID',
            descriptor: {
              name: 'Sedan',
              code: 'SEDAN_TAXI',
              images: [
                'https://cdn.iconscout.com/icon/premium/png-256-thumb/sedan-car-469131.png',
              ],
            },
            price: {
              currency: 'INR',
              value: '1111',
            },
            category_id: 'Bake_TAXI_SEDAN',
          },
          {
            id: 'Bake_SUV_ID',
            fulfillment_id: 'Bake_SUV_FULFILLMENT_ID',
            descriptor: {
              name: 'SUV',
              code: 'SUV_TAXI',
              images: [
                'https://cdn.iconscout.com/icon/premium/png-256-thumb/taxi-2716987-2254385.png',
              ],
            },
            price: {
              currency: 'INR',
              value: '1411',
            },
            category_id: 'Bake_TAXI_SUV',
          },
        ],
      },
    ],
    'bpp/fulfillments': [
      {
        tracking: false,
      },
    ],
  },
};

beforeEach(() => {
  authVerifier.authorize = vi.fn(() => Promise.resolve(true));
  LookUpService.getPublicKeyWithSubscriberId = vi.fn(() => Promise.resolve('1111'));
  GenericResponse.sendAcknowledgement = vi.fn();
  GenericResponse.sendErrorWithAuthorization = vi.fn();
  //   Api.doPost = vi.fn(() => Promise.resolve('{ message: { ack: { status: ACK } } }'));
  fs.readFileSync = vi.fn(() => JSON.stringify(file));
});

const req = {
  context: {
    domain: 'nic2004:60221',
    country: 'IND',
    city: 'std:080',
    action: 'search',
    core_version: '1.0.0',
    bap_id: 'sample_mobility_bap',
    bap_uri: 'http://localhost:2010',
    transaction_id: '27423a3b-196b-4287-a783-c2ca4ecea0ad',
    message_id: 'dcde5358-ee85-4b33-9db6-5ac7157980cc',
    timestamp: '2023-02-16T09:20:33+05:30',
  },
  message: {
    intent: {
      fulfillment: {
        start: {
          location: {
            gps: '12.9372469,77.6109981',
          },
        },
        end: { location: { gps: '12.9702626,77.6099629' } },
      },
    },
  },
};

describe('Track Controller', () => {
  it('should test whether provider id is attained', async () => {
    await SearchService.search(req);
    expect(
      LookUpService.getProviderId,
    ).toHaveBeenCalled();
  });

  it('should test whether response is read from file', async () => {
    await SearchService.search(req);
    expect(fs.readFileSync).toBeCalled();
  });
  it.skip('should check whether post call is done', async () => {
    await SearchService.search(req);
    expect(Api.doPost).toBeCalled();
  });
});
