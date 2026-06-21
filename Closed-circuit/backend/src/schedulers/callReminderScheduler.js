import cron from 'node-cron';
import { config } from '../config/env.js';
import { processDueCallReminders } from '../services/inquiryNotificationService.js';

let started = false;

export function startCallReminderScheduler() {
  if (started) {
    return;
  }

  started = true;

  cron.schedule(
    '0 * * * *',
    async () => {
      try {
        const processed = await processDueCallReminders();
        if (processed > 0) {
          console.log(`[scheduler] Processed ${processed} call reminder candidate(s)`);
        }
      } catch (err) {
        console.error('[scheduler] Call reminder run failed:', err.message);
      }
    },
    { timezone: config.timezone }
  );

  console.log(`✅ Call reminder scheduler started (hourly, ${config.timezone})`);
}

export async function runCallReminderSchedulerNow() {
  return processDueCallReminders();
}
