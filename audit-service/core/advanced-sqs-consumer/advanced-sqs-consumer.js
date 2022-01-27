const { Consumer } = require('sqs-consumer');
const _ = require('lodash');
const ExponentialBackoffRetryStrategy = require('./exponential-backoff-retry-strategy');
const { EventEmitter } = require('events');
const winston = require('winston');


class AdvancedSqsConsumer extends EventEmitter {
  constructor(options, sqs) {
    super();
    options = options || {};
    const additionalAttributeNames = ['ApproximateReceiveCount'];
    const extendedOptions = Object.assign({}, options, {
      attributeNames: _.uniq(_.concat(options.attributeNames || [], additionalAttributeNames)),
      handleMessage: this._createAdvancedHandleMessage(options.handleMessage)
    });
    this.logger = options.logger || winston;
    // Max delay should be cumulatively less than 12 hrs. https://stackoverflow.com/a/31934134
    this.maxAllowedRetryCount = 9;
    // 9 retries => 2^9*30secs => 256mins => 4.2hrs => Cumulative ~8.4 hrs less than 12 hrs
    this.retryStrategy = options.retryStrategy
    || new ExponentialBackoffRetryStrategy(30/*30 seconds*/, 60 * 60 * 6/*6 hrs*/);
    this.maxRetryCount =
      Math.min(options.maxRetryCount || this.maxAllowedRetryCount, this.maxAllowedRetryCount);
    this.consumer = Consumer.create(extendedOptions, sqs);
    this._handleConsumerEvents();
  }

  _handleConsumerEvents() {
    this.consumer.on('error', (error) => {
      this.logger.error(`Error occured while receiving message from ${this.consumer.queueUrl}\n`, error);
      this.emit('error', error);
    });

    this.consumer.on('processing_error', (error, message) => {
      this.logger.error(`Processing Error for queue:${this.consumer.queueUrl}, messageId:${message.MessageId}\n`, error);
      this.emit('processing_error', error, message);
    });

    this.consumer.on('timeout_error', (error, message) => {
      this.logger.error(`Timeoout Error for queue:${this.consumer.queueUrl}, messageId:${message.MessageId}\n`, error);
      this.emit('timeout_error', error, message);
    });
  }

  static create(options) {
    return new AdvancedSqsConsumer(options);
  }

  _createAdvancedHandleMessage(basichandleMessage) {
    return async (message) => {
        try {
          this.logger.info(`Received message: ${message.MessageId}`);
          return await basichandleMessage(message);
        } catch (error) {
          const retryCount = message.Attributes.ApproximateReceiveCount - 1;
          const delay = this.retryStrategy.getDelayBeforeNextRetry(retryCount);
          await this.consumer.sqs.changeMessageVisibility({
            QueueUrl: this.consumer.queueUrl,
            ReceiptHandle: message.ReceiptHandle,
            VisibilityTimeout: delay
          }).promise();
          if (retryCount >= this.maxRetryCount) {
            this.logger.error(`Message retyCount:${retryCount} execeed maxRetryCount:${this.maxRetryCount}. Current error: `, error);
            let messageContent = null;
            try {
              messageContent = JSON.parse(JSON.parse(message.Body).Message);
            } catch (e) {
              messageContent = { message: message.Body };
            }
          } else {
            throw error;
          }
        }
    };
  }

  start() {
    this.consumer.start();
  }
}

module.exports = AdvancedSqsConsumer;
