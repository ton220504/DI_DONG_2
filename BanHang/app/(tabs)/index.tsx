import { Image, StyleSheet, Platform, View, TextInput, TouchableOpacity, Modal, Dimensions } from 'react-native';
import {
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  FlatList
} from 'react-native';

import ProductScreen from '../product/ProductScreen';
import { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

// Data banner
const DATA = [
  {
    id: 1,
    title: 'Giày đá banh Nike',
    image: require('@/assets/images/banner01.png'),
  },
  {
    id: 2,
    title: 'Giành đá banh Adidas',
    image: require('@/assets/images/banner02.png'),
  },
  {
    id: 3,
    title: 'Giành đá banh Mizuno',
    image: require('@/assets/images/banner03.png'),
  },
  {
    id: 3,
    title: 'Giành đá banh Puma',
    image: require('@/assets/images/banner04.png'),
  }
];

//data slide show
const banners = [
  require('@/assets/images/slideshow_2.png'),
  require('@/assets/images/slideshow_3.png'),
  require('@/assets/images/slideshow_4.png'),
  require('@/assets/images/slideshow_5.png'),
  require('@/assets/images/slideshow_7.png'),
  // Thêm các hình ảnh khác tại đây
];

const { width } = Dimensions.get('window');





const Item = ({ title, image }: { title: string; image: any }) => (
  <View style={styles.item}>
    <Image source={image} style={styles.itemImage} />
    <Text style={styles.title}>{title}</Text>
  </View>
);


export default function HomeScreen() {
  const [searchText, setSearchText] = useState<string>('');
  const [isMenuVisible, setMenuVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null); // Sử dụng ref để kiểm soát ScrollView
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = prevIndex === banners.length - 1 ? 0 : prevIndex + 1; // Chuyển hình hoặc quay về hình đầu tiên
        scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true }); // Cuộn đến hình tiếp theo
        return nextIndex;
      });
    }, 3000); // Thay đổi hình mỗi 3 giây

    return () => clearInterval(interval); // Xóa interval khi component bị hủy
  }, []);


  const handleSearch = (text: string) => {
    setSearchText(text);
    // Thực hiện các thao tác tìm kiếm ở đây, ví dụ: gọi API hoặc lọc danh sách
  };

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };
  return (

    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm..."
            value={searchText}
            onChangeText={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton}>
            {/* <Text style={styles.searchButtonText}>Tìm</Text> */}
            <Ionicons name="search-outline" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerRight}>

            {/* Menu Icon */}
            <TouchableOpacity onPress={toggleMenu}>
              <Ionicons name="menu-outline" size={30} color="gray" style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          </View>
          {/* Menu Modal */}
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
        </View>


        <View style={styles.bannerContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false} // Ẩn thanh cuộn ngang
            scrollEnabled={false} // Tắt cuộn tay (chỉ tự động chuyển hình)
          >
            {banners.map((banner, index) => (
              <Image key={index} source={banner} style={styles.bannerImage} />
            ))}
          </ScrollView>
        </View>




        <Text style={styles.newProduct}>tìm theo thương hiệu</Text>
        <View style={styles.underline} />
        <FlatList
          data={DATA}
          numColumns={2} // Hiển thị 2 cột
          renderItem={({ item }) => <Item title={item.title} image={item.image} />}
          keyExtractor={item => item.id.toString()}
          columnWrapperStyle={styles.columnWrapper} // Căn chỉnh giữa các cột
        />


        <Text style={styles.newProduct}>Sản phẩm mới</Text>
        <View style={styles.underline} />



        <View>
          <ProductScreen />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    marginHorizontal: 20,
  },
  text: {
    marginTop: 40,
    fontSize: 42,
  },
  searchInput: {
    marginTop: 10,
    height: 40,
    width: 300,
    borderColor: '#ddd',
    borderWidth: 1,
    //borderRadius: 10,
    borderTopLeftRadius: 10,   // Bo tròn góc trái trên
    borderBottomLeftRadius: 10, // Bo tròn góc trái dưới
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },

  searchContainer: {
    flexDirection: 'row', // Đặt TextInput và nút theo hàng ngang
    alignItems: 'center', // Căn giữa theo chiều dọc
    marginBottom: 10,
  },
  searchButton: {
    borderBottomRightRadius: 10,   // Bo tròn góc trái trên
    borderTopRightRadius: 10, // Bo tròn góc trái dưới
    marginTop: 10,
    backgroundColor: 'gray',
    paddingHorizontal: 15,
    paddingVertical: 10,
    height: 40,

  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  newProduct: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,

  },
  underline: {
    marginTop: 5, // Khoảng cách giữa chữ và thanh
    width: '50%', // Độ dài thanh (bằng 50% độ rộng màn hình, bạn có thể điều chỉnh theo ý muốn)
    height: 2, // Độ dày của thanh ngang
    backgroundColor: 'black', // Màu sắc của thanh ngang
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerRight: {
    marginTop: 20,
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
  columnWrapper: {
    justifyContent: 'space-between', // Căn chỉnh khoảng cách đều giữa các cột
    marginBottom: 10, // Khoảng cách giữa các hàng
  },
  item: {
    flex: 1, // Giúp mỗi mục chiếm đủ không gian trong hàng
    marginHorizontal: 5, // Khoảng cách giữa các cột
    borderRadius: 8,

  },
  itemImage: {
    width: '100%', // Chiếm toàn bộ chiều rộng của mục
    height: 60, // Chiều cao của banner

    resizeMode: 'contain', // Đảm bảo ảnh không bị cắt
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  bannerContainer: {
    height: 150,
    width: 350,
  },
  bannerImage: {
    width, // Chiều rộng của hình ảnh bằng với chiều rộng màn hình
    height: '100%', // Chiều cao của hình ảnh chiếm toàn bộ chiều cao của container
    resizeMode: 'cover', // Đảm bảo hình ảnh vừa khung
  },

});