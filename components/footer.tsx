import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

export function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (path: string) => {
    if (pathname !== path) {
      router.push(path as any);
    }
  };

  return (
    <View className="flex-row justify-between bg-gray-900 py-10 px-7">
      <TouchableOpacity onPress={() => handleNavigate('/clock')}>
        <Text className="text-white">Clock</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleNavigate('/alarm')}>
        <Text className="text-white">Alarms</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleNavigate('/')}>
        <Text className="text-white">Stopwatch</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleNavigate('/countdown')}>
        <Text className="text-white">Countdowns</Text>
      </TouchableOpacity>
    </View>
  );
}
