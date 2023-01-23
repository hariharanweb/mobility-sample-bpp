import * as dotenv from 'dotenv';;
import ContextBuilder from '../utilities/ContextBuilder';
import LoggingService from './LoggingService';
import Api from '../api/Api';
import randomize from "randomatic";

dotenv.config();

const status = async (request) => {
  const data = {
    order: {
      ...request.message.order,
      state: "CONFIRMED",
      fulfillment: {
        ...request.message.order.fulfillment,
        state: {
          code: "DRIVER_ALLOCATED"
        },  
        fulfillment: {
          ...request.message.order.fulfillment.start,
          authorization: {
            type: "OTP",
            token: randomize('0', 4),
          },
        }
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
