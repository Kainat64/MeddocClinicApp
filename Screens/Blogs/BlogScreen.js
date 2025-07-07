import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import decode from 'decode-html';
import { htmlToText } from 'html-to-text';
const BlogScreen = ({ route }) => {
  const { blog } = route.params;  // Retrieve the blog data

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Image source={{ uri: blog.image_url }} style={styles.image} />
        <Text style={styles.title}>{blog.title}</Text>
        <Text style={styles.content}>   {htmlToText(blog.content)}</Text>
    
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tags: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});

export default BlogScreen;
