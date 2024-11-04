// import { router } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, Dimensions } from 'react-native';
// import { ip } from './Api';

// const { width } = Dimensions.get('window'); // Lấy chiều rộng màn hình
// // Định nghĩa kiểu cho Product
// interface Product {
//     id: string;
//     image: any; // Đường dẫn đến hình ảnh sản phẩm
//     name: string;
//     price: string;
//     description: string;
// }

// const SimilarProducts = ({ product }: { product: Product }) => {
//     const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchAllProducts = async () => {
//             try {
//                 const response = await fetch(`${ip}/getAll`); // Gọi API để lấy tất cả sản phẩm
//                 if (!response.ok) {
//                     throw new Error('Không thể lấy danh sách sản phẩm');
//                 }
//                 const data = await response.json(); // Chuyển phản hồi thành JSON

//                 // Lấy từ đầu tiên trong tên sản phẩm hiện tại
//                 const firstWord = product.name.split(' ')[0].toLowerCase(); // Chỉ lấy từ đầu tiên

//                 // Lọc ra các sản phẩm tương tự dựa trên từ đầu tiên
//                 const filteredProducts = data.filter((item: Product) =>
//                     item.name.toLowerCase().includes(firstWord) && item.id !== product.id // Kiểm tra nếu tên sản phẩm có chứa từ đầu tiên và không phải là sản phẩm hiện tại
//                 );

//                 setSimilarProducts(filteredProducts); // Cập nhật state với sản phẩm tương tự
//                 setLoading(false); // Tắt chế độ loading
//             } catch (error) {
//                 console.error('Có lỗi khi gọi API:', error);
//                 setLoading(false); // Tắt chế độ loading dù có lỗi
//             }
//         };

//         fetchAllProducts(); // Gọi hàm để lấy danh sách sản phẩm
//     }, [product.name]); // Chạy lại khi tên sản phẩm thay đổi


//     const handleProductDetailPress = (productId: string) => {
//         router.push({ pathname: '/ProductDetail', params: { id: productId } });
//     };

//     const renderProductItem = ({ item }: { item: Product }) => (
//         <View style={styles.historyItemContainer}>
//             <TouchableOpacity onPress={() => handleProductDetailPress(item.id)}>
//                 <Image
//                     source={{ uri: item.image || 'https://example.com/default-image.png' }}
//                     style={styles.productImage}
//                 />
//             </TouchableOpacity>
//             <View style={styles.productInfo}>
//                 <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
//                 <Text style={styles.productPrice}>{parseFloat(item.price).toLocaleString()} VNĐ</Text>
//             </View>
//             <TouchableOpacity style={styles.button} onPress={() => handleProductDetailPress(item.id)}>
//                 <Text style={styles.buttonText}>Xem chi tiết</Text>
//             </TouchableOpacity>
//         </View>
//     );

//     if (loading) {
//         return <Text>Đang tải sản phẩm tương tự...</Text>; // Hiển thị khi đang tải
//     }

//     return (
//         <View>
//             <FlatList
//                 data={similarProducts} // Hiển thị các sản phẩm dựa trên tìm kiếm hoặc gợi ý
//                 numColumns={2} // Sử dụng 2 cột để hiển thị
//                 renderItem={renderProductItem}
//                 keyExtractor={(item) => item.id}
//                 columnWrapperStyle={styles.columnWrapper}
//             />
//         </View>
//     );
// };
// const styles = StyleSheet.create({
//     historyItemContainer: {
//         flex: 1,
//         margin: 5,
//         backgroundColor: '#fff',
//         borderRadius: 8,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 8,
//         elevation: 5,
//         alignItems: 'center',
//         //maxWidth: '48%', // Đảm bảo kích thước phù hợp
//         maxWidth: width / 2 - 15, // Tự động chia đôi màn hình
//         marginBottom: 15,
//     },
//     historyItemImage: {
//         width: 150,
//         height: 150,
//         borderRadius: 8,
//         resizeMode: 'cover', // Ảnh tự co dãn để lấp đầy
//     },
//     historyItemName: {
//         fontSize: 14,
//         fontWeight: 'bold',
//         textAlign: 'center',
//     },
//     historyItemPrice: {
//         fontSize: 12,
//         color: 'red',
//         marginTop: 5,
//         textAlign: 'center',
//     },
//     productImage: {
//         width: 150,
//         height: 150,
//         borderRadius: 10,
//         resizeMode: 'cover', // Đảm bảo ảnh không bị cắt
//     },
//     productInfo: {
//         flex: 1,
//         width: '100%',
//         paddingHorizontal: 5,
//     },
//     productName: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginLeft: 5,
//     },
//     productPrice: {
//         fontSize: 14,
//         color: 'red',
//         marginTop: 5,
//         marginLeft: 5,
//         marginBottom: 10,
//     },
//     columnWrapper: {
//         justifyContent: 'space-between', // Căn chỉnh khoảng cách đều giữa các cột
//         marginBottom: 10, // Khoảng cách giữa các hàng
//     },
//     button: {
//         marginTop: 8,
//         backgroundColor: 'gray',
//         paddingVertical: 8,
//         paddingHorizontal: 16,
//         borderRadius: 4,
//         marginBottom: 15,
//     },
//     buttonText: {
//         color: '#fff',
//         fontSize: 16,
//     },
// });

// export default SimilarProducts;
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { ip } from './Api';

const { width } = Dimensions.get('window'); // Lấy chiều rộng màn hình

// Định nghĩa kiểu cho Product
interface Product {
    id: string;
    image: any;
    name: string;
    price: string;
    description: string;
}

const SimilarProducts = ({ product }: { product: Product }) => {
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const response = await fetch(`${ip}/getAll`); // Gọi API để lấy tất cả sản phẩm
                if (!response.ok) {
                    throw new Error('Không thể lấy danh sách sản phẩm');
                }
                const data = await response.json(); // Chuyển phản hồi thành JSON

                // Lấy từ đầu tiên trong tên sản phẩm hiện tại
                const firstWord = product.name.split(' ')[0].toLowerCase(); // Chỉ lấy từ đầu tiên

                // Lọc ra các sản phẩm tương tự dựa trên từ đầu tiên
                const filteredProducts = data.filter((item: Product) =>
                    item.name.toLowerCase().includes(firstWord) && item.id !== product.id // Kiểm tra nếu tên sản phẩm có chứa từ đầu tiên và không phải là sản phẩm hiện tại
                );

                setSimilarProducts(filteredProducts); // Cập nhật state với sản phẩm tương tự
                setLoading(false); // Tắt chế độ loading
            } catch (error) {
                console.error('Có lỗi khi gọi API:', error);
                setLoading(false); // Tắt chế độ loading dù có lỗi
            }
        };

        fetchAllProducts(); // Gọi hàm để lấy danh sách sản phẩm
    }, [product.name]); // Chạy lại khi tên sản phẩm thay đổi

    const handleProductDetailPress = (productId: string) => {
        router.push({ pathname: '/ProductDetail', params: { id: productId } });
    };

    const renderProductItem = ({ item }: { item: Product }) => (
        <View style={styles.historyItemContainer}>
            <TouchableOpacity onPress={() => handleProductDetailPress(item.id)}>
                <Image
                    source={{ uri: item.image || 'https://example.com/default-image.png' }}
                    style={styles.productImage}
                />
            </TouchableOpacity>
            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
                <Text style={styles.productPrice}>{parseFloat(item.price).toLocaleString()} VNĐ</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => handleProductDetailPress(item.id)}>
                <Text style={styles.buttonText}>Xem chi tiết</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return <Text>Đang tải sản phẩm tương tự...</Text>;
    }

    return (
        <View>
            <FlatList
                data={similarProducts}
                numColumns={2}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.id}
                columnWrapperStyle={styles.columnWrapper} // Căn chỉnh đều giữa các cột
            />
        </View>
    );
};

const styles = StyleSheet.create({
    historyItemContainer: {
        width: width / 2 - 30, // Đảm bảo mỗi sản phẩm chiếm nửa màn hình, trừ đi khoảng cách
        margin: 5,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        alignItems: 'center',
        marginBottom: 15,
    },
    productImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    productInfo: {
        width: '100%',
        paddingHorizontal: 5,
        alignItems: 'center',
    },
    productName: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    productPrice: {
        fontSize: 12,
        color: 'red',
        marginTop: 5,
        textAlign: 'center',
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
    columnWrapper: {
        justifyContent: 'space-between',
        
    },
    
});

export default SimilarProducts;
