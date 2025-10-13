import { Stack } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { Container } from '@/components/Container';

export default function Alarm() {
  return (
    <>
      <Stack.Screen options={{ title: 'clock' }} />
      <Container>
        <View className="mt-12 flex flex-row justify-between">
          <TouchableOpacity className="w-20 h-20 items-center rounded-full bg-gray-500 justify-center">
            <Text className="text-xl text-white">Not implemented yet</Text>
          </TouchableOpacity>
        </View>

        <View className="my-8 h-[1px] w-full bg-gray-300" />
      </Container>
    </>
  );
}
