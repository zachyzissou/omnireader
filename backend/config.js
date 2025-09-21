const env = process.env.NODE_ENV ?? 'development';

const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const DEFAULT_DEV_CONNECTION = {
  host: 'localhost',
  port: 5432,
  user: 'omnifeed',
  password: 'changeme',
  database: 'omnifeed',
};

const resolvedClient = (process.env.DB_CLIENT ?? '').toLowerCase();
const defaultClient = env === 'test' ? 'sqlite3' : 'pg';
const client = resolvedClient || defaultClient;

let connection;

if (client === 'sqlite3') {
  connection = {
    filename: process.env.DB_FILENAME || ':memory:',
  };
} else {
  const manualConnection = {
    host: process.env.DB_HOST,
    port: parseNumber(process.env.DB_PORT, undefined),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };

  const hasManualConnection = Object.values(manualConnection).every(
    (value) => value !== undefined && value !== '',
  );

  const connectionFromEnv = process.env.DATABASE_URL ?? (hasManualConnection ? manualConnection : null);

  connection = connectionFromEnv;

  if (!connection) {
    const hint =
      'Set DATABASE_URL or provide DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, and DB_NAME.';
    if (env === 'production') {
      throw new Error(`Missing database configuration (${env}). ${hint}`);
    }
    console.warn(`Warning: ${hint} Falling back to local development defaults.`);
    connection = DEFAULT_DEV_CONNECTION;
  }
}

const databaseConfig = {
  client,
  connection,
  migrations: {
    directory: './migrations',
  },
};

if (client === 'sqlite3') {
  databaseConfig.useNullAsDefault = true;
} else {
  databaseConfig.pool = {
    min: parseNumber(process.env.DB_POOL_MIN, 2),
    max: parseNumber(process.env.DB_POOL_MAX, 10),
  };
}

export const appConfig = {
  env,
  port: parseNumber(process.env.PORT, 4000),
  profiling: process.env.PROFILING === 'true',
  database: databaseConfig,
};
