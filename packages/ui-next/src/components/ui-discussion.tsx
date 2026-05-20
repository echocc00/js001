import React, { useState } from "react";
import { Card, Text, Group, Avatar, Textarea, Button, Stack, Divider } from "@mantine/core";
import { defineSlot } from "../registry";

export interface DiscussionReply {
  id: string;
  user: string;
  avatar?: string;
  content: string;
  createdAt: string;
  replies?: DiscussionReply[];
}

export interface DiscussionProps {
  title: string;
  author: string;
  avatar?: string;
  content: string;
  createdAt: string;
  replies?: DiscussionReply[];
  onReply?: (content: string) => void;
}

const ReplyItem: React.FC<{ reply: DiscussionReply; depth?: number }> = ({
  reply,
  depth = 0,
}) => (
  <Card withBorder={depth === 0} ml={depth > 0 ? 40 : 0} mb="sm">
    <Group gap="sm" mb="xs">
      <Avatar src={reply.avatar} size="sm" radius="xl" />
      <Text size="sm" fw={500}>
        {reply.user}
      </Text>
      <Text size="xs" c="dimmed">
        {new Date(reply.createdAt).toLocaleString()}
      </Text>
    </Group>
    <Text size="sm">{reply.content}</Text>
    {reply.replies?.map((r) => (
      <ReplyItem key={r.id} reply={r} depth={depth + 1} />
    ))}
  </Card>
);

const Discussion: React.FC<DiscussionProps> = ({
  title,
  author,
  avatar,
  content,
  createdAt,
  replies = [],
  onReply,
}) => {
  const [replyText, setReplyText] = useState("");

  return (
    <Stack>
      <Card withBorder>
        <Group gap="sm" mb="md">
          <Avatar src={avatar} radius="xl" />
          <div>
            <Text fw={700}>{title}</Text>
            <Group gap="xs">
              <Text size="sm">{author}</Text>
              <Text size="xs" c="dimmed">
                {new Date(createdAt).toLocaleString()}
              </Text>
            </Group>
          </div>
        </Group>
        <Text size="sm">{content}</Text>
      </Card>

      <Divider label={`${replies.length} replies`} />

      {replies.map((reply) => (
        <ReplyItem key={reply.id} reply={reply} />
      ))}

      {onReply && (
        <Card withBorder>
          <Textarea
            placeholder="Write your reply..."
            minRows={3}
            value={replyText}
            onChange={(e) => setReplyText(e.currentTarget.value)}
            mb="sm"
          />
          <Group justify="flex-end">
            <Button
              variant="filled"
              onClick={() => {
                onReply(replyText);
                setReplyText("");
              }}
              disabled={!replyText.trim()}
            >
              Reply
            </Button>
          </Group>
        </Card>
      )}
    </Stack>
  );
};

export default defineSlot("ui:discussion", Discussion);
