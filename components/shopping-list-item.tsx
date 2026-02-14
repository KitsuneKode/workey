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
      <TouchableOpacity
        style={[styles.button, isCompleted && styles.completedButton]}
        activeOpacity={0.8}
        onPress={handleDelete}>
        <Text style={[styles.buttonText, isCompleted && styles.completedButtonText]}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  itemContainer: {
    borderBottomColor: theme.colorCerulean,
    borderBottomWidth: 1,
    paddingHorizontal: 8,
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
  button: {
    backgroundColor: theme.colorBlack,
    padding: 8,
    borderRadius: 6,
  },
  completedButton: {
    backgroundColor: theme.colorGrey,
  },
  completedButtonText: {
    backgroundColor: theme.colorGrey,
  },
  buttonText: {
    color: theme.colorWhite,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
