import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Button, TextInput, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ip } from '../Api';
import { useRouter } from 'expo-router';

interface CheckoutItem {
    id: number,
    name: string,
    items: string,
    provinces: string,
    districts: string,
    wards: string,
    address: string,
    total: number,
}


const User = () => {
    //const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);
    const [userInfo, setUserInfo] = useState<{ name: string; email: string }>({
        name: '',
        email: '',
    });
    const [checkoutData, setCheckoutData] = useState<CheckoutItem[]>([]); // Danh sách sản phẩm trong giỏ hàng

    const [loading, setLoading] = useState<boolean>(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalInfo, setModalInfo] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const router = useRouter(); // Khởi tạo useRouter

    useEffect(() => {
        fetchUserInfo();
        fetchCheckout();
    }, []);

    const fetchUserInfo = async () => {
        setLoading(true);
        try {
            // Lấy token từ AsyncStorage
            const token = await AsyncStorage.getItem('token');
            if (!token) throw new Error('Token not found');

            // Gọi API để lấy thông tin user
            const response = await fetch(`${ip}/user-from-token`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status !== 200) {
                throw new Error('Failed to fetch user info');
            }

            const data = await response.json();
            //setUserInfo(data);
            setUserInfo({
                name: data.name,
                email: data.email,
            });
        } catch (error) {
            console.error('Error fetching user info:', error);
        } finally {
            setLoading(false);
        }
    };


    //đổi mật khẩu
    const changePassword = async () => {
        // Kiểm tra mật khẩu mới và xác nhận
        if (newPassword !== confirmPassword) {
            setErrorMessage("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return; // Không thực hiện gì thêm nếu có lỗi
        }



        // Kiểm tra mật khẩu cũ
        if (!oldPassword) {
            setErrorMessage("Vui lòng nhập mật khẩu cũ.");
            return; // Không thực hiện gì thêm nếu không nhập mật khẩu cũ
        }
        if (!newPassword || !confirmPassword) {
            setErrorMessage("Vui lòng nhập mật khẩu mới.");
            return; // Không thực hiện gì thêm nếu có lỗi
        }

        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) throw new Error('Token not found');

            const response = await fetch(`${ip}/change-password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword,
                    new_password_confirmation: confirmPassword,
                }),
            });

            if (response.status === 400) {
                const errorData = await response.json();
                const errorMessage = errorData.error || 'Mật khẩu cũ không khớp.';
                setErrorMessage(errorMessage);
                return; // Ngừng thực hiện nếu có lỗi
            }

            if (!response.ok) {
                throw new Error('Không thể đổi mật khẩu');
            }

            Alert.alert('Thành công', 'Đổi mật khẩu thành công');
            setModalVisible(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setErrorMessage('');
            setLoading(true); // Chỉ set loading khi tất cả đều hợp lệ
        } catch (error) {
            console.error('Error changing password:', error);
            // Kiểm tra xem error có phải là đối tượng không và có thuộc tính message không
            const errorMessage = (error instanceof Error && error.message) || 'Đã xảy ra lỗi';
            setErrorMessage(errorMessage); // Hiển thị thông báo lỗi cho người dùng
        } finally {
            setLoading(false); // Luôn tắt loading khi hoàn tất
        }
    };

    //hàm sửa thông tin
    // Hàm cập nhật thông tin người dùng
    const updateUserInfo = async () => {
        if (!userInfo.name || !userInfo.email) {
            setErrorMessage("Vui lòng nhập đầy đủ thông tin tên và email.");
            return; // Dừng thực hiện nếu thiếu tên hoặc email
        }

        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) throw new Error('Token not found');

            const response = await fetch(`${ip}/change-info`, {
                method: 'PUT', // Đảm bảo sử dụng phương thức PUT cho cập nhật
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: userInfo.name,
                    email: userInfo.email,
                }),
            });

            if (response.status === 400) {
                const errorData = await response.json();
                const errorMessage = errorData.error || 'Không thể cập nhật thông tin';
                setErrorMessage(errorMessage);
                return; // Dừng lại nếu có lỗi
            }

            if (!response.ok) {
                throw new Error('Cập nhật thông tin không thành công');
            }

            // Hiển thị thông báo thành công và cập nhật giao diện
            Alert.alert('Thành công', 'Cập nhật thông tin thành công');
            setModalInfo(false);
            setErrorMessage('');
            fetchUserInfo(); // Cập nhật lại thông tin người dùng
        } catch (error) {
            console.error('Error updating user info:', error);
            const errorMessage = (error instanceof Error && error.message) || 'Đã xảy ra lỗi';
            setErrorMessage(errorMessage); // Hiển thị thông báo lỗi
        } finally {
            setLoading(false); // Luôn tắt loading khi hoàn tất
        }
    };

    // Hàm gọi API để lấy thông tin checkout
    const fetchCheckout = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) throw new Error('Token not found');

            const response = await fetch(`${ip}/getCheckoutByUserId`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch checkout data');
            }

            const data = await response.json();
            console.log('Fetched checkout data:', data); // In ra dữ liệu lấy được từ API
            setCheckoutData(data); // Cập nhật checkoutData

        } catch (err) {
            const errorMessage =
                typeof err === 'object' && err !== null && 'message' in err
                    ? (err as Error).message
                    : 'An unexpected error occurred';

            setErrorMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };







    // Hàm đăng xuất
    const logout = async () => {
        try {
            // Xóa token khỏi AsyncStorage
            await AsyncStorage.removeItem('token');

            // Đặt lại thông tin người dùng thành giá trị mặc định rỗng
            setUserInfo({ name: '', email: '' });

            // Điều hướng về trang đăng nhập hoặc trang chủ
            router.push('/');

        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    // Nếu đang loading thì hiển thị ActivityIndicator
    if (loading) {
        return <ActivityIndicator size="large" color="#FF5733" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Tài khoản của bạn</Text>
            {userInfo ? (
                <View style={styles.infoContainer}>
                    <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Họ tên</Text>
                        <Text style={styles.value}>: {userInfo.name}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Điện thoại</Text>
                        <Text style={styles.value}>: </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Email</Text>
                        <Text style={styles.value}>: {userInfo.email}</Text>
                    </View>
                </View>
            ) : (
                <Text>Không có thông tin người dùng</Text>
            )}

           

            <Text style={styles.changePasswordButton}>
                <Text onPress={() => setModalInfo(true)} style={styles.changePasswordText}>Chỉnh sửa thông tin</Text>
            </Text>

            <Text onPress={() => setModalVisible(true)} style={styles.changePasswordButton}>
                <Text style={styles.changePasswordText}>Đổi mật khẩu</Text>
            </Text>

            <Text onPress={logout} style={styles.changePasswordButton}>
                <Text style={styles.logout}>Đăng xuất</Text>
            </Text>

            {/* Modal thay đổi mật khẩu */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Đổi mật khẩu</Text>
                        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                        <TextInput
                            style={styles.input}
                            placeholder="Nhập mật khẩu cũ"
                            secureTextEntry
                            value={oldPassword}
                            onChangeText={setOldPassword}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập mật khẩu mới"
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập lại mật khẩu mới"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />

                        <View style={styles.buttonContainer}>
                            <Button
                                title="Lưu"
                                onPress={changePassword}
                                disabled={loading} // Vô hiệu hóa nút khi đang xử lý
                            />
                            <Button title="Hủy" color="red" onPress={() => setModalVisible(false)} />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal chỉnh sửa thông tin */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalInfo}
                onRequestClose={() => setModalInfo(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Chỉnh sửa thông tin</Text>
                        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                        <TextInput
                            style={styles.input}
                            placeholder="Nhập tên"
                            value={userInfo.name}
                            onChangeText={(text) => setUserInfo({ ...userInfo, name: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập email"
                            value={userInfo.email}
                            onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
                        />

                        <View style={styles.buttonContainer}>
                            <Button
                                title="Lưu"
                                onPress={updateUserInfo}
                                disabled={loading}
                            />
                            <Button title="Hủy" color="red" onPress={() => setModalInfo(false)} />
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    infoContainer: {
        backgroundColor: '#F9F9F9',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333333',
    },
    infoItem: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        width: 80,
        color: '#555555',
    },
    value: {
        fontSize: 14,
        color: '#333333',
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#FF5733',
        padding: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    changePasswordButton: {
        alignItems: 'center',
        backgroundColor: '#F9F9F9',

        padding: 12,
        borderRadius: 8,
        marginTop: 20,
    },
    changePasswordText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 14,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    logout: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 14,
    },
    productImage: {
        width: 60,
        height: 60,
        marginRight: 10,
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    productSize: {
        fontSize: 14,
        color: '#888',
    },
    productPrice: {
        fontSize: 16,
        color: '#f00',
        marginVertical: 5,
    },
    noProductsText: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 16,
        color: '#888',
    },
    productContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },

});

export default User;
