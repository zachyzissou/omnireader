export default {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || {
      host: 'localhost',
      port: 5432,
      user: 'omnifeed',
      password: 'changeme',
      database: 'omnifeed'
    },
    migrations: {
      directory: './migrations'
    }
  }
};
