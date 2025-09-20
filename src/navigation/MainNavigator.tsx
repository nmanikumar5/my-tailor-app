import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import TailorNavigator from './TailorNavigator';
import CustomerNavigator from './CustomerNavigator';

export type MainTabParamList = {
  TailorFlow: undefined;
  CustomerFlow: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  const { user } = useAuth();
  const userRole = user?.role || 'customer';

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