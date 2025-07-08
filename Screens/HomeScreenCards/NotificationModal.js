import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import styles from './styles';

const NotificationModal = ({ visible, onClose, notifications }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}>
    <View style={styles.modalBackground}>
      <View style={styles.notificationModal}>
        <TouchableOpacity style={styles.closedButton} onPress={onClose}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
        <Text style={styles.notifyText}>Notifications</Text>
        <ScrollView contentContainerStyle={styles.notificationList}>
          {notifications.length > 0 ? (
            notifications.map((item, index) => (
              <View key={index} style={styles.notificationItem}>
                <Text style={styles.notificationText}>{item.message}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noNotifications}>No notifications</Text>
          )}
        </ScrollView>
      </View>
    </View>
  </Modal>
);

export default NotificationModal;
