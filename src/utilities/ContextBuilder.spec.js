import { expect, it } from 'vitest';
import moment from 'moment';
import contextBuilder from './ContextBuilder';

const context = {
  domain: 'sample',
  country: 'sample',
  city: 'sample',
  action: 'search',
  core_version: 'sample',
  bap_id: 'sample_mobility_bap',
  bap_uri: 'http://localhost:2010',
  transaction_id: 'f549266e-4297-4c21-81a6-5f9fa59a7a4c',
  message_id: '444a574e-b059-42b6-95e0-18789354517c',
  timestamp: '2023-02-01T16:22:18+05:30',
  bpp_id: '',
  bpp_uri: '',
};

it('should test getContextWithContext', () => {
  const contextResult = contextBuilder.getContextWithContext(context);
  const contextFinal = {
    domain: 'nic2004:60221',
    country: 'IND',
    city: 'std:080',
    action: 'search',
    core_version: '1.0.0',
    bap_id: 'sample_mobility_bap',
    bap_uri: 'http://localhost:2010',
    transaction_id: 'f549266e-4297-4c21-81a6-5f9fa59a7a4c',
    message_id: '444a574e-b059-42b6-95e0-18789354517c',
    timestamp: moment().format(),
    bpp_id: process.env.SELLER_APP_ID,
    bpp_uri: process.env.SELLER_APP_URL,
  };
  expect(contextResult).toStrictEqual(contextFinal);
});
