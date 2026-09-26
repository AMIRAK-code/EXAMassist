'use client';

import { useEffect, useState } from 'react';
import { PendingStore, deviceStorage, purgePending } from '@/lib/player/pending';
import { Alert } from '@/components/ui';

/**
 * On a finished session's results: answers made on this device that never
 * reached the server (the connection was down when time ran out, or the
 * session was submitted from elsewhere). They cannot count any more, so the
 * learner is told how many, and they are deleted from the device. Renders
 * nothing in the usual case, where nothing was left waiting.
 */
export function UnsentAnswersNotice({ attemptId, owner }: { attemptId: string; owner: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const { storage } = deviceStorage();
    purgePending(storage, owner);
    const record = new PendingStore(storage, owner, attemptId).clear();
    setCount(record.answers.length);
  }, [attemptId, owner]);

  if (count === 0) return null;
  return (
    <Alert tone="caution" role="status" className="mb-6">
      <p>
        {`${count === 1 ? '1 answer' : `${count} answers`} made on this device did not reach the server before this session ended, so ${count === 1 ? 'it is' : 'they are'} not part of these results. ${count === 1 ? 'It has' : 'They have'} been removed from this device.`}
      </p>
    </Alert>
  );
}
