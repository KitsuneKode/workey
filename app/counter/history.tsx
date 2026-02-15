import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { countdownStorageKey, PersistCountdownStateType } from '../../types';
import { getFromStorage } from '../../utils/storage';
import { format } from 'date-fns';
import { fullDateFormat } from '../../utils/helper';
import { theme } from '../../theme';

export default function HistoryScreen() {
  const [countdownState, setCountdownState] = useState<PersistCountdownStateType>();

  useEffect(() => {
    const init = async () => {
      const value = await getFromStorage(countdownStorageKey);
      setCountdownState(value);
    };
    init();
  });

  return (
    <FlatList
      ListEmptyComponent={
        <View style={styles.listEmptyContainer}>
          <Text style={styles.listItemText}>No history</Text>
        </View>
      }
      style={styles.list}
      contentContainerStyle={styles.contentContainer}
      data={countdownState?.completedAtTimestamps}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>{format(item, fullDateFormat)}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: theme.colorWhite,
  },
  contentContainer: {
    marginTop: 8,
  },
  listItem: {
    marginHorizontal: 8,
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: theme.colorLightGrey,
  },
  listItemText: {
    fontSize: 18,
  },
  listEmptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 18,
  },
});
