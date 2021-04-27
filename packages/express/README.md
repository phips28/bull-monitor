# @bull-monitor/express

[Express](https://github.com/expressjs/express) adapter for [bull-monitor](https://github.com/s-r-x/bull-monitor)

## Usage
```sh
npm i express @bull-monitor/express bull
```

```typescript
import { BullMonitorExpress } from '@bull-monitor/express';
import Express from 'express';
import Queue from 'bull';

(async () => {
  const queues = [new Queue('1', 'REDIS_URI')];
  const app = Express();
  const monitor = new BullMonitorExpress({ 
    // enables graphql playground at /my/url/graphql. true by default
    gqlPlayground: true, 
    queues
  });
  await monitor.init();
  app.use('/my/url', monitor.router);
  app.listen(3000);
})();
```