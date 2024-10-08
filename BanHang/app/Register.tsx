
import React, { useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter(); // Khởi tạo useRouter

  

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        style={styles.logo}
        source={require('@/assets/images/banner01.png')}  
      />

      <Text style={styles.baseText}>
        ĐĂNG KÝ

      </Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />


      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>


      



      <TouchableOpacity style={styles.socialButton}>
        <Ionicons name="logo-google" size={24} color="white" />
        <Text style={styles.socialButtonText}>Đăng ký bằng Google</Text>
      </TouchableOpacity>


      <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
        <Ionicons name="logo-facebook" size={24} color="white" />
        <Text style={styles.socialButtonText}>Đăng ký bằng Facebook</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 350,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  forgotPasswordText: {
    color: '#4285F4',
    marginBottom: 20,
    fontSize: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#db4437',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 10,
  },
  facebookButton: {
    backgroundColor: '#4267B2',
  },
  socialButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  baseText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 30,

    marginBottom: 50,
  },
  textRegister:{
    color: 'red'
  }
});