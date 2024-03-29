import moment from 'moment';

const getContextWithContext = (context) => ({
  ...context,
  domain: 'nic2004:60221',
  country: 'IND',
  city: 'std:080',
  core_version: '1.0.0',
  bpp_id: process.env.SELLER_APP_ID,
  bpp_uri: process.env.SELLER_APP_URL,
  timestamp: moment().format(),
});

const getSubscriberContext = () => ({
  operation: {
    ops_no: 1,
  },
});

export default {
  getContextWithContext,
  getSubscriberContext,
};
