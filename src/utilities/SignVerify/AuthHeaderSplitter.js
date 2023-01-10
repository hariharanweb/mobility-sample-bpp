import LoggingService from '../../services/LoggingService';

const removeQuotes = (value) => {
  if (value.length >= 2
      && value.charAt(0) === '"'
      && value.charAt(value.length - 1) === '"') {
    const result = value.substring(1, value.length - 1);
    return result;
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
  m = re.exec(header);
  while (m !== null) {
    if (m) {
      parts[m[1]] = removeQuotes(m[2]);
    }
    m = re.exec(header);
  }
  return parts;
};

export default {
  splitAuthHeader,
};
