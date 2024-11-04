
import React, { useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { ip } from './Api';

export default function Register() {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);

  const router = useRouter(); // Khởi tạo useRouter
 

  const handleRegister = async () => {

    setErrorMessage('');

    if (!name) {
      setErrorMessage("Vui lòng nhập tên!");
      return;
    }
    if (!email) {
      setErrorMessage("Vui lòng nhập email!");
      return;
    }
    if (!password || !confirmPassword) {
      setErrorMessage("Vui lòng nhập mật khẩu!");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    // Kiểm tra mật khẩu mới và xác nhận
    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không đúng!");
      return; // Không thực hiện gì thêm nếu có lỗi
  }


    try {
      const response = await fetch(`${ip}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          confirm_password: confirmPassword

        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        router.push({ pathname: '/'});
        setModalVisible(true);
      } else if (response.status === 409) {
        setErrorMessage("Email này đã được sử dụng!");
      } else {
        setErrorMessage("Email này đã được sử dụng!");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
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
        ĐĂNG KÝ

      </Text>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}

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
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu"
        placeholderTextColor="#888"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
      />


      <TouchableOpacity onPress={handleRegister} style={styles.loginButton}>
        <Text style={styles.buttonText} >Đăng ký</Text>
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