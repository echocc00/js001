import React from "react";
import { Table, Badge, Text, Group, Avatar } from "@mantine/core";
import { defineSlot } from "../registry";

export interface ScoreboardRow {
  rank: number;
  user: string;
  avatar?: string;
  score: number;
  penalty: number;
  problems: { pid: string; score: number; attempts: number; timeMin?: number }[];
}

export interface ScoreboardProps {
  rows: ScoreboardRow[];
  problemCount: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ rows, problemCount }) => {
  const getMedalColor = (rank: number) => {
    if (rank === 1) return "#FFD700";
    if (rank === 2) return "#C0C0C0";
    if (rank === 3) return "#CD7F32";
    return undefined;
  };

  const getCellColor = (score: number) => {
    if (score === 100) return "green";
    if (score > 0) return "yellow";
    return undefined;
  };

  return (
    <Table striped highlightOnHover stickyHeader>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w={60}>#</Table.Th>
          <Table.Th>User</Table.Th>
          <Table.Th w={80}>Score</Table.Th>
          <Table.Th w={80}>Penalty</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rows.map((row) => (
          <Table.Tr key={row.rank}>
            <Table.Td>
              <Badge
                variant="light"
                color={getMedalColor(row.rank)}
                size="sm"
              >
                {row.rank}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Group gap="sm">
                <Avatar src={row.avatar} size="sm" radius="xl" />
                <Text size="sm" fw={500}>
                  {row.user}
                </Text>
              </Group>
            </Table.Td>
            <Table.Td>
              <Text size="sm" fw={700}>
                {row.score}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm" c="dimmed">
                {row.penalty}
              </Text>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};

export default defineSlot("ui:scoreboard", Scoreboard);
