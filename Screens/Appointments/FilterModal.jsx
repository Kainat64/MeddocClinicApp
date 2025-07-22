import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { Color } from '../../GlobalStyles';
const FilterModal = ({
  visible,
  onClose,
  filterStatus,
  setFilterStatus,
  filterType,
  setFilterType,
  filterDate,
  setFilterDate,
  onClearFilters,
}) => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  return (
    <Modal visible={visible} transparent animationType="slide">
      {/* Backdrop that closes modal when touched */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackdrop} />
      </TouchableWithoutFeedback>
      
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Filters</Text>

        {/* Date Filter */}
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setDatePickerVisible(true)}
        >
          <Text style={{ color: filterDate ? Color.blue1 : '#aaa' }}>
            {filterDate
              ? moment(filterDate).format('MMM D, YYYY')
              : 'Select Date'}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={(date) => {
            setFilterDate(date);
            setDatePickerVisible(false);
          }}
          onCancel={() => setDatePickerVisible(false)}
        />

        {/* Status Filter */}
        <Text style={styles.heading}>Status</Text>
        <View style={styles.row}>
          {[{ label: 'All', value: null }, { label: 'Confirmed', value: 1 }, { label: 'Pending', value: 0 }].map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.chip,
                filterStatus === option.value && styles.chipActive,
              ]}
              onPress={() => setFilterStatus(option.value)}
            >
              <Text
                style={[
                  styles.chipText,
                  filterStatus === option.value && styles.chipTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Type Filter */}
        <Text style={styles.heading}>Type</Text>
        <View style={styles.row}>
          {[{ label: 'All', value: null }, { label: 'On-Site', value: 1 }, { label: 'Video', value: 2 }, { label: 'Voice', value: 3 }].map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.chip,
                filterType === option.value && styles.chipActive,
              ]}
              onPress={() => setFilterType(option.value)}
            >
              <Text
                style={[
                  styles.chipText,
                  filterType === option.value && styles.chipTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.clearButton} onPress={onClearFilters}>
            <Text style={styles.clearText}>Clear All Filters</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.applyButton} onPress={onClose}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // New backdrop style
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Color.blue1,
  },
  dateInput: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Color.blue1,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Color.blue1,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
  },
  chipActive: {
    backgroundColor: Color.blue1,
    borderColor: Color.blue1,
  },
  chipText: {
    color: Color.blue1,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  footer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Color.blue1,
  },
  clearText: {
    color: Color.blue1,
    fontSize: 14,
    fontWeight: '500',
    
  },
  applyButton: {
    backgroundColor: Color.blue1,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default FilterModal;