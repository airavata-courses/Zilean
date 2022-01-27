## Usage

```js
const { AdvancedSqsConsumer } = require('advanced-sqs-consumer');

const app = AdvancedSqsConsumer.create({
  sqs,
  queueUrl: "<sqs-queue-url>",
  logger,
  maxRetryCount: 3,
  handleMessage: async () => {
      // queue consumption logic
  },
});

app.start();
```
