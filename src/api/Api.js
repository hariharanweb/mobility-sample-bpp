import fetch from "node-fetch";
import LoggingService from "../services/LoggingService";
import sodium from 'libsodium-wrappers';

const doPost = async (url, body) => {
  const logger = LoggingService.getLogger("API");
  logger.debug(`Posting to ${url} with Content ${JSON.stringify(body)}`);

  const signature = await createSignatureWithSodium(JSON.stringify(body));
  logger.debug(`The signature is ${signature}`);

  const gatewayAuthHeaderValue = createAuthorizationHeader(signature);

  return fetch(url, {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      "X-Gateway-Authorization": gatewayAuthHeaderValue,
      "Content-Type": "application/json",
    },
  });
};

const createSignatureWithSodium = async (body) => {
  const created = Math.floor(
    new Date().getTime() / 1000 - 1 * 60,
  ).toString();
  const expires = (parseInt(created) + 1 * 60 * 60).toString();

  await sodium.ready;
  const digest = sodium.crypto_generichash(64, sodium.from_string(body));
  const digest_base64 = sodium.to_base64(digest, sodium.base64_variants.ORIGINAL);
  const signing_string = `(created): ${created}
(expires): ${expires}
digest: BLAKE-512=${digest_base64}`;
  const privateKey = `${process.env.privateKey}`;
  console.log(`private key is :${privateKey}`); 
  const signedMessage = sodium.crypto_sign_detached(
    signing_string,
    sodium.from_base64(privateKey, sodium.base64_variants.ORIGINAL),
  );
  return sodium.to_base64(signedMessage, sodium.base64_variants.ORIGINAL);
};

const createAuthorizationHeader = (signature) => {
  const created = Math.floor(new Date().getTime() / 1000 - 1 * 60).toString(); // TO USE IN CASE OF TIME ISSUE
  const expires = (parseInt(created) + 1 * 60 * 60).toString(); // Add required time to create expired

  const header = `Signature keyId="1001|UUID|ed25519",algorithm="ed25519",created="${created}",expires="${expires}",headers="(created) (expires) digest",signature="${signature}"`;
  console.log("In createAuthorizationHeader " + header);
  return header;
};

export default {
  doPost,
};
