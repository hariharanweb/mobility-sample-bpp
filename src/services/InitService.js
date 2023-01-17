import * as dotenv from 'dotenv';
import ContextBuilder from '../utilities/ContextBuilder';
import LoggingService from './LoggingService';
import Api from '../api/Api';

dotenv.config();

const init = async (request) => {
  const totalValue = 30 + parseInt(request.message.order.items[0].price.value, 10);
  const data = {
    order: {
      provider: {
        id: request.message.order.provider.id,
      },
      items: request.message.order.items,
      quote: {
        price: {
          currency: request.message.order.items[0].price.currency,
          value: totalValue,
        },
        breakup: [
          {
            title: 'Fare',
            price: request.message.order.items[0].price,
          },
          {
            title: 'Tax',
            price: {
              currency: 'INR',
              value: '30',
            },
          },
        ],
      },
    },
  };
  const logger = LoggingService.getLogger('InitService');
  logger.debug(JSON.stringify(request));
  const response = {
    context: ContextBuilder.getContextWithContext(request.context),
    message: data,
  };
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(resolve, 3000)); // delayed result
  const url = `${request.context.bap_uri}/on_init`;
  const postResponse = await Api.doPost(url, JSON.stringify(response));
  const body = await postResponse.text();
  logger.debug(`Response ${body}`);
};

export default {
  init,
};
