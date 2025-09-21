import { appConfig } from './config.js';

export default {
  development: appConfig.database,
  test: appConfig.database,
  production: appConfig.database,
};
