import { Stack} from 'expo-router';

import { Container } from '@/components/Container';
import {Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const[time, setTime] = useState(0);
  const[counting, setCounting] = useState(false); 

  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const savedTimeRef = useRef<number>(0);


  useEffect(() => {
    if (counting){
      startTimeRef.current = Date.now() - savedTimeRef.current;

      intervalRef.current = setInterval(() => {
      
        if (startTimeRef.current){
          const elapsed = Date.now() - startTimeRef.current;
          setTime(elapsed);
        }
      }, 50)
    } else{
      savedTimeRef.current = time;
      if (intervalRef.current){
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current){
        clearInterval(intervalRef.current);
      }
    }

  }, [counting])

  const toggleCounting = () => setCounting (!counting);

  const handleReset = () => {
    setTime(0);
    setCounting(false);
    savedTimeRef.current = 0;
  }

  const formatTime= () => {
    const ms = ((Math.floor(time / 1000))/10);
    const sec = ((Math.floor(time / 1000))%60);
    const min = ((Math.floor(time / 60000))%60);
    return `${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}:${String(ms).padStart(2,'0')}`
  }
  return (
    <>
      <Stack.Screen options={{ title: 'StopWatch' }} />
      <Container>
        <View className = "w-full mt-12">
          <Text className = "text-center font-mono text-7xl">{formatTime()}</Text>
          </View>

          <View className='flex flex-row justify-between'>
          <TouchableOpacity onPress={handleReset} className='w-20 h-20 item-center rounded-full bg-gray-500 justify-center'>
            <Text className='text-xl text-white'>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleCounting} className='w-20 h-20 item-center rounded-full bg-green-800 justify-center'>
            <Text className='text-xl text-white'>Start</Text>
          </TouchableOpacity>
          </View>

          <View className='my-8 h-[1px] w-full bg-gray-300'> </View>
      </Container>
    </>
  );
}

const styles = {
  container: 'flex flex-1 bg-white',
};
