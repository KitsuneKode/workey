import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { theme } from '../../theme';
import { registerForPushNotificationsAsync } from '../../utils/register-for-push-notifications';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { CountdownStatusType, countdownStorageKey, PersistCountdownStateType } from '../../types';
import { intervalToDuration, isBefore } from 'date-fns';
import { TimeSegment } from '../../components/time-segment';
import { getFromStorage, saveToStorage } from '../../utils/storage';
import { frequency } from '../../utils/helper';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function CounterScreen() {
  const { width } = useWindowDimensions();
  const [isLoading, setLoading] = useState(true);
  const [countdownState, setCountdownState] = useState<PersistCountdownStateType>();
  const [status, setStatus] = useState<CountdownStatusType>({
    isOverdue: false,
    distance: {},
  });
  const confettiRef = useRef<any>(null);

  const lastCompletedTimestamp = countdownState?.completedAtTimestamps[0];

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timestamp = lastCompletedTimestamp ? lastCompletedTimestamp + frequency : Date.now();
      const isOverdue = isBefore(timestamp, Date.now());
      if (lastCompletedTimestamp) {
        setLoading(false);
      }
      const distance = intervalToDuration(
        isOverdue
          ? { start: timestamp, end: Date.now() }
          : {
              start: Date.now(),
              end: timestamp,
            },
      );
      setStatus({ isOverdue, distance });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [lastCompletedTimestamp]);

  useEffect(() => {
    const init = async () => {
      const value = await getFromStorage(countdownStorageKey);
      setCountdownState(value);
      if (!value) {
        setLoading(false);
      }
    };
    init();
  }, []);

  const scheduleNotification = async () => {
    confettiRef?.current?.start();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    let pushNotificationId;
    const result = await registerForPushNotificationsAsync();
    if (result === 'granted') {
      pushNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Notification from your app 🤪',
        },
        trigger: {
          seconds: 5,
          repeats: false,
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        },
      });
    } else {
      Device.isDevice &&
        Alert.alert(
          'Unable to schedule Notification',
          'Enable the notification permission for Expo Go in settings',
        );
    }
    if (countdownState?.currentNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(countdownState.currentNotificationId);
    }
    const newCountdownState = {
      currentNotificationId: pushNotificationId,
      completedAtTimestamps: countdownState
        ? [Date.now(), ...countdownState.completedAtTimestamps]
        : [Date.now()],
    } satisfies PersistCountdownStateType;

    setCountdownState(newCountdownState);
    await saveToStorage(countdownStorageKey, newCountdownState);
  };

  return isLoading ? (
    <View style={styles.activityIndicatorContainer}>
      <ActivityIndicator />
    </View>
  ) : (
    <View style={[styles.container, status.isOverdue ? styles.containerLate : styles.container]}>
      {status.isOverdue ? (
        <Text style={[styles.heading, status.isOverdue && styles.whiteText]}>Thing overdue by</Text>
      ) : (
        <Text style={styles.heading}>Thing due in ...</Text>
      )}
      <View style={styles.row}>
        <TimeSegment
          unit="Days"
          number={status.distance.days ?? 0}
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
        <TimeSegment
          unit="Hours"
          number={status.distance.hours ?? 0}
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
        <TimeSegment
          unit="Minutes"
          number={status.distance.minutes ?? 0}
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
        <TimeSegment
          unit="Seconds"
          number={status.distance.seconds ?? 0}
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={scheduleNotification}>
        <Text style={styles.buttonText}>I&apos;ve completed it</Text>
      </TouchableOpacity>
      <ConfettiCannon
        ref={confettiRef}
        count={50}
        autoStart={false}
        origin={{ x: width / 2, y: -20 }}
        fadeOut
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colorWhite,
  },
  containerLate: {
    backgroundColor: theme.colorRed,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: theme.colorWhite,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  whiteText: {
    color: theme.colorWhite,
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colorWhite,
  },
});
