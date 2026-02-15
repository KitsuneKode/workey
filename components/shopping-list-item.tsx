import { StyleSheet, Text, TouchableOpacity, Pressable, View } from 'react-native';
import { theme } from '../theme';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';

type Props = {
  name: string;
  isCompleted?: boolean;
  onDelete: () => void;
  onToggleComplete: () => void;
};

export default function ShoppingListItem({
  name,
  isCompleted = false,
  onDelete,
  onToggleComplete,
}: Props) {
  return (
    <Pressable
      onPress={onToggleComplete}
      style={[styles.itemContainer, isCompleted && styles.completedContainer]}>
      <View style={styles.row}>
        <Entypo
          name={isCompleted ? 'check' : 'circle'}
          size={24}
          color={isCompleted ? theme.colorGrey : theme.colorCerulean}
        />
        <Text numberOfLines={1} style={[styles.itemText, isCompleted && styles.completedText]}>
          {name}
        </Text>
      </View>
      <TouchableOpacity activeOpacity={0.8} onPress={onDelete}>
        <AntDesign
          name="close-circle"
          size={24}
          color={isCompleted ? theme.colorGrey : theme.colorRed}
        />
      </TouchableOpacity>
    </Pressable>
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
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    textDecorationColor: theme.colorGrey,
    color: theme.colorGrey,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
});
