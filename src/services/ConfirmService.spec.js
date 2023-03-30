import {
  expect, it, vi, beforeEach, describe,
} from 'vitest';
import Api from '../api/Api';
import ContextBuilder from '../utilities/ContextBuilder';
import OrderRepository from '../repo/OrderRepository';
import ConfirmService from './ConfirmService';

vi.mock('../utilities/ContextBuilder');
vi.mock('../repo/OrderRepository');

beforeEach(() => {
  ContextBuilder.getContextWithContext = vi.fn();
  OrderRepository.storeResult = vi.fn();
  const body = 'body';
  Api.doPost = vi.fn(() => Promise.resolve({
    text: () => Promise.resolve(body),
  }));
});

const req = {
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
};

const data = {
  order: {
    ...req.message.order,
    fulfillment: {
      ...req.message.order.fulfillment,
      agent: {
        name: 'Nikhil',
        dob: '01/02/1996',
        gender: 'Male',
        phone: '9876543210',
        email: 'nikhil@gmail.com',
      },
      vehicle: {
        category: 'Cab',
        capacity: '4',
        model: 'Sedan',
        color: 'black',
        energy_type: 'fuel',
        registration: 'DL 04 4444',
      },
    },
  },
};

const response = {
  context: ContextBuilder.getContextWithContext(req.context),
  message: data,
};

describe('Confirm Service', () => {
  it('should test getContextWithContext is called', async () => {
    await ConfirmService.confirm(req);
    expect(ContextBuilder.getContextWithContext).toBeCalledWith(req.context);
  });

  it('should test storeResult is called', async () => {
    await ConfirmService.confirm(req);
    expect(OrderRepository.storeResult).toBeCalledWith(response);
  });

  it('should test whether the post call is made', async () => {
    const url = `${req.context.bap_uri}/on_confirm`;
    await ConfirmService.confirm(req);
    expect(Api.doPost).toBeCalledWith(url, JSON.stringify(response));
  });
});
