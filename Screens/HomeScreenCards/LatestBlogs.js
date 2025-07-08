import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import styles from './styles';

const BlogItem = ({ item, navigation }) => (
  <View style={styles.eventCardContainer}>
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('Blog Details', { blog: item })}>
      <Image
        source={{ uri: item.image_url || 'https://via.placeholder.com/150' }}
        style={styles.eventImage}
      />
      <Text style={styles.eventTitle}>
        {item.title.length > 30 ? `${item.title.substring(0, 30)}...` : item.title}
      </Text>
    </TouchableOpacity>
  </View>
);

const LatestBlogs = ({ blog, navigation }) => (
  <View style={styles.eventsContainer}>
    <Text style={styles.heading}>Latest Blogs</Text>
    <FlatList
      data={blog}
      renderItem={({ item }) => <BlogItem item={item} navigation={navigation} />}
      keyExtractor={item => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.flatListContainer}
    />
  </View>
);

export default LatestBlogs;