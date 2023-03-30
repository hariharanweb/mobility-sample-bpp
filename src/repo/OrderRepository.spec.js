import {
  expect, it, vi, beforeEach, describe,
} from 'vitest';
import Cache from '../utilities/Cache';
import OrderRepository from './OrderRepository';

vi.mock('../utilities/Cache');

beforeEach(() => {
  Cache.setCache = vi.fn();
  Cache.getCache = vi.fn();
});

const response = { message: { order: { id: '123' } } };

const orderId = response.message.order.id;

describe('Order Repository', () => {
  it('should test setCache is called', async () => {
    await OrderRepository.storeResult(response);
    expect(Cache.setCache).toBeCalledWith(orderId, [response]);
  });

  it('should test getCache is called', async () => {
    OrderRepository.getResult(orderId);
    expect(Cache.getCache).toBeCalledWith(orderId);
  });
});
