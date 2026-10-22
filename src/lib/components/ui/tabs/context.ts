import { createContext } from "svelte";

export type TabsVariant = "line" | "segment";

/** Tabs.List shares its variant with the triggers inside it. */
export const [getTabsVariant, setTabsVariant, hasTabsVariant] = createContext<() => TabsVariant>();
