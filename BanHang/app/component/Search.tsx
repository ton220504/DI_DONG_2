import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { router, useFocusEffect } from 'expo-router';
import { ip } from '../Api';

// Địa chỉ API lấy tất cả sản phẩm
const API_URL = `${ip}/getAll`;

type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
};

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false); // Trạng thái tìm kiếm
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');

  // Gọi API để lấy danh sách sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL);
        setProducts(response.data); // Lưu tất cả sản phẩm
        setFilteredProducts(response.data); // Hiển thị tất cả sản phẩm khi chưa tìm kiếm
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Xử lý sự kiện khi nhấn nút tìm kiếm
  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      if (!searchHistory.includes(searchQuery)) {
        setSearchHistory([searchQuery, ...searchHistory]);
      }

      // Lọc sản phẩm dựa trên từ khóa tìm kiếm
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered); // Cập nhật danh sách sản phẩm tìm kiếm
      setIsSearching(true); // Đặt trạng thái tìm kiếm là true khi tìm kiếm
      setCurrentSearchTerm(searchQuery); // Lưu từ khóa tìm kiếm hiện tại
    } else {
      // Nếu không có từ khóa, quay lại hiển thị sản phẩm gợi ý
      setFilteredProducts(products);
      setIsSearching(false); // Đặt trạng thái tìm kiếm là false
      setCurrentSearchTerm(''); // Lưu từ khóa tìm kiếm hiện tại
    }
    setSearchQuery('');
  };

  // Xử lý sự kiện khi nhấn vào lịch sử tìm kiếm
  const handleHistoryPress = (item: string) => {
    setSearchQuery(item);
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(item.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  // Cập nhật clearHistory
  const clearHistory = () => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchHistory([]);
    setIsSearching(false); // Đặt lại trạng thái tìm kiếm về mặc định
    setFilteredProducts(filtered); // Hiển thị lại sản phẩm gợi ý
  };

  const handleProductDetailPress = (productId: string) => {
    router.push({ pathname: '/ProductDetail', params: { id: productId } });
  };

  const renderHistoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity onPress={() => handleHistoryPress(item)}>
      <Text style={styles.historyItem}>{item}</Text>
    </TouchableOpacity>
  );


  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.historyItemContainer}>
      <TouchableOpacity onPress={() => handleProductDetailPress(item.id)}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
      </TouchableOpacity>

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
        <Text style={styles.productPrice}>{item.price.toLocaleString()}VNĐ</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            placeholder="Tìm kiếm sản phẩm..."
            onChangeText={(text) => setSearchQuery(text)}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Tìm</Text>
          </TouchableOpacity>
        </View>

        {searchHistory.length > 0 && (
          <View style={styles.historyContainer}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Lịch sử tìm kiếm</Text>
              <TouchableOpacity onPress={clearHistory}>
                <Text style={styles.clearHistoryText}>Xóa lịch sử</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={searchHistory}
              numColumns={2} // Sử dụng 2 cột để hiển thị
              renderItem={renderHistoryItem}
              keyExtractor={(item) => item}
              key={2} // Thay đổi key để buộc FlatList render lại
            />
          </View>
        )}


        <View style={styles.recommendationContainer}>
          <Text style={styles.recommendationTitle}>
            {isSearching ? `Kết quả tìm kiếm "${currentSearchTerm}"` : 'Sản phẩm có thể bạn quan tâm'}
          </Text>
          {/* <FlatList
            data={filteredProducts} // Hiển thị các sản phẩm dựa trên tìm kiếm hoặc gợi ý
            numColumns={2} // Sử dụng 2 cột để hiển thị
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
          /> */}
          {filteredProducts.length > 0 ? (
            <FlatList
              data={filteredProducts} // Hiển thị các sản phẩm dựa trên tìm kiếm hoặc gợi ý
              numColumns={2} // Sử dụng 2 cột để hiển thị
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <Text style={styles.noProductText}>Không tìm thấy sản phẩm</Text> // Thông báo khi không có sản phẩm
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 10,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  historyContainer: {
    marginBottom: 20,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearHistoryText: {
    color: '#e74c3c',
    fontSize: 14,
  },
  historyItem: {
    // backgroundColor: '#f0f0f0',
    // padding: 10,
    // borderRadius: 5,
    // marginRight: 10,
    flex: 1, // Giúp mỗi mục chiếm đủ không gian trong hàng
    marginHorizontal: 5, // Khoảng cách giữa các cột
    borderRadius: 8,
  },
  recommendationContainer: {
    marginBottom: 20,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  productImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    resizeMode: 'contain', // Đảm bảo ảnh không bị cắt
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  productPrice: {
    fontSize: 14,
    color: 'red',
    marginTop: 5,
    marginLeft: 5,
    marginBottom: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between', // Căn chỉnh khoảng cách đều giữa các cột
    marginBottom: 10, // Khoảng cách giữa các hàng
  },
  historyItemContainer: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
    maxWidth: '48%', // Đảm bảo kích thước phù hợp
  },
  historyItemImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  historyItemName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  historyItemPrice: {
    fontSize: 12,
    color: 'red',
    marginTop: 5,
    textAlign: 'center',
  },
  noProductText: {
    marginTop: 20,
    fontSize: 20,
    color: 'gray',
    textAlign: 'center',
  },
});

export default Search;
