import Cache from '../utilities/Cache';

const storeResult = async (response) => {
  const orderId = response.message.order.id;
  Cache.setCache(orderId, [response]);
};

const getResult = (orderId) => Cache.getCache(orderId);

export default {
  storeResult,
  getResult,
};
