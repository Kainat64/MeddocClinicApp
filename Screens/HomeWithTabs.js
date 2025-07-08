// HomeWithTabs.jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import TabNavigator from './HomeScreenCards/TabNavigatSection';

const HomeWithTabs = () => {
  return (
    <View style={styles.container}>
      <TabNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeWithTabs;
