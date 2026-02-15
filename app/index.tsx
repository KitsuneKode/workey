import ShoppingListItem from '../components/shopping-list-item';
import { StyleSheet, TextInput, FlatList, View, Text, LayoutAnimation } from 'react-native';
import { theme } from '../theme';
import { useEffect, useState } from 'react';
import { shoppingListStorageKey, type ShoppingListItemType } from '../types';
import { orderShoppingList, newId } from '../utils/helper';
import { getFromStorage, saveToStorage } from '../utils/storage';
import * as Haptics from 'expo-haptics';

export default function App() {
  const [value, setValue] = useState('');
  const [shoppingList, setSetShoppingList] = useState<ShoppingListItemType[]>([]);

  const handleSubmit = async () => {
    const newShoppingList = [
      { id: newId(), name: value, lastUpdatedTimestamp: Date.now() },
      ...shoppingList,
    ] satisfies ShoppingListItemType[];

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    await saveToStorage(shoppingListStorageKey, newShoppingList);
    setSetShoppingList(newShoppingList);
    setValue('');
  };

  const handleDelete = async (id: string) => {
    const newShoppingList = shoppingList.filter(
      (item) => id !== item.id,
    ) satisfies ShoppingListItemType[];

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await saveToStorage(shoppingListStorageKey, newShoppingList);
    setSetShoppingList(newShoppingList);
  };

  const handleToggleComplete = async (id: string) => {
    const newShoppingList = shoppingList.map((item) => {
      if (item.id !== id) {
        return item;
      }
      if (item.completedAtTimestamp) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      return {
        ...item,
        lastUpdatedTimestamp: Date.now(),
        completedAtTimestamp: item.completedAtTimestamp ? undefined : Date.now(),
      };
    }) satisfies ShoppingListItemType[];

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    await saveToStorage(shoppingListStorageKey, newShoppingList);
    setSetShoppingList(newShoppingList);
  };

  useEffect(() => {
    const fetchInitial = async () => {
      const data = await getFromStorage(shoppingListStorageKey);
      if (data) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSetShoppingList(data);
      }
    };
    fetchInitial();
  }, []);

  return (
    <FlatList
      data={orderShoppingList(shoppingList)}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      stickyHeaderIndices={[0]}
      ListEmptyComponent={
        <View style={styles.listEmptyContainer}>
          <Text style={styles.text}>Your shopping list is empty</Text>
        </View>
      }
      ListHeaderComponent={
        <TextInput
          placeholder="E.g. Coffee"
          value={value}
          onChangeText={setValue}
          style={styles.textInput}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
      }
      renderItem={({ item }) => (
        <ShoppingListItem
          name={item.name}
          onDelete={() => handleDelete(item.id)}
          onToggleComplete={() => handleToggleComplete(item.id)}
          isCompleted={Boolean(item.completedAtTimestamp)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  textInput: {
    borderColor: theme.colorLightGrey,
    borderWidth: 2,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 12,
    fontSize: 18,
    borderRadius: 50,
    backgroundColor: theme.colorWhite,
  },
  listEmptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 18,
  },
  text: {
    fontSize: 18,
  },
});
