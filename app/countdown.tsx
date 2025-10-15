import { Stack } from 'expo-router';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Container } from '@/components/Container';
import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CountDown() {
  const [showInput, setShowInput] = useState(false);
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  const [time, setTime] = useState(0); // ms
  const [counting, setCounting] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const endTimeRef = useRef<number>(0);

  const formatTime = (time: number) => {
    const ms = Math.floor((time % 1000) / 10);
    const sec = Math.floor((time / 1000) % 60);
    const min = Math.floor((time / 60000) % 60);
    const hr = Math.floor(time / 3600000);
    return `${String(hr).padStart(2,'0')}:${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}:${String(ms).padStart(2,'0')}`;
  };

  // Load countdown from AsyncStorage when component mounts
  useEffect(() => {
    const loadCountdown = async () => {
      try {
        const storedEndTime = await AsyncStorage.getItem('countdownEndTime');
        if (storedEndTime) {
          const endTime = Number(storedEndTime);
          const remaining = Math.max(0, endTime - Date.now());
          if (remaining > 0) {
            setTime(remaining);
            endTimeRef.current = endTime;
            setCounting(true);
          }
        }
      } catch (error) {
        console.error('Failed to load countdown:', error);
      }
    };
    loadCountdown();
  }, []);

  // Countdown interval
  useEffect(() => {
    if (counting) {
      intervalRef.current = setInterval(() => {
        const remaining = Math.max(0, endTimeRef.current - Date.now());
        setTime(remaining);
        if (remaining === 0 && intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          setCounting(false);
          AsyncStorage.removeItem('countdownEndTime'); // fjern lagring når ferdig
        }
      }, 50);
    } else {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [counting]);

  const toggleCounting = () => setCounting (!counting);

  const handleReset = () => {
    setTime(0);
    setCounting(false);
  }

  const handleConfirm = async () => {
    const h = Number(hours) || 0;
    const m = Number(minutes) || 0;
    const s = Number(seconds) || 0;

    if (h < 0 || h > 23 || m < 0 || m > 59 || s < 0 || s > 59) return;

    const countdownMs = ((h * 60 * 60) + (m * 60) + s) * 1000;
    setTime(countdownMs);
    endTimeRef.current = Date.now() + countdownMs;
    setCounting(true);

    try {
      await AsyncStorage.setItem('countdownEndTime', endTimeRef.current.toString());
    } catch (error) {
      console.error('Failed to save countdown:', error);
    }

    setHours('');
    setMinutes('');
    setSeconds('');
    setShowInput(false);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Countdown' }} />
      <Container>
        <View className="flex-1 justify-center items-center">
        <Text className="text-center font-mono text-6xl mt-10">{formatTime(time)}</Text>

        <View className="mt-12 flex flex-row justify-between">
          <TouchableOpacity onPress={handleReset} className='w-20 h-20 items-center rounded-full bg-gray-500 justify-center'>
            <Text className='text-xl text-white'>Reset</Text>
          </TouchableOpacity>
          {counting ? (
          <TouchableOpacity 
            onPress={toggleCounting} 
            className='w-20 h-20 items-center rounded-full bg-red-800 justify-center'
          >
            <Text className='text-xl text-white'>Pause</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={toggleCounting} 
            disabled={time === 0}
            className={`w-20 h-20 items-center rounded-full justify-center ${
              time === 0 ? 'bg-gray-400' : 'bg-green-800'
            }`}
          >
            <Text className='text-xl text-white'>Start</Text>
          </TouchableOpacity>
        )}

        </View>

        <TouchableOpacity
          className="w-60 h-20 ml-15 bg-gray-500 mt-12 justify-center items-center rounded-2xl"
          onPress={() => setShowInput(true)}
        >
          <Text className="text-xl text-white">New Countdown</Text>
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
              className="w-12 h-12 bg-white text-center text-xl rounded-md mx-2"
              keyboardType="number-pad"
              placeholder="M"
              maxLength={2}
              value={minutes}
              onChangeText={setMinutes}
            />
            <Text className="text-2xl text-white">:</Text>
            <TextInput
              className="w-12 h-12 bg-white text-center text-xl rounded-md ml-2"
              keyboardType="number-pad"
              placeholder="S"
              maxLength={2}
              value={seconds}
              onChangeText={setSeconds}
            />
            <TouchableOpacity
              className="ml-4 bg-green-600 px-4 py-2 rounded-lg"
              onPress={handleConfirm}
            >
              <Text className="text-white text-lg">START</Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="my-8 h-[1px] w-full bg-gray-300" />
        </View>
      </Container>
    </>
  );
}
