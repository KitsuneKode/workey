import ShoppingListItem from '../components/shopping-list-item';
import { StyleSheet, View } from 'react-native';
import { theme } from '../theme';
import { Link } from 'expo-router';

export default function App() {
  return (
    <View style={styles.container}>
      <Link href="/counter" style={{ textAlign: 'center', marginBottom: 18 }}>
        Go to Counter
      </Link>
      <ShoppingListItem name="Coffee" />
      <ShoppingListItem name="Tea" isCompleted />
      <ShoppingListItem name="Green Tea" isCompleted />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    justifyContent: 'center',
  },
});
