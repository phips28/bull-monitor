# @bull-monitor/koa

[Koa](https://github.com/koajs/koa) adapter for [bull-monitor](https://github.com/s-r-x/bull-monitor)

## Usage

@bull-monitor/koa has a peer dependency of koa-router

```sh
npm i koa @bull-monitor/koa bull koa-router
```

```typescript
import { BullMonitorKoa } from '@bull-monitor/koa';
import Koa from 'koa';
import Queue from 'bull';

(async () => {
  const queues = [new Queue('1', 'REDIS_URI')];
  const app = new Koa();
  const monitor = new BullMonitorKoa({
    queues,
    baseUrl: '/my/url',
    // enables graphql playground at /my/url/graphql. true by default
    gqlPlayground: true,
    queues,
    // enable metrics collector. false by default
    // metrics are persisted into redis as a list
    // with keys in format "bull_monitor::metrics::{{queue}}"
    metrics: {
      // collect metrics every X
      // where X is any value supported by https://github.com/kibertoad/toad-scheduler
      collectInterval: { hours: 1 },
      maxMetrics: 100,
      // disable metrics for specific queues
      blacklist: ['1'],
    },
  });
  await monitor.init({
    // optional middleware that will run before the bull-monitor router
    middleware: async (_ctx, next) => {
      console.log('do something');
      await next();
    },
  });
  app.use(monitor.router.routes());
  app.listen(3000);
})();
```
