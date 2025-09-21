import { createApp } from './app.js';
import { appConfig } from './config.js';

const { app } = await createApp();

app.listen(appConfig.port, () => {
  console.log(`Backend running on port ${appConfig.port}`);
});
