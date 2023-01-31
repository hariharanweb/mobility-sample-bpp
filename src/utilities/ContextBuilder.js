import * as dotenv from 'dotenv';
import moment from 'moment';

dotenv.config();

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

export default {
  getContextWithContext,
};
