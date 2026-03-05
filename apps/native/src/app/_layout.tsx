import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@beeto/api/native";
import { UserProvider } from "@beeto/auth/native";

// import { HeroUINativeProvider } from "@beeto/ui/native";

import "../styles.css";

import { HeroUINativeProvider } from "heroui-native";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      {/* <HeroUINativeProvider> */}
        <QueryClientProvider client={queryClient}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: "#c03484",
              },
              // contentStyle: {
              //   backgroundColor:
              //     colorScheme == "dark" ? "#09090B" : "#FFFFFF",
              // },
            }}
          />
        </QueryClientProvider>
      {/* </HeroUINativeProvider> */}
    </GestureHandlerRootView>
  );
}
// // This is the main layout of the app
// // It wraps your pages with the providers they need
// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <HeroUINativeProvider config={{toast: true}}>
//         <QueryClientProvider client={queryClient}>
//           <UserProvider>
//             <Stack
//               screenOptions={{
//                 headerStyle: {
//                   backgroundColor: "#c03484",
//                 },
//                 contentStyle: {
//                   backgroundColor:
//                     colorScheme == "dark" ? "#09090B" : "#FFFFFF",
//                 },
//               }}
//             />
//           </UserProvider>
//           <StatusBar />
//         </QueryClientProvider>
//       </HeroUINativeProvider>
//     </GestureHandlerRootView>
//   );
// }
