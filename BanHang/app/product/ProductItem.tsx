import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import type { Product } from '../../src/data/products';
import { router } from 'expo-router';

interface ProductItemProps {
  product: Product;
}

const handleProductDetailPress = (productId: string) => {
  router.push({ pathname: '/ProductDetail', params: { id: productId } });
};

export const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  return (
    
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleProductDetailPress(product.id)}>
        <Image 
          source={{ uri: product.image || 'https://example.com/default-image.png' }} 
          style={styles.image} 
        />
      </TouchableOpacity>

      <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
        {product.name}
      </Text>
      <Text style={styles.price}>{product.price.toLocaleString()} VNĐ</Text>
      <TouchableOpacity style={styles.button} onPress={() => handleProductDetailPress(product.id)}>
        <Text style={styles.buttonText}>Xem chi tiết</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
    textAlign: 'center',
  },
  price: {
    fontSize: 14,
    color: 'red',
  },
  button: {
    marginTop: 8,
    backgroundColor: 'gray',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
