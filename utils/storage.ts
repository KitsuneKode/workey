import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeyType } from '../types';

export async function getFromStorage(key: string) {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}
export async function saveToStorage(key: StorageKeyType, data: object) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch {}
}
