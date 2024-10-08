import React from 'react';
import { FlatList, StyleSheet, View, Text, Dimensions } from 'react-native';
import { ProductItem } from './ProductItem';
import { Product, PRODUCTS } from '@/src/data/products';


const numColumns = 2;
const screenWidth = Dimensions.get('window').width; // Lấy chiều rộng của màn hình

const ProductScreen: React.FC = () => {
  const renderItem = ({ item }: { item: Product }) => <ProductItem product={item} />;

  

  return (
    <View style={styles.container}>
      <FlatList
        data={PRODUCTS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  itemContainer: {
    width: (screenWidth / numColumns) - 16, // Tính chiều rộng mỗi mục trừ đi khoảng cách giữa các cột
    flex: 1,
  },
});

export default ProductScreen;
