import { createRequire } from 'module'
import dayjs from 'dayjs';

const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express')

import Subscription from '../models/subscription.model.js';
import { FORMERR } from 'dns';

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== 'active') return;

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date has passed for subscription ${subscriptionId}, Stopping worflow`);
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, 'day');

    if (reminderDate.isAfter(dayjs())) {
      console.log(`Reminder date is in the future for subscription ${subscriptionId}, Stopping worflow`);
      return;
    }
  }
});


const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', () => {
    return Subscription.findById(subscriptionId).populate('user', 'name email');
  })
}


const sleepUntilReminder = async (context, MongoErrorLabel, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label) => {
  return await context.run(label, () => {
    console.log(`Triggering ${label} reminder`);
    //send email, sms, etc...
  })
}