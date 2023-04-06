import ContextBuilder from '../utilities/ContextBuilder';
import LoggingService from './LoggingService';
import Api from '../api/Api';
import OrderRepository from '../repo/OrderRepository';

const confirm = async (request) => {
  request.message.order.fulfillment.tracking = (process.env.MODE === 'CABS');
  const data = {
    order: {
      ...request.message.order,
      fulfillment: {
        ...request.message.order.fulfillment,
        tracking: true,
        agent: {
          name: 'Nikhil',
          dob: '01/02/1996',
          gender: 'Male',
          phone: '9876543210',
          email: 'nikhil@gmail.com',
        },
        vehicle: {
          category: 'Cab',
          capacity: '4',
          model: 'Sedan',
          color: 'black',
          energy_type: 'fuel',
          registration: 'DL 04 4444',
        },
      },
    },
  };
  const logger = LoggingService.getLogger('ConfirmService');
  logger.debug(JSON.stringify(request));
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(resolve, 5000)); // delayed result
  data.order.fulfillment.state = {
    descriptor: {
      code: 'RIDE_SELECTED',
    },
  };
  data.order.fulfillment.start.authorization = {
    type: 'OTP',
    token: '112233',
  };

  const response = {
    context: ContextBuilder.getContextWithContext(request.context),
    message: data,
  };
  const url = `${request.context.bap_uri}/on_confirm`;
  OrderRepository.storeResult(response);
  const postResponse = await Api.doPost(url, JSON.stringify(response));
  const body = await postResponse.text();
  logger.debug(`Response ${body}`);
};

export default {
  confirm,
};
