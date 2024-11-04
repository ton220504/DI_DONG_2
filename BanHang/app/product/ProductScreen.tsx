

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, FlatList, Text } from 'react-native';
import { ProductItem } from './ProductItem';
import { Product } from '@/src/data/products'; // Đảm bảo import đúng kiểu Product
import { ip } from '../Api';

const numColumns = 2;
const screenWidth = Dimensions.get('window').width; // Lấy chiều rộng của màn hình

const ProductScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]); // State để lưu danh sách sản phẩm
  const [loading, setLoading] = useState<boolean>(true); // State để hiển thị khi đang tải dữ liệu
  
  // Gọi API lấy danh sách sản phẩm khi component được mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // const response = await fetch('http://192.168.2.30:8000/api/getAll'); // Gọi API
        const response = await fetch(`${ip}/getAll`); // Gọi API
        const data = await response.json(); // Chuyển phản hồi thành JSON
        setProducts(data); // Cập nhật state với dữ liệu sản phẩm
        setLoading(false); // Tắt chế độ loading
      } catch (error) {
        console.error('Có lỗi khi gọi API:', error);
        setLoading(false); // Tắt chế độ loading dù có lỗi
      }
    };

    fetchProducts();
  }, []);

  const renderItem = ({ item }: { item: Product }) => (
    <ProductItem product={item} /> // Truyền đúng product với kiểu Product
    
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products} // Dữ liệu từ API
        renderItem={renderItem}
        keyExtractor={(item) => item.id} // Key là id của sản phẩm
        numColumns={numColumns} // Hiển thị 2 cột
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductScreen;
