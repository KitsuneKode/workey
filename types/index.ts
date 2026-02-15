export type ShoppingListItemType = {
  id: string;
  name: string;
  completedAtTimestamp?: number;
  lastUpdatedTimestamp: number;
};

export const storageKey = 'shopping-list' as const;
export type StorageKeyType = typeof storageKey;
