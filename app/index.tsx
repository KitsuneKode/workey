import ShoppingListItem from '../components/shopping-list-item';
import { StyleSheet, TextInput, FlatList, View, Text, LayoutAnimation } from 'react-native';
import { theme } from '../theme';
import { useEffect, useState } from 'react';
import * as Crypto from 'expo-crypto';
import { storageKey, type ShoppingListItemType } from '../types';
import { orderShoppingList } from '../utils/helper';
import { getFromStorage, saveToStorage } from '../utils/storage';
import * as Haptics from 'expo-haptics';

const newId = () => Crypto.randomUUID();

// const testData = new Array(1000).fill(null).map((item, idx) => ({ id: idx, name: newId() }));
// const initialList: ShoppingListItemType[] = [
//   { id: newId(), name: 'Coffee' },
//   { id: newId(), name: 'Tea' },
//   { id: newId(), name: 'Green Tea' },
//   { id: newId(), name: 'Coffee' },
//   { id: newId(), name: 'Green Tea' },
//   { id: newId(), name: 'Coffee' },
//   { id: newId(), name: 'Green Tea' },
//   { id: newId(), name: 'Coffee' },
//   { id: newId(), name: 'Green Tea' },
//   { id: newId(), name: 'Coffee' },
//   { id: newId(), name: 'Green Tea' },
// ];
//
export default function App() {
  const [value, setValue] = useState('');
  const [shoppingList, setSetShoppingList] = useState<ShoppingListItemType[]>([]);

  const handleSubmit = () => {
    const newShoppingList = [
      { id: newId(), name: value, lastUpdatedTimestamp: Date.now() },
      ...shoppingList,
    ] satisfies ShoppingListItemType[];

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    saveToStorage(storageKey, newShoppingList);
    setSetShoppingList(newShoppingList);
    setValue('');
  };

  const handleDelete = (id: string) => {
    // Alert.alert(`Are you sure you want to delete ${name}?`, 'It will be gone for good', [
    //   { text: 'Yes', onPress: () => console.log('Deleting'), style: 'destructive' },
    //
    //   { text: 'Cancel', onPress: () => console.log('cancelling'), style: 'cancel' },
    // ]);
    const newShoppingList = shoppingList.filter(
      (item) => id !== item.id,
    ) satisfies ShoppingListItemType[];

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    saveToStorage(storageKey, newShoppingList);
    setSetShoppingList(newShoppingList);
  };

  const handleToggleComplete = (id: string) => {
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
    saveToStorage(storageKey, newShoppingList);
    setSetShoppingList(newShoppingList);
  };

  useEffect(() => {
    const fetchInitial = async () => {
      const data = await getFromStorage(storageKey);
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
          <Text>Your shopping list is empty</Text>
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
});
