import * as dotenv from 'dotenv';
import { v4 as uuid } from 'uuid';
import ContextBuilder from '../utilities/ContextBuilder';
import LoggingService from './LoggingService';
import Api from '../api/Api';
import OrderRepository from '../repo/OrderRepository';

dotenv.config();

const init = async (request) => {
  const data = {
    order: {
      ...request.message.order,
      id: uuid(),
      payment: {
        uri: 'https://api.bpp.com/pay?amt=$amount&txn_id=ksh87yriuro34iyr3p4&mode=upi&vpa=bpp@upi',
        tl_method: 'http/get',
        params: {
          transaction_id: uuid(),
          amount: '1800',
          mode: 'upi',
          vpa: 'bpp@upi',
        },
      },
    },
  };
  const logger = LoggingService.getLogger('InitService');
  logger.debug(JSON.stringify(request));
  const response = {
    context: ContextBuilder.getContextWithContext(request.context),
    message: data,
  };
  const url = `${request.context.bap_uri}/on_init`;
  OrderRepository.storeResult(response);
  const postResponse = await Api.doPost(url, JSON.stringify(response));
  const body = await postResponse.text();
  logger.debug(`Response ${body}`);
};

export default {
  init,
};
