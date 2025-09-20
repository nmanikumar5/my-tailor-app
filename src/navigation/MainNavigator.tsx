import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TailorNavigator from './TailorNavigator';
import CustomerNavigator from './CustomerNavigator';

export type MainTabParamList = {
  TailorFlow: undefined;
  CustomerFlow: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  // TODO: Get user role from auth context
  const userRole = 'customer'; // 'customer' | 'tailor'

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {userRole === 'tailor' ? (
        <Tab.Screen 
          name="TailorFlow" 
          component={TailorNavigator}
          options={{ title: 'Tailor Dashboard' }}
        />
      ) : (
        <Tab.Screen 
          name="CustomerFlow" 
          component={CustomerNavigator}
          options={{ title: 'Customer' }}
        />
      )}
    </Tab.Navigator>
  );
};

export default MainNavigator;