import React from "react";
import { Table, Badge, Text } from "@mantine/core";
import { defineSlot } from "../registry";

export interface RecordRow {
  rid: string;
  status: number;
  score: number;
  problemPid: string;
  problemTitle: string;
  user: string;
  timeMs: number;
  memoryKb: number;
  lang: string;
  submitAt: string;
}

const STATUS_MAP: Record<number, { label: string; color: string }> = {
  0: { label: "Pending", color: "gray" },
  1: { label: "Judging", color: "yellow" },
  2: { label: "AC", color: "green" },
  3: { label: "WA", color: "red" },
  4: { label: "TLE", color: "orange" },
  5: { label: "MLE", color: "orange" },
  6: { label: "RE", color: "violet" },
  7: { label: "CE", color: "gray" },
  8: { label: "Skipped", color: "gray" },
};

function formatMemory(kb: number): string {
  if (kb >= 1024 * 1024) return `${(kb / (1024 * 1024)).toFixed(1)} GB`;
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb} KB`;
}

function formatTime(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
  return `${ms}ms`;
}

export interface RecordTableProps {
  records: RecordRow[];
}

const RecordTable: React.FC<RecordTableProps> = ({ records }) => {
  const rows = records.map((r) => {
    const status = STATUS_MAP[r.status] || { label: "Unknown", color: "gray" };
    return (
      <Table.Tr key={r.rid}>
        <Table.Td>
          <Badge variant="light" color={status.color} size="sm">
            {status.label}
          </Badge>
        </Table.Td>
        <Table.Td>
          <Text size="sm" fw={500}>
            {r.score}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm">{r.problemPid}</Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm">{r.user}</Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm">{formatTime(r.timeMs)}</Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm">{formatMemory(r.memoryKb)}</Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm">{r.lang}</Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm" c="dimmed">
            {new Date(r.submitAt).toLocaleTimeString()}
          </Text>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Table striped highlightOnHover stickyHeader>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Status</Table.Th>
          <Table.Th>Score</Table.Th>
          <Table.Th>Problem</Table.Th>
          <Table.Th>User</Table.Th>
          <Table.Th>Time</Table.Th>
          <Table.Th>Memory</Table.Th>
          <Table.Th>Lang</Table.Th>
          <Table.Th>Submit</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
};

export default defineSlot("ui:record-table", RecordTable);
