import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Sử dụng router để lấy tham số
import { PRODUCTS } from '../src/data/products';
import { Ionicons } from '@expo/vector-icons';

const ProductDetail = () => {
  const { id } = useLocalSearchParams(); // Lấy id từ URL
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);


  // Tìm kiếm sản phẩm theo id
  const product = PRODUCTS.find((p) => p.id === id);

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };


  const handleSizePress = (size: number) => {
    setSelectedSize(size); // Cập nhật kích thước được chọn
  };
  // Hàm xử lý tăng/giảm số lượng
  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };



  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Sản phẩm không tồn tại.</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.headerRight}>

        {/* Menu Icon */}
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu-outline" size={30} color="gray" style={{ marginLeft: 2 }} />
        </TouchableOpacity>
      </View>
      <Modal transparent={true} visible={isMenuVisible} animationType="slide">
        <TouchableOpacity style={styles.modalBackground} onPress={toggleMenu}>
          <View style={styles.menu}>
            <Text style={styles.menuItem}>TRANG CHỦ</Text>
            <Text style={styles.menuItem}>SẢN PHẨM</Text>
            <Text style={styles.menuItem}>GIỚI THIỆU</Text>
            <Text style={styles.menuItem}>LIÊN HỆ</Text>
            <Text style={styles.menuItem}>TUYỂN DỤNG</Text>
          </View>
        </TouchableOpacity>
      </Modal>
      <ScrollView contentContainerStyle={styles.container}>

        <Image source={product.image} style={styles.image} />
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>Giá: {product.price}</Text>

        <Text style={styles.sizeText}>Kích thước</Text>
        <View style={styles.sizeContainer}>
          {/* Tạo các ô kích thước */}
          {[38.5, 39, 40, 40.5, 41, 42, 43].map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.sizeButton,
                selectedSize === size && styles.selectedButton, // Đổi màu nếu được chọn
              ]}
              onPress={() => handleSizePress(size)}
            >
              <Text style={selectedSize === size ? styles.selectedText : styles.size2}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Số lượng */}
        <Text style={styles.quantityText}>Số lượng</Text>
        <View style={styles.quantityContainer}>

          <View style={styles.counter}>
            <TouchableOpacity style={styles.button} onPress={decreaseQuantity}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <TouchableOpacity style={styles.button} onPress={increaseQuantity}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.cartButton}>
            <Text style={styles.buttonTextCart}>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
        </View>

        {/* Nút Mua ngay và Thêm vào giỏ hàng */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buyButton}>
            <Text style={styles.buttonTextBuy}>Mua ngay</Text>
          </TouchableOpacity>

        </View>





        <Text style={styles.sizeText}>Mô tả</Text>
        <Text style={styles.description}>
          Đây là thông tin chi tiết của sản phẩm {product.name}.
          Bạn có thể thêm các mô tả chi tiết hơn ở đây.
        </Text>
      </ScrollView>
    </>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',

    //backgroundColor: '#fff',
  },
  image: {
    width: 350,
    height: 350,

    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
    marginLeft: 5,

  },
  price: {
    fontSize: 20,
    color: 'red',
    marginBottom: 10,
    textAlign: 'left', // Căn văn bản sang phải
    fontWeight: 'bold',
    alignSelf: 'flex-start', // Căn phần tử Text sang phải của container
    marginLeft: 5,
  },

  description: {
    fontSize: 16,
    textAlign: 'left',
    marginLeft: 5,
  },
  headerRight: {
    marginTop: 15,
    marginLeft: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menu: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  menuItem: {
    marginTop: 25,
    fontSize: 18,
    marginBottom: 15,
  },
  sizeText: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    textAlign: 'left', // Căn chữ Kích thước về bên trái
    alignSelf: 'flex-start', // Căn phần tử Text sang phải của container
  },
  sizeContainer: {
    flexDirection: 'row', // Căn ngang
    flexWrap: 'wrap', // Cho phép các phần tử xuống hàng
    //justifyContent: 'space-between', // Khoảng cách giữa các ô
    width: '100%', // Chiếm toàn bộ chiều rộng


    paddingHorizontal: 10,
  },
  sizeButton: {
    width: '15%', // Điều chỉnh kích thước nút để phù hợp với 5 nút trên một hàng
    aspectRatio: 1, // Tạo nút hình vuông
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    borderRadius: 5,
    margin: 5,

  },
  selectedButton: {
    backgroundColor: '#0033CC', // Màu nền khi nút được chọn (xanh lá cây)
  },

  selectedText: {
    color: '#fff', // Màu chữ trắng khi nút được chọn
    fontWeight: 'bold',
  },
  size2: {
    textAlign: 'center'
  },
  quantityContainer: {
    flexDirection: 'row', // Căn ngang
    flexWrap: 'wrap', // Cho phép các phần tử xuống hàng
    //justifyContent: 'space-between', // Khoảng cách giữa các ô
    width: '100%', // Chiếm toàn bộ chiều rộng

    alignItems: 'center',
    marginBottom: 20,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'light',
    marginTop: 30,
    marginBottom: 20,
    marginLeft: 5,
    textAlign: 'left',
    alignSelf: 'flex-start', // Căn phần tử Text sang phải của container

  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',

    //marginTop: 20,
    width: '100%', // Chiếm toàn bộ chiều rộng
    justifyContent: 'center', // Căn giữa hai nút
    alignItems: 'center',      // Đảm bảo căn giữa theo chiều dọc
    marginBottom: 30,

  },
  buyButton: {
    justifyContent: 'center', // Căn giữa hai nút
    flex: 1,
    backgroundColor: 'black',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 20,
    marginRight: 20,


  },
  buttonTextBuy: {
    color: 'white',
  },
  cartButton: {
    flex: 1,
    backgroundColor: '#4caf50',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 20,
    marginRight: 20,

  },
  buttonTextCart: {
    color: 'white',
  },
});

export default ProductDetail;
