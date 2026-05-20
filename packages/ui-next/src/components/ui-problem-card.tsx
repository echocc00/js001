import React from "react";
import { Card, Text, Badge, Group, Stack } from "@mantine/core";
import { defineSlot } from "../registry";

export interface ProblemCardProps {
  pid: string;
  title: string;
  difficulty?: number;
  tags?: string[];
  accepted?: number;
  submitted?: number;
  url?: string;
}

const ProblemCard: React.FC<ProblemCardProps> = ({
  pid,
  title,
  difficulty,
  tags = [],
  accepted = 0,
  submitted = 0,
  url,
}) => {
  const acceptRate = submitted > 0 ? ((accepted / submitted) * 100).toFixed(1) : "-";

  return (
    <Card component="a" href={url || `/p/${pid}`} withBorder>
      <Group justify="space-between" wrap="wrap">
        <Group gap="sm">
          <Text fw={700} size="sm" c="indigo.4">
            {pid}
          </Text>
          <Text size="sm" fw={500}>
            {title}
          </Text>
        </Group>
        <Group gap="xs">
          {difficulty != null && (
            <Badge
              variant="light"
              color={
                difficulty <= 3
                  ? "green"
                  : difficulty <= 6
                    ? "yellow"
                    : "red"
              }
              size="sm"
            >
              Lv.{difficulty}
            </Badge>
          )}
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" size="sm">
              {tag}
            </Badge>
          ))}
          <Text size="xs" c="dimmed">
            {acceptRate}% ({accepted}/{submitted})
          </Text>
        </Group>
      </Group>
    </Card>
  );
};

export default defineSlot("ui:problem-card", ProblemCard);
