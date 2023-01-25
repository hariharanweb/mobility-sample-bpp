import * as dotenv from 'dotenv';
import randomize from 'randomatic';
import ContextBuilder from '../utilities/ContextBuilder';
import LoggingService from './LoggingService';
import Api from '../api/Api';
import OrderRepository from '../repo/OrderRepository';

dotenv.config();

const status = async (request) => {
  const orderFromCache = OrderRepository.getResult(request.message.order.id);
  const data = {
    order: {
      ...orderFromCache,
      state: 'CONFIRMED',
      fulfillment: {
        ...orderFromCache[0].message.order.fulfillment,
        state: {
          code: 'DRIVER_ALLOCATED',
        },
        start: {
          ...orderFromCache[0].message.order.fulfillment.start,
          authorization: {
            type: 'OTP',
            token: randomize('0', 4),
          },
        },
      },
    },
  };
  const logger = LoggingService.getLogger('StatusService');
  logger.debug(JSON.stringify(request));
  const response = {
    context: ContextBuilder.getContextWithContext(request.context),
    message: data,
  };
  const url = `${request.context.bap_uri}/on_status`;
  const postResponse = await Api.doPost(url, JSON.stringify(response));
  const body = await postResponse.text();
  logger.debug(`Response ${body}`);
};

export default {
  status,
};
