import { router, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ip } from '../Api';



// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
  id: string;
  name: string;
  price: number;
  size: number,
  image: string; // Đường dẫn đến hình ảnh sản phẩm
  quantity: number; // Số lượng trong giỏ hàng
}

export interface CheckoutItem {
  image: string;
  name: string;
  price: number;
  size: number; // Đảm bảo kích thước có kiểu dữ liệu đúng
  quantity: number;
}



// Component giỏ hàng
const ShoppingCart: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]); // Danh sách sản phẩm trong giỏ hàng
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading
  const [error, setError] = useState<string | null>(null); // Trạng thái lỗi
  const [quantity, setQuantity] = useState<number[]>([1, 1, 1]);

  // Hàm gọi API để lấy giỏ hàng
  const fetchCartItems = async () => {
    
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token not found');
      const response = await fetch(`${ip}/getcart`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',

        },
      });

      if (!response.ok) {
        // Nếu phản hồi không OK, ném lỗi với thông báo từ phản hồi
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch cart items');
      }

      const data: Product[] = await response.json(); // Lấy dữ liệu từ phản hồi
      setProducts(data); // Cập nhật trạng thái với dữ liệu sản phẩm
      setQuantity(data.map((product) => product.quantity)); // Cập nhật số lượng từ API
    } catch (err) {
      // Xử lý lỗi: Kiểm tra xem 'err' có phải là đối tượng Error hay không
      const errorMessage =
        typeof err === 'object' && err !== null && 'message' in err
          ? (err as Error).message
          : 'An unexpected error occurred'; // Mặc định thông báo lỗi

      setError(errorMessage); // Cập nhật trạng thái lỗi
    } finally {
      setLoading(false); // Đánh dấu rằng đã kết thúc quá trình loading
    }
  };
  // Hàm cập nhật số lượng sản phẩm qua API
  const updateQuantity = async (index: number, newQuantity: number) => {
    const productId = products[index].id;
    try {
      const response = await fetch(`${ip}/putcart/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product quantity');
      }

      const newQuantities = [...quantity];
      newQuantities[index] = newQuantity;
      setQuantity(newQuantities);
    } catch (err) {
      setError((err as Error).message);
      Alert.alert('Error', (err as Error).message);
    }
  };

  // Hàm xóa sản phẩm qua API
  const deleteProduct = async (index: number) => {
    const productId = products[index].id;
    try {
      const response = await fetch(`${ip}/deletecart/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }

      // Cập nhật lại danh sách sản phẩm và số lượng sau khi xóa
      const newProducts = products.filter((_, i) => i !== index);
      const newQuantities = quantity.filter((_, i) => i !== index);
      setProducts(newProducts);
      setQuantity(newQuantities);
    } catch (err) {
      setError((err as Error).message);
      Alert.alert('Error', (err as Error).message);
    }
  };

  // Gọi hàm fetchCartItems khi component được render
  useEffect(() => {
    fetchCartItems();
  }, []);


  const handleProductDetailPress = (productId: string) => {
    router.push({ pathname: '/ProductDetail', params: { id: productId } });
  };


  const router = useRouter(); // Khai báo useRouter
  const handleCheckout = () => {
    const checkoutItems: CheckoutItem[] = products.map((product, index) => ({
      id: product.id,
      image: product.image,
      name: product.name,
      price: Math.floor(product.price),
      size: product.size, // Giả sử bạn có kích thước của sản phẩm trong đối tượng product
      quantity: quantity[index],
    }));

    // Dùng router.push để truyền dữ liệu
    router.push({
      pathname: '/Checkout',
      params: { items: JSON.stringify(checkoutItems) }
    });
  };

  // Hàm tính tổng tiền
  const calculateTotal = () => {
    return products.reduce(
      (total, product, index) => total + product.price * quantity[index],
      0
    );
  };

  // Hiển thị thông báo lỗi nếu có
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Lỗi</Text>
        <Text>{error}</Text>
      </View>
    );
  }

  // Nếu đang loading thì hiển thị ActivityIndicator
  if (loading) {
    return <ActivityIndicator size="large" color="#FF5733" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giỏ hàng</Text>
      <ScrollView>
        {products.length > 0 ? (
          products.map((product, index) => (
            <View key={product.id} style={styles.productContainer}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productSize}>Size: {product.size}</Text>
                <Text style={styles.productPrice}>
                  {Math.floor(product.price).toLocaleString('vi-VN')}₫
                </Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => {
                      if (quantity[index] > 1) updateQuantity(index, quantity[index] - 1);
                    }}
                  >
                    <Text style={styles.buttonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity[index]}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(index, quantity[index] + 1)}
                  >
                    <Text style={styles.buttonText}>+</Text>
                  </TouchableOpacity>
                </View>
                {/* Nút xóa sản phẩm */}
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => deleteProduct(index)}
                >
                  <Text style={styles.removeButtonText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noProductsText}>Không có sản phẩm nào</Text>
        )}
      </ScrollView>

      {/* Tổng tiền chỉ hiện khi có sản phẩm */}
      {products.length > 0 && (
        <Text style={styles.totalText}>Tổng tiền: {calculateTotal().toLocaleString()} VNĐ</Text>
      )}

      {/* Nút thanh toán */}
      <TouchableOpacity
        style={[styles.checkoutButton, products.length === 0 && styles.disabledButton]}
        onPress={handleCheckout}
        disabled={products.length === 0} // Disable button when no products
      >
        <Text style={styles.checkoutButtonText}>Thanh toán</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  productContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  productSize: {
    fontSize: 12,
    fontWeight: 'light',
    marginTop: 5,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  productPrice: {
    color: 'red',
    fontSize: 16,
    marginVertical: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    width: 30,
    height: 30,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityText: {
    marginHorizontal: 15,
    fontSize: 18,
  },
  totalText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  checkoutButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginTop: 10,
    width: 45,
  },
  clearCartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearCartButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  noProductsText: {
    marginTop: 20,
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: 'gray', // Màu cho nút không thể nhấn
  },
});

export default ShoppingCart;
