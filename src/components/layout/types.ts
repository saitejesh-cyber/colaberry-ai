/**
 * Shared types for the Layout component and its sub-modules.
 */

export type WorkspaceLink = {
  label: string;
  href: string;
  target?: string | null;
};

export type WorkspaceSection = {
  title: string;
  links: WorkspaceLink[];
};
