export const retryOptions = {
    attempts: 3,
    backoff: {
        type: 'exponential',
        delay: 1000
    }
  };
  