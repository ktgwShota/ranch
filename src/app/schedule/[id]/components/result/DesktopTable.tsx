'use client';

import type { DateTimeItem, Response } from '../../types';
import TableHeader from '../shared/TableHeader';
import TableRow from '../shared/TableRow';

interface DesktopTableProps {
  allDateTimes: DateTimeItem[];
  responses: Response[];
  confirmedDateTime: string | null;
}

export default function DesktopTable({
  allDateTimes,
  responses,
  confirmedDateTime,
}: DesktopTableProps) {
  return (
    <div>
      {/* ヘッダー行 */}
      <TableHeader
        allDateTimes={allDateTimes}
        responses={responses}
        confirmedDateTime={confirmedDateTime}
      />

      {/* 回答者行 */}
      {responses.length > 0 &&
        responses.map((response) => (
          <TableRow
            key={response.respondentId}
            response={response}
            allDateTimes={allDateTimes}
            confirmedDateTime={confirmedDateTime}
          />
        ))}
    </div>
  );
}
