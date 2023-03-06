import ContextBuilder from '../utilities/ContextBuilder';
import LoggingService from './LoggingService';
import Api from '../api/Api';

const select = async (request) => {
  const logger = LoggingService.getLogger('SelectService');
  const totalValue = 30 + parseInt(request.message.order.items[0].price.value, 10);
  const data = {
    order: {
      provider: {
        id: request.message.order.provider.id,
        fulfillments: request.message.order.fulfillment,
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
            title: 'CGST',
            price: {
              currency: 'INR',
              value: '15',
            },
          },
          {
            title: 'SGST',
            price: {
              currency: 'INR',
              value: '15',
            },
          },
        ],
      },
    },
  };
  logger.debug(JSON.stringify(request));
  const response = {
    context: ContextBuilder.getContextWithContext(request.context),
    message: data,
  };
  const url = `${request.context.bap_uri}/on_select`;
  const postResponse = await Api.doPost(url, JSON.stringify(response));
  const body = await postResponse.text();
  logger.debug(`Response ${body}`);
};

export default {
  select,
};
