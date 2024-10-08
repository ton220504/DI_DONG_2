// src/data/products.ts
export interface Product {
    id: string;
    image: any; // Đường dẫn đến hình ảnh sản phẩm
    name: string;
    price: string;
  }
  
  export const PRODUCTS: Product[] = [
    { id: '1', image: require('@/assets/images/product20.png'), name: 'NIKE ZOOM MERCURIAL VAPOR 15 PRO TF - DJ5605-601 - HỒNG/ĐEN', price: '2,690,000₫' },
    { id: '2', image: require('@/assets/images/product21.png'), name: 'NIKE ZOOM MERCURIAL VAPOR 15 PRO TF - DJ5605-700 - TRẮNG KEM', price: '2,690,000₫' },
    { id: '3', image: require('@/assets/images/product22.png'), name: 'ADIDAS F50 PRO TF - IF1323 - TRẮNG/XANH', price: '2,990,000₫' },
    { id: '4', image: require('@/assets/images/product23.png'), name: 'NIKE PHANTOM GX 2 ACADEMY TF - FJ2577-400 - XANH BIỂN', price: '2,590,000₫' },
    { id: '5', image: require('@/assets/images/product24.png'), name: 'NIKE PHANTOM GX 2 ACADEMY LV8 TF - FJ2576-300 - XANH NGỌC', price: '2,330,000₫' },
    { id: '6', image: require('@/assets/images/product25.png'), name: 'ADIDAS X CRAZYFAST ELITE TF - IF0663 - ĐỎ CAM', price: '2,690,000₫' },
    { id: '7', image: require('@/assets/images/product26.png'), name: 'ADIDAS PREDATOR ACCURACY.3 TF - GZ0007 - XANH DƯƠNG/TRẮNG', price: '2,990,000₫' },
    { id: '8', image: require('@/assets/images/product27.png'), name: 'ADIDAS X CRAZYFAST.3 TF - ID9338 - XANH NAVY', price: '2,550,000₫' },
  ];
  