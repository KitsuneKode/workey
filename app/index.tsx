import ShoppingListItem from '../components/shopping-list-item';
import { StyleSheet, TextInput, ScrollView } from 'react-native';
import { theme } from '../theme';
import { useState } from 'react';
import * as Crypto from 'expo-crypto';

type ShoppingList = {
  id: string;
  name: string;
  // isCompleted: boolean;
};

const newId = () => Crypto.randomUUID();

const initialList: ShoppingList[] = [
  { id: newId(), name: 'Coffee' },
  { id: newId(), name: 'Tea' },
  { id: newId(), name: 'Green Tea' },
  { id: newId(), name: 'Coffee' },
  { id: newId(), name: 'Green Tea' },
  { id: newId(), name: 'Coffee' },
  { id: newId(), name: 'Green Tea' },
  { id: newId(), name: 'Coffee' },
  { id: newId(), name: 'Green Tea' },
  { id: newId(), name: 'Coffee' },
  { id: newId(), name: 'Green Tea' },
];

export default function App() {
  const [value, setValue] = useState('');
  const [shoppingList, setSetShoppingList] = useState<ShoppingList[]>(initialList);
  const handleSubmit = () => {
    const newShoppingList = [{ id: newId(), name: value }, ...shoppingList];
    setSetShoppingList(newShoppingList);
    setValue('');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      stickyHeaderIndices={[0]}>
      <TextInput
        placeholder="E.g. Coffee"
        value={value}
        onChangeText={setValue}
        style={styles.textInput}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />
      {shoppingList.map(({ name, id }) => (
        <ShoppingListItem name={name} key={id} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    padding: 12,
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
});
