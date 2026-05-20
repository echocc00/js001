import { createTheme, DEFAULT_THEME, mergeMantineTheme } from "@mantine/core";

/** Hydro UI theme - Indigo-purple tech feel, dark-first */
export const hydroTheme = createTheme({
  primaryColor: "indigo",
  defaultRadius: "md",
  cursorType: "pointer",

  fontFamily:
    "Inter, SF Pro Display, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif",
  fontFamilyMonospace:
    "JetBrains Mono, Fira Code, Cascadia Code, Consolas, monospace",
  headings: {
    fontFamily:
      "Inter, SF Pro Display, Segoe UI, PingFang SC, Hiragino Sans GB, sans-serif",
  },

  colors: {
    // Custom dark palette - blue-black tech feel
    dark: [
      "#C9C9D9", // 0 - lightest
      "#A0A0B8", // 1
      "#787898", // 2
      "#545478", // 3
      "#343458", // 4
      "#1E1E3A", // 5 - card hover
      "#14142B", // 6 - card surface
      "#0E0E22", // 7 - nav surface
      "#0B0B1A", // 8 - page bg
      "#080814", // 9 - darkest
    ],
  },

  // Indigo shade overrides for better contrast on dark bg
  primaryShade: { light: 5, dark: 4 },

  components: {
    Card: {
      defaultProps: {
        shadow: "sm",
        padding: "lg",
        radius: "md",
      },
    },
    Button: {
      defaultProps: {
        radius: "md",
      },
    },
    Input: {
      defaultProps: {
        radius: "md",
      },
    },
    Table: {
      defaultProps: {
        highlightOnHover: true,
        striped: "odd",
        stickyHeader: true,
      },
    },
    Badge: {
      defaultProps: {
        radius: "sm",
      },
    },
    Paper: {
      defaultProps: {
        radius: "md",
        shadow: "sm",
      },
    },
    Modal: {
      defaultProps: {
        radius: "lg",
        shadow: "xl",
        overlayProps: { blur: 4 },
      },
    },
    Menu: {
      defaultProps: {
        shadow: "md",
        radius: "md",
      },
    },
    NavLink: {
      defaultProps: {
        radius: "sm",
      },
    },
  },
});

/** Merged theme (combines defaults + custom) */
export const mergedHydroTheme = mergeMantineTheme(DEFAULT_THEME, hydroTheme);
