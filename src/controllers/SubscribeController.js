import SubscribeService from '../services/SubscribeService';
import GenericResponse from '../utilities/GenericResponse';

const subscribe = async (req, res) => {
  // console.log('in subscribe');
  // console.log(process.env.SELLER_APP_PORT);
  // console.log(process.env.SELLER_APP_ID);
  // console.log(process.env.SELLER_APP_URL);
  // console.log(process.env.MODE);
  SubscribeService.subscribe();
  GenericResponse.sendAcknowledgement(res);
};

export default {
  subscribe,
};
