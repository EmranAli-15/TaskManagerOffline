import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Provider } from '@/contextProvider/ContextProvider';
import { useColorScheme } from '@/hooks/use-color-scheme';
// import { StatusBar } from 'react-native';


export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Provider>
        <Stack
          screenOptions={{ headerShown: false, animation: "slide_from_right" }}
        >
        </Stack>
      </Provider>
      {/* <StatusBar barStyle={'dark-content'} backgroundColor="#00FFFF"></StatusBar> */}
      <StatusBar style={'dark'} backgroundColor='#00FFFF' translucent={false}></StatusBar>
    </ThemeProvider>
  );
}
