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

export default {
  sendErrorWithAuthorization,
  sendAcknowledgement,
};
