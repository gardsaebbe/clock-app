import { Stack } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { Container } from '@/components/Container';

export default function CountDown() {
  return (
    <>
      <Stack.Screen options={{ title: 'clock' }} />
      <Container>
        <View className="mt-12 flex flex-row justify-center">
          <TouchableOpacity>
            <Text className="text-xl text-black">Not implemented yet</Text>
          </TouchableOpacity>
        </View>

        <View className="my-8 h-[1px] w-full bg-gray-300" />
      </Container>
    </>
  );
}
