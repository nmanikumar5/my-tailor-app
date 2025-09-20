import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/customer/HomeScreen';
import MeasurementsScreen from '../screens/customer/MeasurementsScreen';
import FabricCollectionScreen from '../screens/customer/FabricCollectionScreen';
import OrdersScreen from '../screens/customer/OrdersScreen';

export type CustomerTabParamList = {
  Home: undefined;
  Measurements: undefined;
  Fabrics: undefined;
  Orders: undefined;
};

const Tab = createBottomTabNavigator<CustomerTabParamList>();

const CustomerNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
      }}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Measurements" 
        component={MeasurementsScreen}
        options={{ title: 'Measurements' }}
      />
      <Tab.Screen 
        name="Fabrics" 
        component={FabricCollectionScreen}
        options={{ title: 'Fabrics' }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{ title: 'My Orders' }}
      />
    </Tab.Navigator>
  );
};

export default CustomerNavigator;