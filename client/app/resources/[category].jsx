import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import WebLayout from '../../components/WebLayout';
import { resourceCategories } from '../../constant/ResourceCategories';

export default function ResourceCategoryScreen() {
  const { category: categoryId } = useLocalSearchParams();
  const category = resourceCategories.find((item) => item.id === categoryId);

  return (
    <WebLayout>
      <View style={{ padding: 32 }}>
        <Text style={{ fontSize: 32, fontWeight: '800' }}>
          {category ? category.title : 'Category not found'}
        </Text>
        <Text>{category ? category.description : ''}</Text>
      </View>
    </WebLayout>
  );
}