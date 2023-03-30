import {
  describe, expect, it, vi, assert, beforeEach,
} from 'vitest';
import GenericResponse from './GenericResponse';

let mockResponse = {};

beforeEach(() => {
  mockResponse = {
    send: vi.fn((response) => {
      assert.deepEqual(response, {
        message: {
          ack: {
            status: 'ACK',
          },
        },
      });
    }),
    status: vi.fn((response) => {
      assert.deepEqual(response, 401);
      return {
        send: vi.fn((res) => {
          assert.deepEqual(res, 'Error');
        }),
      };
    }),
  };
});

describe('Generic response', () => {
  it('should send an acknowledgement message', () => {
    GenericResponse.sendAcknowledgement(mockResponse);
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: {
        ack: {
          status: 'ACK',
        },
      },
    });
  });

  it('should test for sendErrorWithAuthorization', () => {
    GenericResponse.sendErrorWithAuthorization(mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
  });
});
