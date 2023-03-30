import {
  expect, it, vi, beforeEach, describe,
} from 'vitest';
import Api from '../api/Api';
import ContextBuilder from '../utilities/ContextBuilder';
import SubscribeService from './SubscribeService';

vi.mock('../utilities/ContextBuilder');

beforeEach(() => {
  ContextBuilder.getSubscriberContext = vi.fn();
  const body = 'body';
  Api.doPost = vi.fn(() => Promise.resolve({
    text: () => Promise.resolve(body),
  }));
});

describe('Subscribe Service', () => {
  it('should test getSubscriberContext is called', async () => {
    await SubscribeService.subscribe();
    expect(ContextBuilder.getSubscriberContext).toBeCalled();
  });

  it('should test whether the post call is made', async () => {
    await SubscribeService.subscribe();
    expect(Api.doPost).toBeCalled();
  });
});
