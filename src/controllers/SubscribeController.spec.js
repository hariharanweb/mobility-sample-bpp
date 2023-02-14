import {
  expect, it, vi, beforeEach, describe,
} from 'vitest';
import LookUpService from '../services/LookUpService';
import SubscribeController from './SubscribeController';
import authVerifier from '../utilities/SignVerify/AuthHeaderVerifier';
import GenericResponse from '../utilities/GenericResponse';
import SubscribeService from '../services/SubscribeService';

vi.mock('../services/LookUpService');
vi.mock('../utilities/SignVerify/AuthHeaderVerifier');
vi.mock('../utilities/GenericResponse');
vi.mock('../services/SubscribeService');

beforeEach(() => {
  authVerifier.authorize = vi.fn(() => Promise.resolve(true));
  LookUpService.getPublicKeyWithSubscriberId = vi.fn(() => Promise.resolve('1111'));
  GenericResponse.sendAcknowledgement = vi.fn();
  GenericResponse.sendErrorWithAuthorization = vi.fn();
  SubscribeService.status = vi.fn();
});

describe('Status Controller', () => {
  it('should test for subscribe service is called', async () => {
    await SubscribeController.subscribe();
    expect(SubscribeService.subscribe).toBeCalled();
  });

  it('should test for generic response is called', async () => {
    await SubscribeController.subscribe();
    expect(GenericResponse.sendAcknowledgement).toBeCalled();
  });
});
