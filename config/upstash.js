import { Client as WorkflowClient } from '@upstash/workflow';

import { QSTASH_TOKEN, QSTASH_URL } from './env';

export const WorkflowClient = new WorkflowClient({
  token: QSTASH_TOKEN,
  url: QSTASH_URL,
});
