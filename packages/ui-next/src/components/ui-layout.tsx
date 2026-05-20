import React from "react";
import { AppShell, Group, Burger, Title, Container } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { defineSlot } from "../registry";

/** Main AppShell layout with collapsible navbar */
const AppLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{
        width: 240,
        breakpoint: "sm",
        collapsed: { mobile: !opened, desktop: true },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={3}>Hydro</Title>
          </Group>
          <Group>
            {/* User menu slot */}
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {/* Navigation links slot */}
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size="xl">{children}</Container>
      </AppShell.Main>

      <AppShell.Footer>
        {/* Footer slot */}
      </AppShell.Footer>
    </AppShell>
  );
};

export default defineSlot("ui:layout", AppLayout);
