import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../theme';
import AntDesign from '@expo/vector-icons/AntDesign';

type Props = {
  name: string;
  isCompleted?: boolean;
};

export default function ShoppingListItem({ name, isCompleted = false }: Props) {
  const handleDelete = () => {
    Alert.alert(`Are you sure you want to delete ${name}?`, 'It will be gone for good', [
      { text: 'Yes', onPress: () => console.log('Deleting'), style: 'destructive' },

      { text: 'Cancel', onPress: () => console.log('cancelling'), style: 'cancel' },
    ]);
  };
  return (
    <View style={[styles.itemContainer, isCompleted && styles.completedContainer]}>
      <Text style={[styles.itemText, isCompleted && styles.completedText]}>{name}</Text>
      <TouchableOpacity activeOpacity={0.8} onPress={handleDelete}>
        <AntDesign
          name="close-circle"
          size={24}
          color={isCompleted ? theme.colorGrey : theme.colorRed}
        />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  itemContainer: {
    borderBottomColor: theme.colorCerulean,
    borderBottomWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  completedContainer: {
    backgroundColor: theme.colorLightGrey,
    borderBottomColor: theme.colorLightGrey,
  },
  itemText: {
    fontFamily: 'Rubik',
    fontWeight: '200',
    fontSize: 18,
  },
  completedText: {
    textDecorationLine: 'line-through',
    textDecorationColor: theme.colorGrey,
    color: theme.colorGrey,
  },
});
