import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';

// Dữ liệu sản phẩm mẫu
const sampleProducts = [
  {
    id: '1',
    name: 'NIKE ZOOM MERCURIAL VAPOR 15',
    price: 2690000,
    image: require('@/assets/images/product20.png'), // Thay đổi theo đường dẫn thực tế
  },
  {
    id: '2',
    name: 'ADIDAS F50 PRO TF',
    price: 2990000,
    image: require('@/assets/images/product21.png'),
  },
  {
    id: '3',
    name: 'NIKE PHANTOM GX 2 ACADEMY',
    price: 2590000,
    image: require('@/assets/images/product22.png'),
  },
];

const ShoppingCart = () => {
  // Trạng thái số lượng sản phẩm
  const [quantities, setQuantities] = useState([1, 1, 1]);

  // Hàm tăng số lượng sản phẩm
  const increaseQuantity = (index: number) => {
    const newQuantities = [...quantities];
    newQuantities[index]++;
    setQuantities(newQuantities);
  };

  // Hàm giảm số lượng sản phẩm
  const decreaseQuantity = (index: number) => {
    const newQuantities = [...quantities];
    if (newQuantities[index] > 1) {
      newQuantities[index]--;
    }
    setQuantities(newQuantities);
  };

  // Tính tổng tiền
  const calculateTotal = () => {
    return sampleProducts.reduce(
      (total, product, index) => total + product.price * quantities[index],
      0
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giỏ hàng</Text>
      <ScrollView>
        {sampleProducts.map((product, index) => (
          <View key={product.id} style={styles.productContainer}>
            <Image source={product.image} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>{product.price.toLocaleString()}₫</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => decreaseQuantity(index)}
                >
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantities[index]}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => increaseQuantity(index)}
                >
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Tổng tiền */}
      <Text style={styles.totalText}>Tổng tiền: {calculateTotal().toLocaleString()}₫</Text>

      {/* Nút thanh toán */}
      <TouchableOpacity style={styles.checkoutButton}>
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
    fontSize: 18,
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
});

export default ShoppingCart;
