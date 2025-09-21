import knex from 'knex';
import { appConfig } from './config.js';

const db = knex(appConfig.database);

export default db;
