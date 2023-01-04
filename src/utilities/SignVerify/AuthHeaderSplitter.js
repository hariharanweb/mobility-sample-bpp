import LoggingService from '../../services/LoggingService';

const removeQuotes = (value) => {
  if (value.length >= 2
      && value.charAt(0) == '"'
      && value.charAt(value.length - 1) == '"') {
    value = value.substring(1, value.length - 1);
  }
  return value;
};

const splitAuthHeader = (authHeader) => {
  const logger = LoggingService.getLogger('AuthHeaderSplitter');
  logger.debug(`Auth Header to parse ${authHeader}`);

  const header = authHeader.replace('Signature ', '');
  const re = /\s*([^=]+)=([^,]+)[,]?/g;
  let m;
  const parts = {};
  while ((m = re.exec(header)) !== null) {
    if (m) {
      parts[m[1]] = removeQuotes(m[2]);
    }
  }
  return parts;
};

export default {
  splitAuthHeader,
};
