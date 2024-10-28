import React, { useState } from 'react';
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
} from 'react-native';

// Dữ liệu sản phẩm gợi ý với hình ảnh
const recommendedProducts = [
  { id: '1', name: 'NIKE ZOOM MERCURIAL VAPOR 15', price: '2,690,000₫', image: require('@/assets/images/product20.png') },
  { id: '2', name: 'ADIDAS F50 PRO TF', price: '2,990,000₫', image: require('@/assets/images/product21.png') },
  { id: '3', name: 'NIKE PHANTOM GX 2 ACADEMY', price: '2,590,000₫', image: require('@/assets/images/product22.png') },
  { id: '4', name: 'ADIDAS X CRAZYFAST ELITE TF', price: '2,690,000₫', image: require('@/assets/images/product23.png') },
];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Xử lý sự kiện khi nhấn nút tìm kiếm
  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      // Thêm từ khóa tìm kiếm vào lịch sử
      setSearchHistory([searchQuery, ...searchHistory]);
      setSearchQuery('');
    }
  };

  // Xử lý sự kiện khi nhấn vào lịch sử tìm kiếm
  const handleHistoryPress = (item: string) => {
    setSearchQuery(item);
  };

  // Xử lý sự kiện khi xóa lịch sử tìm kiếm
  const clearHistory = () => {
    setSearchHistory([]);
  };

  const renderHistoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity onPress={() => handleHistoryPress(item)}>
      <Text style={styles.historyItem}>{item}</Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }: { item: { id: string; name: string; price: string; image: any } }) => (
    <View style={styles.productItem}>
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Thanh tìm kiếm */}
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

        {/* Lịch sử tìm kiếm */}
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
              renderItem={renderHistoryItem}
              keyExtractor={(item) => item}
              horizontal
            />
          </View>
        )}

        {/* Các sản phẩm gợi ý */}
        <View style={styles.recommendationContainer}>
          <Text style={styles.recommendationTitle}>Sản phẩm có thể bạn quan tâm</Text>
          <FlatList
            data={recommendedProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
          />
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
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
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
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: 'red',
    marginTop: 5,
  },
});

export default Search;
