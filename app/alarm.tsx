import { Stack } from 'expo-router';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Container } from '@/components/Container';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

type Alarm = {
  id: string;
  time: string;
  enabled: boolean;
};

export default function Alarm() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [tempTime, setTempTime] = useState(new Date());

  const formatTime = (date: Date) => {
    const h = date.getHours();
    const m = date.getMinutes();
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  useEffect(() => {
    const loadAlarms = async () => {
      try {
        const stored = await AsyncStorage.getItem('alarms');
        if (stored) setAlarms(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load alarms:', error);
      }
    };
    loadAlarms();
  }, []);

  const saveAlarms = async (newAlarms: Alarm[]) => {
    try {
      await AsyncStorage.setItem('alarms', JSON.stringify(newAlarms));
    } catch (error) {
      console.error('Failed to save alarms:', error);
    }
  };

  const handleTimeChange = (event: any, date?: Date) => {
    if (date) {
      setTempTime(date);
    }
  };

  const handleSaveAlarm = () => {
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time: formatTime(tempTime),
      enabled: true,
    };

    // Sorts the saved alarms
    const updated = [...alarms, newAlarm].sort((a, b) => {
      return a.time.localeCompare(b.time);
    });
    setAlarms(updated);
    saveAlarms(updated);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setShowPicker(false);
    setTempTime(new Date());
  };

  const toggleAlarm = (id: string) => {
    const updated = alarms.map(a =>
      a.id === id ? { ...a, enabled: !a.enabled } : a
    );
    setAlarms(updated);
    saveAlarms(updated);
  };

  const deleteAlarm = (id: string) => {
    const updated = alarms.filter(a => a.id !== id);
    setAlarms(updated);
    saveAlarms(updated);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Alarm' }} />
      <Container>

        // Button to create new alarm
        <TouchableOpacity
          className="w-30 h-20 ml-15 bg-gray-500 mt-12 justify-center items-center rounded-2xl"
          onPress={() => setShowPicker(true)}
        >
          <Text className="text-xl text-white">New alarm</Text>
        </TouchableOpacity>

        // Time picker for alarm
        {showPicker && (
          <View className="mt-6 items-center">
            <DateTimePicker
              value={tempTime}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={handleTimeChange}
            />
            <View className="flex-row mt-4 space-x-4">
              <TouchableOpacity
                className="bg-red-600 ml-2 px-3 py-1 rounded-lg"
                onPress={handleCancel}
              >
                <Text className="text-white text-lg font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-green-600 ml-2 px-3 py-1 rounded-lg"
                onPress={handleSaveAlarm}
              >
                <Text className="text-white text-lg font-bold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        // Shows saved alarms if there is any
        <View className="my-8 h-[1px] w-full bg-gray-500" />
        {alarms.length > 0 ? (
          <>
            <Text className="text-xl text-center mb-4">Saved alarms</Text>
            <FlatList
              data={alarms}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View className="flex-row justify-between items-center bg-gray-700 px-4 py-3 rounded-xl mb-3 mx-4">
                  <Text className="text-3xl text-white font-mono">{item.time}</Text>
                  <View className="flex-row items-center space-x-3">
                    <TouchableOpacity
                      className="ml-2 px-3 py-1 rounded-lg"
                      activeOpacity={1}
                      onPress={() => toggleAlarm(item.id)}
                      style={{
                        backgroundColor: item.enabled ? 'green' : 'red',
                      }}
                    >
                      <Text className="text-white font-bold">
                        {item.enabled ? 'On' : 'Off'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => deleteAlarm(item.id)}
                      className="ml-2 px-3 py-1 rounded-lg"
                      style={{backgroundColor: 'red'}}
                      activeOpacity={0.8}
                    >
                      <Text className="text-white font-bold">Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </>
        ) : (
          <Text className="text-center mt-4">No alarms saved</Text>
        )}
      </Container>
    </>
  );
}