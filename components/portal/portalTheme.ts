/** Portal theme — mirrors CSS vars from `app/globals.css` (no divergent hex). */

export const portalColors = {
  primary: "var(--primary)",
  primaryLight: "var(--primary-soft)",
  primaryDark: "var(--navy-mid)",
  secondary: "var(--accent)",
  background: "var(--portal-bg)",
  surface: "var(--portal-card)",
  border: "var(--portal-border)",
  textPrimary: "var(--portal-fg)",
  textSecondary: "var(--portal-muted)",
  success: "var(--success)",
  warning: "var(--warning)",
  error: "var(--error)",
  info: "var(--info)",
} as const;

export const portalGradients = {
  primary: "linear-gradient(135deg, var(--navy-mid) 0%, var(--primary) 100%)",
  hero: "linear-gradient(135deg, var(--navy) 0%, var(--primary) 55%, var(--navy-mid) 100%)",
  secondary: "linear-gradient(135deg, var(--accent-hover) 0%, var(--accent) 100%)",
} as const;
