import '../global.css';
import { Stack } from 'expo-router';
import { Footer } from '@/components/footer';
import { View } from 'react-native';

export default function Layout() {
  return (
    <View className="flex-1">
      <Stack screenOptions={{ headerShown: false }} />
      <Footer />
    </View>
  );
}
