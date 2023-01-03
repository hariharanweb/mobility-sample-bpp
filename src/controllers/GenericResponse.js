import Api from '../api/Api';

const lookupUrl = `${process.env.GATEWAY_URL}/lookup`;

const sendAcknowledgement = (res) => {
  res.send({
    message: {
      ack: {
        status: 'ACK',
      },
    },
  });
};

const sendErrorWithAuthorization = (res) => {
  res.status(401).send('Error');
};

const getPublicKey = async (typeValue) => {
  const request = JSON.stringify({ type: 'BG' });

  const response = await Api.doPost('http://localhost:1010/lookup', request);
  const responseJson = await response.json();
  const publicKey = await responseJson[0].signing_public_key;
  return publicKey;
};

export default {
  sendErrorWithAuthorization,
  sendAcknowledgement,
  getPublicKey,
};
