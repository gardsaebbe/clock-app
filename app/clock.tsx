import { Stack } from "expo-router";
import { View, Text } from "react-native";
import { Container } from "@/components/Container";
import { useEffect, useRef, useState } from "react";

export default function Clock() {
  const [time, setTime] = useState<Date>(new Date());
  const intervalRef = useRef<number | null>(null);
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = (hours + minutes / 60) * 30;
  const minuteDeg = (minutes + seconds / 60) * 6;
  const secondDeg = seconds * 6;

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (time: Date) => {
    const h = String(time.getHours()).padStart(2, "0");
    const m = String(time.getMinutes()).padStart(2, "0");
    const s = String(time.getSeconds()).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <>
      <Stack.Screen options={{ title: "Clock" }} />
      <Container>
        <View className="flex-1 justify-center items-center">
          <View className="w-64 h-64 rounded-full bg-gray-800 border-4 border-gray-600 justify-center items-center relative">
            <View
              style={{
                position: "absolute",
                width: 6,
                height: 60,
                backgroundColor: "white",
                borderRadius: 3,
                transform: [
                  { rotateZ: `${hourDeg}deg` },
                  { translateY: -30 },
                ],
              }}
            />
            <View
              style={{
                position: "absolute",
                width: 4,
                height: 80,
                backgroundColor: "#a0aec0",
                borderRadius: 2,
                transform: [
                  { rotateZ: `${minuteDeg}deg` },
                  { translateY: -40 },
                ],
              }}
            />
            <View
              style={{
                position: "absolute",
                width: 2,
                height: 90,
                backgroundColor: "#f87171",
                borderRadius: 1,
                transform: [
                  { rotateZ: `${secondDeg}deg` },
                  { translateY: -45 },
                ],
              }}
            />
            <View className="w-4 h-4 rounded-full bg-white" />
          </View>
          <View className = "w-full mt-12">
          <Text className = "text-center font-mono text-7xl">{formatTime(time)}</Text>
          </View>
        </View>
      </Container>
    </>
  );
}
