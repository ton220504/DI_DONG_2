import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView, FlatList, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { RouteProp, useRoute } from '@react-navigation/native';
import { router, useNavigation, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ip } from './Api';

type DropDownItem = {
    label: string;
    value: string;
};

export interface CheckoutItem {
    image: string;
    name: string;
    price: number;
    size: number; // Đảm bảo kích thước có kiểu dữ liệu đúng
    quantity: number;
}
interface CheckoutParams {
    items: string; // Thay đổi kiểu này nếu cần
}

const Checkout = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [provinceOpen, setProvinceOpen] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [districtOpen, setDistrictOpen] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [wardOpen, setWardOpen] = useState(false);
    const [selectedWard, setSelectedWard] = useState(null);

    const [provinces, setProvinces] = useState<DropDownItem[]>([]);
    const [districts, setDistricts] = useState<DropDownItem[]>([]);
    const [wards, setWards] = useState<DropDownItem[]>([]);


    const [items, setItems] = useState<any[]>([]);
    const navigation = useNavigation();
    const route = useRoute();

    


    useEffect(() => {
        // Sử dụng type assertion để xác định rõ kiểu cho params
        const params = route.params as CheckoutParams;

        // Lấy chuỗi items từ params
        const itemsString = params.items;

        // Giải mã và thiết lập dữ liệu
        if (itemsString) {
            try {
                const decodedItems = JSON.parse(decodeURIComponent(itemsString));
                setItems(decodedItems);
                console.log(decodedItems);
            } catch (error) {
                console.error('Error parsing items:', error);
            }
        } else {
            console.error('No items found in URL');
        }
    }, [route]); // Chạy lại khi có sự thay đổi trong route



    // Fetch provinces
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');
                setProvinces(
                    response.data.data.map((item: any) => ({
                        label: item.name,
                        value: item.id,
                    }))
                );
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };
        fetchProvinces();
    }, []);
    

    // Fetch districts when a province is selected
    useEffect(() => {
        if (selectedProvince) {
            const fetchDistricts = async () => {
                try {
                    const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${selectedProvince}.htm`);
                    setDistricts(
                        response.data.data.map((item: any) => ({
                            label: item.name,
                            value: item.id,
                        }))
                    );
                } catch (error) {
                    console.error('Error fetching districts:', error);
                }
            };
            fetchDistricts();
            setSelectedDistrict(null); // Reset district when province changes
            setWards([]); // Reset wards when province changes
        }
    }, [selectedProvince]);

    // Fetch wards when a district is selected
    useEffect(() => {
        if (selectedDistrict) {
            const fetchWards = async () => {
                try {
                    const response = await axios.get(`https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`);
                    setWards(
                        response.data.data.map((item: any) => ({
                            label: item.name,
                            value: item.id,
                        }))
                    );
                } catch (error) {
                    console.error('Error fetching wards:', error);
                }
            };
            fetchWards();
            setSelectedWard(null); // Reset ward when district changes
        }
    }, [selectedDistrict]);

    const handlePayment = () => {
        alert('Thanh toán thành công');
    };
    // Hàm render cho từng item
    const renderItem = ({ item }: { item: CheckoutItem }) => (
        <View style={styles.productContainer}>
            {/* Hình ảnh sản phẩm */}
            <Image source={{ uri: item.image }} style={styles.productImage} />

            {/* Phần chi tiết sản phẩm */}
            <View style={styles.productDetailsContainer}>
                <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
                <Text style={styles.productPrice}>{item.price.toLocaleString('vi-VN')}₫</Text>
                <Text style={styles.productDetails}>Số lượng: {item.quantity}</Text>
                <Text style={styles.productDetails}>Size: {item.size}</Text>
            </View>
        </View>
    );
    // Hàm tính tổng tiền
    const tinhTongTien = (items: CheckoutItem[]) => {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };


    const checkout = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) throw new Error('Token not found');
    
            // Kiểm tra xem có sản phẩm trong giỏ hàng không
            if (items.length === 0) {
                Alert.alert('Thông báo', 'Giỏ hàng của bạn hiện đang trống.');
                return;
            }
    
            // Tính tổng tiền
            const total = tinhTongTien(items); // Tính tổng tiền từ giỏ hàng
            
            // Tạo dữ liệu để gửi
            const checkoutData = {
                items: items.map(product => ({
                    id: product.id,
                    name: product.name,             // Tên sản phẩm
                    price: product.price,           // Giá sản phẩm
                    quantity: product.quantity,     // Số lượng sản phẩm
                    size: product.size,             // Kích cỡ sản phẩm
                    image: product.image,           // Hình ảnh sản phẩm
                })),
                name: name,                     // Thêm tên đầy đủ
                provinces: selectedProvince,         // Tỉnh thành
                districts: selectedDistrict,         // Quận huyện
                wards: selectedWard,                 // Phường xã
                address,                             // Địa chỉ
                total,
            };
    
            // Log dữ liệu để kiểm tra
            console.log('Checkout data:', checkoutData);
    
            const response = await fetch(`${ip}/checkout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(checkoutData), // Chuyển đổi checkoutData thành chuỗi JSON
            });
    
            // Kiểm tra phản hồi từ server
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Checkout failed');
            }
    
            // Nếu thanh toán thành công, xóa sản phẩm
            const responseData = await response.json();
            Alert.alert('Thành công', 'Đặt hàng thành công!', [
                {
                    text: 'OK', 
                    onPress: async () => {
                        // Xóa từng sản phẩm đã thanh toán
                        await Promise.all(items.map(async (product) => {
                            try {
                                const deleteResponse = await fetch(`${ip}/deletecart/${product.id}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Authorization': `Bearer ${token}`,
                                        'Content-Type': 'application/json',
                                    },
                                });
    
                                if (!deleteResponse.ok) {
                                    const deleteErrorData = await deleteResponse.json();
                                    console.error('Delete error:', deleteErrorData);
                                    Alert.alert('Lỗi', `Không thể xóa sản phẩm ${product.name}`);
                                }
                            } catch (error) {
                                console.error('Error deleting product:', error);
                            }
                        }));
    
                        // Quay lại trang chính (ví dụ: sử dụng navigation)
                        router.push('/component');
                    }
                },
            ]);
    
        } catch (error) {
            console.error('Checkout error:', error);
            Alert.alert('Lỗi', 'Đặt hàng không thành công, vui lòng thử lại.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Thông tin thanh toán</Text>
            {/* Hiển thị sản phẩm */}
            <Text style={styles.detail}>Thông tin sản phẩm</Text>
            <View style={styles.container}>
                <FlatList
                    data={items} // Dữ liệu để hiển thị
                    renderItem={renderItem} // Hàm render cho từng item
                    keyExtractor={(item, index) => index.toString()} // Khóa cho từng item
                    contentContainerStyle={styles.flatListContent} // Tùy chỉnh style cho FlatList
                />
            </View>
            <Text style={styles.sum}>Tổng tiền: {tinhTongTien(items).toLocaleString()} VNĐ</Text>
            {/* Thông tin giao hàng */}
            <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>

            <TextInput
                style={styles.input}
                placeholder="Họ và tên"
                placeholderTextColor="rgba(0, 0, 0, 0.5)" // Màu xám nhạt để placeholder mờ
                value={name}
                onChangeText={setName}
            />

            {/* Dropdown chọn Tỉnh */}
            <View style={{ zIndex: 300, position: 'relative' }}>
                <DropDownPicker
                    open={provinceOpen}
                    value={selectedProvince}
                    items={provinces}
                    setOpen={setProvinceOpen}
                    setValue={setSelectedProvince}
                    placeholder="Chọn tỉnh"
                    style={styles.input}
                    dropDownContainerStyle={styles.dropdownContainer}
                    placeholderStyle={{ color: 'rgba(0, 0, 0, 0.5)' }}
                />
            </View>

            {/* Dropdown chọn Huyện */}

            <DropDownPicker
                open={districtOpen}
                value={selectedDistrict}
                items={districts}
                setOpen={setDistrictOpen}
                setValue={setSelectedDistrict}
                placeholder="Chọn huyện"
                style={styles.input}
                //dropDownContainerStyle={styles.dropdownContainer}
                placeholderStyle={{ color: 'rgba(0, 0, 0, 0.5)' }}
                containerStyle={{ overflow: 'visible' }}
                dropDownContainerStyle={{
                    ...styles.dropdownContainer,
                    overflow: 'visible',
                    zIndex: 9999,
                }}
                zIndex={200}
            />


            {/* Dropdown chọn Xã */}
            <DropDownPicker
                open={wardOpen}
                value={selectedWard}
                items={wards}
                setOpen={setWardOpen}
                setValue={setSelectedWard}
                placeholder="Chọn xã"
                placeholderStyle={{ color: 'rgba(0, 0, 0, 0.5)' }}
                style={styles.input}
                containerStyle={{ overflow: 'visible' }}
                dropDownContainerStyle={{
                    ...styles.dropdownContainer,
                    overflow: 'visible',
                    zIndex: 9999,
                }}
                zIndex={100}
            />

            <TextInput
                style={styles.input}
                placeholder="Địa chỉ"
                placeholderTextColor="rgba(0, 0, 0, 0.5)" // Màu xám nhạt để placeholder mờ
                value={address}
                onChangeText={setAddress}
            />

            {/* Nút thanh toán */}
            <TouchableOpacity style={styles.paymentButton} onPress={checkout}>
                <Text style={styles.paymentButtonText}>Thanh toán</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#F9F9F9',
    },
    header: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        backgroundColor: '#F9F9F9',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
    },
    productContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 10,
        marginVertical: 15,
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
        marginVertical: 5,
    },
    productDetails: {
        fontSize: 14,
        color: '#555',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        marginBottom: 15,
        backgroundColor: '#FFF',
    },
    dropdownContainer: {
        borderColor: '#ddd',
    },
    paymentButton: {
        backgroundColor: '#4caf50',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    paymentButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    flatListContent: {
        paddingBottom: 10, // Khoảng cách dưới cùng cho FlatList
    },
    productDetailsContainer: {
        flex: 1, // Cho phép phần chi tiết sản phẩm chiếm không gian còn lại
        flexDirection: 'column', // Xếp các chi tiết theo chiều dọc
    },
    sum: {
        color: '#555',
        marginBottom: 10,
        fontSize: 22,
        fontWeight: 'bold',
        fontStyle: 'italic',
        alignSelf: 'flex-end',
    },
    detail: {
        color: '#555',
        paddingTop: 10,
        fontStyle: 'italic',
    }
});

export default Checkout;
