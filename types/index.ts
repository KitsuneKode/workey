import type { Duration } from 'date-fns';

export type ShoppingListItemType = {
  id: string;
  name: string;
  completedAtTimestamp?: number;
  lastUpdatedTimestamp: number;
};

export const shoppingListStorageKey = 'workey-shopping-list' as const;
type ShoppingListStorageKeyType = typeof shoppingListStorageKey;

export const countdownStorageKey = 'workey-countdown' as const;
type CountdownStorageKeyType = typeof countdownStorageKey;

export type StorageKeyType = ShoppingListStorageKeyType | CountdownStorageKeyType;

export type CountdownStatusType = {
  isOverdue: boolean;
  distance: Duration;
};

export type PersistCountdownStateType = {
  currentNotificationId: string | undefined;
  completedAtTimestamps: number[];
};
