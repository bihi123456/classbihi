
import React from 'react';
import { Stack } from 'expo-router';

export default function StudentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="messages" />
      <Stack.Screen name="exams" />
      <Stack.Screen name="attendance" />
      <Stack.Screen name="absences" />
    </Stack>
  );
}
