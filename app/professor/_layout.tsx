
import React from 'react';
import { Stack } from 'expo-router';

export default function ProfessorLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="publish" />
      <Stack.Screen name="responses" />
      <Stack.Screen name="messages" />
      <Stack.Screen name="absences" />
      <Stack.Screen name="lists" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
