import { MLProduct } from '@/types';

export const mockProducts: MLProduct[] = [
  // iPhones
  {
    id: 'MLM001',
    title: 'iPhone 15 Pro Max 256GB Titanio Natural',
    price: 28999,
    currency_id: 'MXN',
    thumbnail: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro-max.jpg',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/iphone-15-pro-max',
    seller: {
      id: 123456,
      nickname: 'Apple Store Oficial',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 32999,
    available_quantity: 50,
    sold_quantity: 245,
    specs: {
      ram: '8GB',
      storage: '256GB',
      processor: 'A17 Pro',
      screen: {
        size: '6.7"',
        type: 'Super Retina XDR OLED',
        refresh: 120
      },
      camera: {
        main: '48MP',
        ultrawide: '12MP',
        telephoto: '12MP (5x zoom óptico)',
        front: '12MP TrueDepth'
      },
      battery: {
        capacity: '4441mAh',
        charging: '27W rápida, 15W MagSafe, 7.5W Qi'
      },
      connectivity: ['5G', 'WiFi 6E', 'NFC', 'Bluetooth 5.3', 'USB-C', 'Ultra Wideband'],
      os: 'iOS 17',
      weight: 221,
      waterResistance: 'IP68 (6m hasta 30 min)'
    },
    relatedProducts: ['ACC001', 'ACC002', 'ACC003']
  },
  {
    id: 'MLM002',
    title: 'iPhone 15 128GB Azul',
    price: 19999,
    currency_id: 'MXN',
    thumbnail: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/iphone-15',
    seller: {
      id: 123456,
      nickname: 'Apple Store Oficial',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 22999,
    available_quantity: 100,
    sold_quantity: 567,
    specs: {
      ram: '6GB',
      storage: '128GB',
      processor: 'A16 Bionic',
      screen: {
        size: '6.1"',
        type: 'Super Retina XDR OLED',
        refresh: 60
      },
      camera: {
        main: '48MP',
        ultrawide: '12MP',
        front: '12MP TrueDepth'
      },
      battery: {
        capacity: '3349mAh',
        charging: '20W rápida, 15W MagSafe'
      },
      connectivity: ['5G', 'WiFi 6', 'NFC', 'Bluetooth 5.3', 'USB-C'],
      os: 'iOS 17',
      weight: 171,
      waterResistance: 'IP68'
    },
    relatedProducts: ['ACC004', 'ACC002']
  },
  {
    id: 'MLM002-256',
    title: 'iPhone 15 256GB Azul',
    price: 23999,
    currency_id: 'MXN',
    thumbnail: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/iphone-15',
    seller: {
      id: 123456,
      nickname: 'Apple Store Oficial',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 25999,
    available_quantity: 30,
    sold_quantity: 120,
    specs: {
      ram: '6GB',
      storage: '256GB',
      processor: 'A16 Bionic',
      screen: {
        size: '6.1"',
        type: 'Super Retina XDR OLED',
        refresh: 60
      },
      camera: {
        main: '48MP',
        ultrawide: '12MP',
        front: '12MP TrueDepth'
      },
      battery: {
        capacity: '3349mAh',
        charging: '20W rápida, 15W MagSafe'
      },
      connectivity: ['5G', 'WiFi 6', 'NFC', 'Bluetooth 5.3', 'USB-C'],
      os: 'iOS 17',
      weight: 171,
      waterResistance: 'IP68'
    },
    relatedProducts: ['ACC004', 'ACC002']
  },
  {
    id: 'MLM002-256-negro',
    title: 'iPhone 15 256GB Negro',
    price: 23999,
    currency_id: 'MXN',
    thumbnail: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/iphone-15',
    seller: {
      id: 123456,
      nickname: 'Apple Store Oficial',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 25999,
    available_quantity: 40,
    sold_quantity: 150,
    specs: {
      ram: '6GB',
      storage: '256GB',
      processor: 'A16 Bionic',
      screen: {
        size: '6.1"',
        type: 'Super Retina XDR OLED',
        refresh: 60
      },
      camera: {
        main: '48MP',
        ultrawide: '12MP',
        front: '12MP TrueDepth'
      },
      battery: {
        capacity: '3349mAh',
        charging: '20W rápida, 15W MagSafe'
      },
      connectivity: ['5G', 'WiFi 6', 'NFC', 'Bluetooth 5.3', 'USB-C'],
      os: 'iOS 17',
      weight: 171,
      waterResistance: 'IP68'
    },
    relatedProducts: ['ACC004', 'ACC002']
  },
  {
    id: 'MLM002-256-morado',
    title: 'iPhone 15 256GB Morado',
    price: 23999,
    currency_id: 'MXN',
    thumbnail: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/iphone-15',
    seller: {
      id: 123456,
      nickname: 'Apple Store Oficial',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 25999,
    available_quantity: 35,
    sold_quantity: 110,
    specs: {
      ram: '6GB',
      storage: '256GB',
      processor: 'A16 Bionic',
      screen: {
        size: '6.1"',
        type: 'Super Retina XDR OLED',
        refresh: 60
      },
      camera: {
        main: '48MP',
        ultrawide: '12MP',
        front: '12MP TrueDepth'
      },
      battery: {
        capacity: '3349mAh',
        charging: '20W rápida, 15W MagSafe'
      },
      connectivity: ['5G', 'WiFi 6', 'NFC', 'Bluetooth 5.3', 'USB-C'],
      os: 'iOS 17',
      weight: 171,
      waterResistance: 'IP68'
    },
    relatedProducts: ['ACC004', 'ACC002']
  },
  {
    id: 'MLM003',
    title: 'iPhone 14 Plus 256GB Morado',
    price: 18499,
    currency_id: 'MXN',
    thumbnail: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-plus.jpg',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/iphone-14-plus',
    seller: {
      id: 123456,
      nickname: 'Apple Store Oficial',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 21999,
    available_quantity: 75,
    sold_quantity: 432,
    specs: {
      ram: '6GB',
      storage: '256GB',
      processor: 'A15 Bionic',
      screen: {
        size: '6.7"',
        type: 'Super Retina XDR OLED',
        refresh: 60
      },
      camera: {
        main: '12MP',
        ultrawide: '12MP',
        front: '12MP TrueDepth'
      },
      battery: {
        capacity: '4325mAh',
        charging: '20W rápida, 15W MagSafe'
      },
      connectivity: ['5G', 'WiFi 6', 'NFC', 'Bluetooth 5.3', 'Lightning'],
      os: 'iOS 17',
      weight: 203,
      waterResistance: 'IP68'
    }
  },
  {
    id: 'MLM004',
    title: 'iPhone 13 128GB Starlight',
    price: 14999,
    currency_id: 'MXN',
    thumbnail: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13.jpg',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/iphone-13',
    seller: {
      id: 123456,
      nickname: 'Apple Store Oficial',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 17999,
    available_quantity: 120,
    sold_quantity: 891,
  },
  {
    id: 'MLM005',
    title: 'iPhone 15 Pro 256GB Titanio Negro',
    price: 26499,
    currency_id: 'MXN',
    thumbnail: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro.jpg',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/iphone-15-pro',
    seller: {
      id: 123456,
      nickname: 'Apple Store Oficial',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 29999,
    available_quantity: 60,
    sold_quantity: 334,
  },
  {
    id: 'MLM006',
    title: 'iPhone SE (3ra generación) 128GB Negro',
    price: 11999,
    currency_id: 'MXN',
    thumbnail: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-se-2022.jpg',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/iphone-se',
    seller: {
      id: 123456,
      nickname: 'Apple Store Oficial',
    },
    shipping: {
      free_shipping: true,
    },
    available_quantity: 200,
    sold_quantity: 678,
  },

  // Android - Samsung
  {
    id: 'MLM101',
    title: 'Samsung Galaxy S24 Ultra 256GB Titanio Gris',
    price: 27999,
    currency_id: 'MXN',
    thumbnail: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-ultra-5g-sm-s928-stylus.jpg',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/samsung-s24-ultra',
    seller: {
      id: 234567,
      nickname: 'Samsung Official Store',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 31999,
    available_quantity: 80,
    sold_quantity: 289,
    specs: {
      ram: '12GB',
      storage: '256GB',
      processor: 'Snapdragon 8 Gen 3',
      screen: {
        size: '6.8"',
        type: 'Dynamic AMOLED 2X',
        refresh: 120
      },
      camera: {
        main: '200MP',
        ultrawide: '12MP',
        telephoto: '50MP (5x) + 10MP (3x)',
        front: '12MP'
      },
      battery: {
        capacity: '5000mAh',
        charging: '45W rápida, 15W inalámbrica'
      },
      connectivity: ['5G', 'WiFi 7', 'NFC', 'Bluetooth 5.3', 'USB-C', 'S Pen'],
      os: 'Android 14 (One UI 6)',
      weight: 233,
      waterResistance: 'IP68'
    }
  },
  {
    id: 'MLM102',
    title: 'Samsung Galaxy S23 256GB Verde',
    price: 16999,
    currency_id: 'MXN',
    thumbnail: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-5g.jpg',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/samsung-s23',
    seller: {
      id: 234567,
      nickname: 'Samsung Official Store',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 19999,
    available_quantity: 150,
    sold_quantity: 456,
  },
  {
    id: 'MLM103',
    title: 'Samsung Galaxy A54 5G 256GB Negro',
    price: 8999,
    currency_id: 'MXN',
    thumbnail: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a54.jpg',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/samsung-a54',
    seller: {
      id: 234567,
      nickname: 'Samsung Official Store',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 10999,
    available_quantity: 250,
    sold_quantity: 723,
  },
  {
    id: 'MLM104',
    title: 'Samsung Galaxy Z Fold5 512GB Phantom Black',
    price: 39999,
    currency_id: 'MXN',
    thumbnail: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold5.jpg',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/samsung-z-fold5',
    seller: {
      id: 234567,
      nickname: 'Samsung Official Store',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 44999,
    available_quantity: 30,
    sold_quantity: 124,
  },

  // Android - Google Pixel
  {
    id: 'MLM201',
    title: 'Google Pixel 8 Pro 256GB Obsidian',
    price: 22999,
    currency_id: 'MXN',
    thumbnail: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8-pro.jpg',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/pixel-8-pro',
    seller: {
      id: 345678,
      nickname: 'Google Store MX',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 25999,
    available_quantity: 60,
    sold_quantity: 198,
    specs: {
      ram: '12GB',
      storage: '256GB',
      processor: 'Google Tensor G3',
      screen: {
        size: '6.7"',
        type: 'LTPO OLED',
        refresh: 120
      },
      camera: {
        main: '50MP',
        ultrawide: '48MP',
        telephoto: '48MP (5x)',
        front: '10.5MP'
      },
      battery: {
        capacity: '5050mAh',
        charging: '30W rápida, 23W inalámbrica'
      },
      connectivity: ['5G', 'WiFi 7', 'NFC', 'Bluetooth 5.3', 'USB-C'],
      os: 'Android 14',
      weight: 213,
      waterResistance: 'IP68'
    }
  },
  {
    id: 'MLM202',
    title: 'Google Pixel 8 128GB Hazel',
    price: 17999,
    currency_id: 'MXN',
    thumbnail: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8.jpg',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/pixel-8',
    seller: {
      id: 345678,
      nickname: 'Google Store MX',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 20999,
    available_quantity: 90,
    sold_quantity: 345,
  },

  // Android - Xiaomi
  {
    id: 'MLM301',
    title: 'Xiaomi 13 Pro 256GB Negro',
    price: 15999,
    currency_id: 'MXN',
    thumbnail: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-13-pro-black.jpg',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/xiaomi-13-pro',
    seller: {
      id: 456789,
      nickname: 'Xiaomi Store Oficial',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 18999,
    available_quantity: 120,
    sold_quantity: 567,
  },
  {
    id: 'MLM302',
    title: 'Xiaomi Redmi Note 13 Pro 256GB Azul',
    price: 6999,
    currency_id: 'MXN',
    thumbnail: 'https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-13-pro-5g.jpg',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/redmi-note-13-pro',
    seller: {
      id: 456789,
      nickname: 'Xiaomi Store Oficial',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 8999,
    available_quantity: 300,
    sold_quantity: 892,
  },

  // Android - Motorola
  {
    id: 'MLM401',
    title: 'Motorola Edge 40 Pro 256GB Interstellar Black',
    price: 13999,
    currency_id: 'MXN',
    thumbnail: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-edge-40-pro.jpg',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/moto-edge-40-pro',
    seller: {
      id: 567890,
      nickname: 'Motorola Oficial',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 16999,
    available_quantity: 85,
    sold_quantity: 234,
  },
  {
    id: 'MLM402',
    title: 'Motorola Moto G84 5G 256GB Azul',
    price: 5999,
    currency_id: 'MXN',
    thumbnail: 'https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g84.jpg',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/moto-g84',
    seller: {
      id: 567890,
      nickname: 'Motorola Oficial',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 7999,
    available_quantity: 180,
    sold_quantity: 645,
  },

  // Android - OnePlus
  {
    id: 'MLM501',
    title: 'OnePlus 12 256GB Negro',
    price: 24999,
    currency_id: 'MXN',
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/oneplus-12',
    seller: {
      id: 678901,
      nickname: 'OnePlus Store',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 27999,
    available_quantity: 45,
    sold_quantity: 156,
    specs: {
      ram: '16GB',
      storage: '256GB',
      processor: 'Snapdragon 8 Gen 3',
      screen: {
        size: '6.82"',
        type: 'AMOLED LTPO',
        refresh: 120
      },
      camera: {
        main: '50MP',
        ultrawide: '48MP',
        telephoto: '64MP (3x)',
        front: '32MP'
      },
      battery: {
        capacity: '5400mAh',
        charging: '100W rápida, 50W inalámbrica'
      },
      connectivity: ['5G', 'WiFi 7', 'NFC', 'Bluetooth 5.3', 'USB-C'],
      os: 'Android 14 (OxygenOS 14)',
      weight: 220,
      waterResistance: 'IP65'
    }
  },
  {
    id: 'MLM502',
    title: 'OnePlus Nord 3 5G 256GB Gris',
    price: 10999,
    currency_id: 'MXN',
    thumbnail: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/oneplus-nord-3',
    seller: {
      id: 678901,
      nickname: 'OnePlus Store',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 12999,
    available_quantity: 95,
    sold_quantity: 342,
  },

  // Android - Nothing Phone
  {
    id: 'MLM601',
    title: 'Nothing Phone 2 256GB Blanco',
    price: 18999,
    currency_id: 'MXN',
    thumbnail: 'https://images.unsplash.com/photo-1592286927505-c7c8c72c0c76?w=400&h=400&fit=crop',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/nothing-phone-2',
    seller: {
      id: 789012,
      nickname: 'Nothing Store MX',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 21999,
    available_quantity: 55,
    sold_quantity: 189,
    specs: {
      ram: '12GB',
      storage: '256GB',
      processor: 'Snapdragon 8+ Gen 1',
      screen: {
        size: '6.7"',
        type: 'AMOLED LTPO',
        refresh: 120
      },
      camera: {
        main: '50MP',
        ultrawide: '50MP',
        front: '32MP'
      },
      battery: {
        capacity: '4700mAh',
        charging: '45W rápida, 15W inalámbrica, 5W inversa'
      },
      connectivity: ['5G', 'WiFi 6E', 'NFC', 'Bluetooth 5.3', 'USB-C'],
      os: 'Android 14 (Nothing OS 2.5)',
      weight: 201,
      waterResistance: 'IP54'
    }
  },

  // Gama Económica - Más opciones
  {
    id: 'MLM701',
    title: 'Realme 11 Pro 256GB Verde',
    price: 7499,
    currency_id: 'MXN',
    thumbnail: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&h=400&fit=crop',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/realme-11-pro',
    seller: {
      id: 890123,
      nickname: 'Realme Store',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 9499,
    available_quantity: 200,
    sold_quantity: 534,
  },
  {
    id: 'MLM702',
    title: 'Samsung Galaxy A34 5G 128GB Negro',
    price: 6499,
    currency_id: 'MXN',
    thumbnail: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/samsung-a34',
    seller: {
      id: 234567,
      nickname: 'Samsung Official Store',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 8499,
    available_quantity: 280,
    sold_quantity: 789,
  },
  {
    id: 'MLM703',
    title: 'Xiaomi Redmi 13C 128GB Azul',
    price: 3499,
    currency_id: 'MXN',
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/redmi-13c',
    seller: {
      id: 456789,
      nickname: 'Xiaomi Store Oficial',
    },
    shipping: {
      free_shipping: true,
    },
    available_quantity: 400,
    sold_quantity: 1234,
  },
  {
    id: 'MLM704',
    title: 'Motorola Moto G54 5G 128GB Grafito',
    price: 4499,
    currency_id: 'MXN',
    thumbnail: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=400&fit=crop',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/moto-g54',
    seller: {
      id: 567890,
      nickname: 'Motorola Oficial',
    },
    shipping: {
      free_shipping: true,
    },
    available_quantity: 350,
    sold_quantity: 978,
  },

  // Gama Premium - Más opciones
  {
    id: 'MLM801',
    title: 'Samsung Galaxy S24+ 512GB Violeta',
    price: 32999,
    currency_id: 'MXN',
    thumbnail: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b7?w=400&h=400&fit=crop',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/samsung-s24-plus',
    seller: {
      id: 234567,
      nickname: 'Samsung Official Store',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 36999,
    available_quantity: 50,
    sold_quantity: 178,
  },
  {
    id: 'MLM802',
    title: 'Xiaomi 14 Ultra 512GB Negro',
    price: 34999,
    currency_id: 'MXN',
    thumbnail: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/xiaomi-14-ultra',
    seller: {
      id: 456789,
      nickname: 'Xiaomi Store Oficial',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 38999,
    available_quantity: 35,
    sold_quantity: 145,
    specs: {
      ram: '16GB',
      storage: '512GB',
      processor: 'Snapdragon 8 Gen 3',
      screen: {
        size: '6.73"',
        type: 'AMOLED LTPO',
        refresh: 120
      },
      camera: {
        main: '50MP',
        ultrawide: '50MP',
        telephoto: '50MP (3.2x) + 50MP (5x)',
        front: '32MP'
      },
      battery: {
        capacity: '5300mAh',
        charging: '90W rápida, 80W inalámbrica'
      },
      connectivity: ['5G', 'WiFi 7', 'NFC', 'Bluetooth 5.4', 'USB-C'],
      os: 'Android 14 (HyperOS)',
      weight: 229,
      waterResistance: 'IP68'
    }
  },
  {
    id: 'MLM803',
    title: 'Google Pixel 8 Pro 512GB Bay',
    price: 29999,
    currency_id: 'MXN',
    thumbnail: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/pixel-8-pro-512',
    seller: {
      id: 345678,
      nickname: 'Google Store MX',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 33999,
    available_quantity: 40,
    sold_quantity: 167,
  },
  {
    id: 'MLM804',
    title: 'Samsung Galaxy Z Flip5 256GB Crema',
    price: 24999,
    currency_id: 'MXN',
    thumbnail: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/samsung-z-flip5',
    seller: {
      id: 234567,
      nickname: 'Samsung Official Store',
    },
    shipping: {
      free_shipping: true,
    },
    original_price: 28999,
    available_quantity: 65,
    sold_quantity: 234,
  },
  // Accesorios
  {
    id: 'ACC001',
    title: 'Funda MagSafe Transparente para iPhone 15 Pro Max',
    price: 999,
    currency_id: 'MXN',
    thumbnail: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MT233?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1693248280978',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/funda-iphone-15-pro-max',
    seller: {
      id: 123456,
      nickname: 'Apple Store Oficial',
    },
    shipping: {
      free_shipping: true,
    },
    specs: {
      ram: 'N/A',
      storage: 'N/A',
      processor: 'N/A',
      screen: { size: 'N/A', type: 'N/A', refresh: 0 },
      camera: { main: 'N/A', front: 'N/A' },
      battery: { capacity: 'N/A', charging: 'MagSafe' },
      connectivity: [],
      os: 'N/A',
      weight: 30,
      waterResistance: 'N/A'
    }
  },
  {
    id: 'ACC002',
    title: 'Cargador Apple 20W USB-C',
    price: 549,
    currency_id: 'MXN',
    thumbnail: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MHXH3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1603996255000',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/cargador-apple-20w',
    seller: {
      id: 123456,
      nickname: 'Apple Store Oficial',
    },
    shipping: {
      free_shipping: false,
    },
    specs: {
      ram: 'N/A',
      storage: 'N/A',
      processor: 'N/A',
      screen: { size: 'N/A', type: 'N/A', refresh: 0 },
      camera: { main: 'N/A', front: 'N/A' },
      battery: { capacity: 'N/A', charging: '20W' },
      connectivity: ['USB-C'],
      os: 'N/A',
      weight: 50,
      waterResistance: 'N/A'
    }
  },
  {
    id: 'ACC003',
    title: 'Protector de Pantalla Belkin UltraGlass 2 para iPhone 15 Pro Max',
    price: 799,
    currency_id: 'MXN',
    thumbnail: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/HR1W2?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1693248280978',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/protector-belkin-iphone',
    seller: {
      id: 789012,
      nickname: 'Belkin Oficial',
    },
    shipping: {
      free_shipping: true,
    },
    specs: {
      ram: 'N/A',
      storage: 'N/A',
      processor: 'N/A',
      screen: { size: 'N/A', type: 'Vidrio Templado', refresh: 0 },
      camera: { main: 'N/A', front: 'N/A' },
      battery: { capacity: 'N/A', charging: 'N/A' },
      connectivity: [],
      os: 'N/A',
      weight: 10,
      waterResistance: 'N/A'
    }
  },
  {
    id: 'ACC004',
    title: 'Funda de Silicona con MagSafe para iPhone 15 - Azul Tormenta',
    price: 1199,
    currency_id: 'MXN',
    thumbnail: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MT1F3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1693248280978',
    condition: 'new',
    permalink: 'https://www.mercadolibre.com.mx/funda-silicona-iphone-15',
    seller: {
      id: 123456,
      nickname: 'Apple Store Oficial',
    },
    shipping: {
      free_shipping: true,
    },
    specs: {
      ram: 'N/A',
      storage: 'N/A',
      processor: 'N/A',
      screen: { size: 'N/A', type: 'N/A', refresh: 0 },
      camera: { main: 'N/A', front: 'N/A' },
      battery: { capacity: 'N/A', charging: 'MagSafe' },
      connectivity: [],
      os: 'N/A',
      weight: 30,
      waterResistance: 'N/A'
    }
  }
];

// Función para buscar productos por término
export function searchMockProducts(query: string, limit: number = 20, filters?: any): MLProduct[] {
  const lowerQuery = (query || '').toLowerCase();

  //  Si se proporcionan filtros, usarlos
  if (filters) {
    console.log(`🔍 Buscando con filtros:`, filters);
    const filtered = mockProducts.filter(product => {
      // Filtro de Precio
      if (filters.price) {
        if (filters.price.min && product.price < filters.price.min) return false;
        if (filters.price.max && product.price > filters.price.max) return false;
      }

      // Filtro de Marca
      if (filters.brands && filters.brands.length > 0) {
        const productTitle = product.title.toLowerCase();
        const sellerName = product.seller?.nickname?.toLowerCase() || '';

        const hasBrand = filters.brands.some((brand: string) => {
          const lowerBrand = brand.toLowerCase();
          // Match title or seller
          if (productTitle.includes(lowerBrand) || sellerName.includes(lowerBrand)) return true;

          // Aliases
          if (lowerBrand === 'apple' && productTitle.includes('iphone')) return true;
          if (lowerBrand === 'iphone' && productTitle.includes('apple')) return true;

          return false;
        });

        if (!hasBrand) return false;
      }

      // Filtro de RAM
      if (filters.ram && filters.ram.length > 0) {
        // Normalize: remove spaces, lowercase
        const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '');

        // Check specs first
        if (product.specs?.ram) {
          if (!filters.ram.some((r: string) => normalize(r) === normalize(product.specs!.ram))) return false;
        } else {
          // Fallback to title check
          const hasRam = filters.ram.some((ram: string) => normalize(product.title).includes(normalize(ram)));
          if (!hasRam) return false;
        }
      }

      // Filtro de Almacenamiento
      if (filters.storage && filters.storage.length > 0) {
        // Normalize: remove spaces, lowercase
        const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '');

        // Check specs first
        if (product.specs?.storage) {
          if (!filters.storage.some((s: string) => normalize(s) === normalize(product.specs!.storage))) return false;
        } else {
          // Fallback to title check
          const hasStorage = filters.storage.some((storage: string) => normalize(product.title).includes(normalize(storage)));
          if (!hasStorage) return false;
        }
      }

      // Filtro de Color (NUEVO)
      if (filters.colors && filters.colors.length > 0) {
        const productTitle = product.title.toLowerCase();
        const hasColor = filters.colors.some((color: string) => productTitle.includes(color.toLowerCase()));
        if (!hasColor) return false;
      }

      // Buscar término en el título si no es solo una búsqueda de filtros puros
      // Si query es vacío o es una búsqueda de precio, ignorar texto
      if (query && !query.match(/entre|menos|más|pesos/i)) {
        // Palabras genéricas que deben ignorarse (son categorías, no búsquedas específicas)
        const genericWords = ['celular', 'celulares', 'teléfono', 'teléfonos', 'telefono', 'telefonos', 'smartphone', 'smartphones', 'móvil', 'móviles', 'movil', 'moviles'];

        // Si el query es solo una palabra genérica, ignorar este filtro (mostrar todos)
        if (genericWords.includes(lowerQuery.trim())) {
          return true;
        }

        // Lógica de búsqueda por palabras clave (reutilizada)
        // Ignorar palabras comunes de conexión como "de", "con", "el", "la"
        const queryWords = lowerQuery.split(' ').filter(word => word.length > 2 && !['con', 'del', 'los', 'las', 'para'].includes(word) && !genericWords.includes(word));

        // Si después de filtrar no quedan palabras, mostrar todos
        if (queryWords.length === 0) {
          return true;
        }

        if (queryWords.length <= 1) {
          return product.title.toLowerCase().includes(lowerQuery);
        }

        // IMPORTANTE: Cambiado de .some() a .every() para que "iphone azul" requiera AMBOS términos
        // Excepción: si es una lista de marcas, podría ser OR, pero para búsqueda general AND es mejor
        return queryWords.every(word => product.title.toLowerCase().includes(word));
      }
      return true;
    });

    console.log(`📦 Productos filtrados: ${filtered.length}`);
    return filtered.slice(0, limit);
  }

  // Detectar si es una búsqueda por precio
  const pricePatterns = [
    /precio/i,
    /similar al/i,
    /rango de precio/i,
    /más barato que/i,
    /más caro que/i,
    /entre.*y.*pesos/i,
    /menos de.*pesos/i,
    /más de.*pesos/i,
    /alrededor de.*pesos/i,
  ];

  const isPriceSearch = pricePatterns.some(pattern => pattern.test(query));

  console.log(`🔎 Búsqueda: "${query}", isPriceSearch: ${isPriceSearch}`);

  if (isPriceSearch) {
    // Buscar el producto mencionado en la consulta
    const brands = ['iphone', 'samsung', 'galaxy', 'pixel', 'xiaomi', 'motorola', 'moto', 'redmi'];
    let referenceProduct: MLProduct | undefined;

    for (const brand of brands) {
      if (lowerQuery.includes(brand)) {
        referenceProduct = mockProducts.find(p =>
          p.title.toLowerCase().includes(brand)
        );
        if (referenceProduct) break;
      }
    }

    if (referenceProduct) {
      // Buscar productos con precio similar (± 30%)
      const minPrice = referenceProduct.price * 0.7;
      const maxPrice = referenceProduct.price * 1.3;

      const filtered = mockProducts.filter(product =>
        product.price >= minPrice &&
        product.price <= maxPrice &&
        product.id !== referenceProduct.id // Excluir el producto de referencia
      ).sort((a, b) => {
        // Ordenar por cercanía al precio de referencia
        const diffA = Math.abs(a.price - referenceProduct.price);
        const diffB = Math.abs(b.price - referenceProduct.price);
        return diffA - diffB;
      });

      return filtered.slice(0, limit);
    }

    // Si menciona un rango específico de precio
    // Primero normalizar "mil" y "k" a números
    const normalizedQuery = query
      .replace(/(\d+)\s*mil/gi, (match, num) => String(parseInt(num) * 1000))
      .replace(/(\d+)\s*k/gi, (match, num) => String(parseInt(num) * 1000));

    // "entre X y Y"
    const rangeMatch = normalizedQuery.match(/entre\s+(\d+)\s+y\s+(\d+)/i);
    if (rangeMatch) {
      const min = parseInt(rangeMatch[1]);
      const max = parseInt(rangeMatch[2]);
      const filtered = mockProducts.filter(product =>
        product.price >= min && product.price <= max
      );
      return filtered.slice(0, limit);
    }

    // Si menciona "menos de X pesos" o "hasta X" o "máximo X"
    const lessPatterns = [
      /menos de\s+(\d+)/,
      /hasta\s+(\d+)/,
      /máximo\s+(\d+)/,
      /de\s+(\d+)\s+(?:pesos?\s+)?o\s+menos/,
      /no\s+más\s+de\s+(\d+)/,
    ];

    for (const pattern of lessPatterns) {
      const match = normalizedQuery.match(pattern);
      if (match) {
        const maxPrice = parseInt(match[1]);
        const filtered = mockProducts.filter(product => product.price <= maxPrice);
        return filtered.slice(0, limit);
      }
    }

    // Si menciona "más de X pesos" o "desde X" o "a partir de X" o "mínimo X"
    const morePatterns = [
      /más de\s+(\d+)/,
      /de\s+(\d+)\s+(?:pesos?\s+)?o\s+más/,
      /desde\s+(\d+)/,
      /a\s+partir\s+de\s+(\d+)/,
      /mínimo\s+(\d+)/,
      /arriba\s+de\s+(\d+)/,
    ];

    for (const pattern of morePatterns) {
      const match = normalizedQuery.match(pattern);
      if (match) {
        const minPrice = parseInt(match[1]);
        const filtered = mockProducts.filter(product => product.price >= minPrice);
        return filtered.slice(0, limit);
      }
    }
  }

  // Búsqueda normal por texto en el título
  // Mejorar búsqueda para manejar consultas multi-palabra
  const queryWords = lowerQuery.split(' ').filter(word => word.length > 2); // Filtrar palabras muy cortas

  console.log(`🔤 Query words:`, queryWords);

  const filtered = mockProducts.filter(product => {
    const productText = product.title.toLowerCase();

    // Si es una sola palabra o frase corta, buscar coincidencia directa
    if (queryWords.length <= 1) {
      return productText.includes(lowerQuery);
    }

    // Para búsquedas multi-palabra, buscar que coincida al menos una palabra significativa
    // Palabras clave de búsqueda común
    const productKeywords = ['celular', 'teléfono', 'smartphone', 'móvil', 'phone', 'celulares', 'teléfonos'];
    const colorKeywords = ['negro', 'blanco', 'azul', 'rojo', 'verde', 'morado', 'rosa', 'dorado', 'plateado', 'titanio'];

    // Verificar si hay palabra de producto genérico
    const hasProductKeyword = queryWords.some(word =>
      productKeywords.includes(word) || productKeywords.includes(word.replace(/s$/, ''))
    );

    // Si busca por producto genérico (ej: "teléfonos negros"), retornar todos
    if (hasProductKeyword) {
      // Si también menciona color, filtrar por color en el título
      // Normalizar el color (quitar 's' del plural)
      const colorInQuery = queryWords.find(word => {
        const normalized = word.replace(/s$/, ''); // Quitar 's' final para manejar plurales
        return colorKeywords.includes(normalized);
      });

      if (colorInQuery) {
        const normalizedColor = colorInQuery.replace(/s$/, '');
        console.log(`🎨 Color detectado: "${colorInQuery}" → normalizado: "${normalizedColor}"`);
        const matches = productText.includes(normalizedColor);
        if (matches) {
          console.log(`✅ Match: ${product.title}`);
        }
        return matches;
      }
      // Si solo busca "teléfonos" o "celulares", retornar todos
      return true;
    }

    // Para otras búsquedas, buscar coincidencia de cualquier palabra
    return queryWords.some(word => productText.includes(word));
  });

  console.log(`📦 Total productos filtrados: ${filtered.length}`);
  return filtered.slice(0, limit);
}

// Función para obtener productos aleatorios
export function getFeaturedMockProducts(limit: number = 12): MLProduct[] {
  const shuffled = [...mockProducts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
}
