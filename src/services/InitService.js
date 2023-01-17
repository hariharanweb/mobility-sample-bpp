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
      billing: {
        name: 'John Doe',
        address: {
          door: '21A',
          name: 'ABC Apartments',
          locality: 'HSR Layout',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
          area_code: '560102',
        },
        email: 'user@example.com',
        phone: '+919876543210',
        created_at: '2021-06-15T07:08:36.211Z',
        updated_at: '2021-06-15T07:08:36.211Z',
      },
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
      payment: {
        uri: 'https://api.bpp.com/pay?amt=$amount&txn_id=ksh87yriuro34iyr3p4&mode=upi&vpa=bpp@upi',
        tl_method: 'http/get',
        params: {
          transaction_id: 'ksh87yriuro34iyr3p4',
          amount: '180',
          mode: 'upi',
          vpa: 'bpp@upi',
        },
        type: 'ON-ORDER',
        status: 'NOT-PAID',
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
