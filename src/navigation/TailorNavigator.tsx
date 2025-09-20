import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/tailor/DashboardScreen';
import UserManagementScreen from '../screens/tailor/UserManagementScreen';
import FabricManagementScreen from '../screens/tailor/FabricManagementScreen';
import OrderManagementScreen from '../screens/tailor/OrderManagementScreen';

export type TailorTabParamList = {
  Dashboard: undefined;
  Users: undefined;
  Fabrics: undefined;
  Orders: undefined;
};

const Tab = createBottomTabNavigator<TailorTabParamList>();

const TailorNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
      }}>
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Users" 
        component={UserManagementScreen}
        options={{ title: 'Users' }}
      />
      <Tab.Screen 
        name="Fabrics" 
        component={FabricManagementScreen}
        options={{ title: 'Fabrics' }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrderManagementScreen}
        options={{ title: 'Orders' }}
      />
    </Tab.Navigator>
  );
};

export default TailorNavigator;