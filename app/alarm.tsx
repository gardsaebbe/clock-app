import { Stack } from 'expo-router';
import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Container } from '@/components/Container';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Alarm = {
  id: string;
  time: string;
  enabled: boolean;
};

export default function Alarm() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');

  const formatTime = (h: number, m: number) => {
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

  const handleConfirm = () => {
    if (hours && minutes) {
      const h = Number(hours);
      const m = Number(minutes);
      if (isNaN(h) || isNaN(m) || h > 23 || m > 59) return;

      const newAlarm: Alarm = {
        id: Date.now().toString(),
        time: formatTime(h, m),
        enabled: true,
      };

      const updated = [...alarms, newAlarm];
      setAlarms(updated);
      saveAlarms(updated);
      setShowInput(false);
      setHours('');
      setMinutes('');
    }
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

        <TouchableOpacity
          className="w-30 h-20 ml-15 bg-gray-500 mt-12 justify-center items-center rounded-2xl"
          onPress={() => setShowInput(true)}
        >
          <Text className="text-xl text-white">New alarm</Text>
        </TouchableOpacity>

        {showInput && (
          <View className="flex-row mt-6 items-center justify-center">
            <TextInput
              className="w-12 h-12 bg-white text-center text-xl rounded-md mr-2"
              keyboardType="number-pad"
              placeholder="H"
              maxLength={2}
              value={hours}
              onChangeText={setHours}
            />
            <Text className="text-2xl text-white">:</Text>
            <TextInput
              className="w-12 h-12 bg-white text-center text-xl rounded-md ml-2"
              keyboardType="number-pad"
              placeholder="M"
              maxLength={2}
              value={minutes}
              onChangeText={setMinutes}
            />
            <TouchableOpacity
              className="ml-4 bg-green-600 px-4 py-2 rounded-lg"
              onPress={handleConfirm}
            >
              <Text className="text-white text-lg">OK</Text>
            </TouchableOpacity>
          </View>
        )}

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
                    className= "ml-2 px-3 py-1 rounded-lg"
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
