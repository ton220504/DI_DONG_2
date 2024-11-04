
import React, { useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ip} from '../Api';

export default function User() {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  const router = useRouter(); // Khởi tạo useRouter

  const handleRegisterPress = () => {
    // Điều hướng đến trang đăng ký
    router.push('/Register'); // Thay đổi '/register' thành đường dẫn của trang đăng ký
  };
  const handleLogin = async () => {
    setErrorMessage(''); // Reset thông báo lỗi

    try {
      const response = await fetch(`${ip}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        console.log('Đăng nhập thành công:', data);
        // Lưu token vào AsyncStorage để sử dụng cho các yêu cầu sau
        if (data.token) {
          await AsyncStorage.setItem('token', data.token);
          console.log('Token lưu thành công');
        }
        router.push('/component');
      } else {
        if (response.status === 401) { // 401 là mã lỗi cho Unauthorized
          setErrorMessage("Thông tin đăng nhập không hợp lệ. Vui lòng kiểm tra lại email và mật khẩu.");
        } else {
          setErrorMessage("Thông tin đăng nhập không hợp lệ. Vui lòng kiểm tra lại email và mật khẩu.");
        }
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      setErrorMessage("Không thể kết nối. Vui lòng thử lại sau.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={{ uri: 'https://theme.hstatic.net/200000278317/1000929405/14/logo_medium.png?v=1891' }}
        style={styles.image}
      />

      <Text style={styles.baseText}>
        ĐĂNG NHẬP

      </Text>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

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


      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.buttonText} >Đăng nhập</Text>
      </TouchableOpacity>


      <TouchableOpacity>
        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      <Text style={styles.forgotPasswordText}>Bạn chưa có tài khoản, đăng ký
        <TouchableOpacity onPress={handleRegisterPress}>
          <Text style={styles.textRegister}> tại đây</Text>
        </TouchableOpacity>
      </Text>



      <TouchableOpacity style={styles.socialButton}>
        <Ionicons name="logo-google" size={24} color="white" />
        <Text style={styles.socialButtonText}>Đăng nhập bằng Google</Text>
      </TouchableOpacity>


      <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
        <Ionicons name="logo-facebook" size={24} color="white" />
        <Text style={styles.socialButtonText}>Đăng nhập bằng Facebook</Text>
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
  textRegister: {
    color: 'red'
  },
  image: {
    width: 300,  // Thay đổi kích thước tùy ý
    height: 70, // Thay đổi kích thước tùy ý
    resizeMode: 'contain', // Hoặc 'cover' tùy thuộc vào nhu cầu

  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});