import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const HeaderTitle = ({ tx }: { tx: string }) => {
    return (
      <Text style={{ fontWeight: '700', fontSize: 17, color: Colors[colorScheme ?? 'light'].text }}>
        {t(tx)}
      </Text>
    );
  };

  const TabBarLabel = ({ tx, color }: { tx: string; color: string }) => {
    return (
      <Text style={{ color, fontSize: 12 }}>
        {t(tx)}
      </Text>
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.matrix'),
          tabBarIcon: ({ color }) => <TabBarIcon name="th" color={color} />,
          headerTitle: () => <HeaderTitle tx="tabs.matrix" />,
          headerRight: () => <LanguageSwitcher />,
          tabBarLabel: ({ color }) => <TabBarLabel tx="tabs.matrix" color={color} />,
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
          },
          headerTitleStyle: {
            fontWeight: '700',
          },
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: t('tabs.tasks'),
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
          headerTitle: () => <HeaderTitle tx="taskList.title" />,
          headerRight: () => <LanguageSwitcher />,
          tabBarLabel: ({ color }) => <TabBarLabel tx="tabs.tasks" color={color} />,
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
          },
          headerTitleStyle: {
            fontWeight: '700',
          },
        }}
      />
    </Tabs>
  );
}
