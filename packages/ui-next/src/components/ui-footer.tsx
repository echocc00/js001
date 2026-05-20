import React from "react";
import {
  Container,
  Group,
  Text,
  Anchor,
  Divider,
} from "@mantine/core";
import { defineSlot } from "../registry";

const AppFooter: React.FC = () => (
  <Container size="xl" py="md">
    <Divider mb="sm" />
    <Group justify="space-between" wrap="wrap">
      <Group gap="lg">
        <Anchor href="/status" size="sm" c="dimmed">
          Service Status
        </Anchor>
        <Anchor href="/wiki/help" size="sm" c="dimmed">
          Help
        </Anchor>
        <Anchor href="/wiki/about" size="sm" c="dimmed">
          About
        </Anchor>
      </Group>
      <Text size="xs" c="dimmed">
        Powered by Hydro
      </Text>
    </Group>
  </Container>
);

export default defineSlot("ui:footer", AppFooter);
