import SubscribeService from '../services/SubscribeService';
import GenericResponse from '../utilities/GenericResponse';

const subscribe = async (req, res) => {
  SubscribeService.subscribe();
  GenericResponse.sendAcknowledgement(res);
};

export default {
  subscribe,
};
