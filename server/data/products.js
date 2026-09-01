const products = [
  {
    name: "Dell Inspiron 15",
    price: 64999,
    image: "https://picsum.photos/seed/dell-inspiron/600/400",
    description: "Powerful laptop for students, developers and everyday professional work.",
    category: "Laptops",
    brand: "Dell",
    rating: 4.5,
    stock: 12
  },
  {
    name: "HP Pavilion 14",
    price: 58999,
    image: "https://picsum.photos/seed/hp-pavilion/600/400",
    description: "Slim and reliable laptop for study, office work and entertainment.",
    category: "Laptops",
    brand: "HP",
    rating: 4.4,
    stock: 15
  },
  {
    name: "Lenovo IdeaPad Slim 5",
    price: 61999,
    image: "https://picsum.photos/seed/lenovo-ideapad/600/400",
    description: "Balanced performance and portability for everyday computing.",
    category: "Laptops",
    brand: "Lenovo",
    rating: 4.6,
    stock: 10
  },
  {
    name: "ASUS VivoBook 15",
    price: 55999,
    image: "https://picsum.photos/seed/asus-vivobook/600/400",
    description: "Affordable laptop with a modern design and smooth performance.",
    category: "Laptops",
    brand: "ASUS",
    rating: 4.3,
    stock: 18
  },
  {
    name: "Acer Aspire 5",
    price: 52999,
    image: "https://picsum.photos/seed/acer-aspire/600/400",
    description: "Versatile laptop designed for work, study and casual entertainment.",
    category: "Laptops",
    brand: "Acer",
    rating: 4.2,
    stock: 20
  },

  {
    name: "Samsung Galaxy S24",
    price: 74999,
    image: "https://picsum.photos/seed/galaxy-s24/600/400",
    description: "Premium smartphone with a bright display and advanced camera system.",
    category: "Smartphones",
    brand: "Samsung",
    rating: 4.7,
    stock: 8
  },
  {
    name: "iPhone 15",
    price: 69999,
    image: "https://picsum.photos/seed/iphone15/600/400",
    description: "Powerful smartphone with excellent performance and camera quality.",
    category: "Smartphones",
    brand: "Apple",
    rating: 4.8,
    stock: 7
  },
  {
    name: "OnePlus 12",
    price: 64999,
    image: "https://picsum.photos/seed/oneplus12/600/400",
    description: "Fast and powerful smartphone with a smooth high-refresh-rate display.",
    category: "Smartphones",
    brand: "OnePlus",
    rating: 4.6,
    stock: 14
  },
  {
    name: "Google Pixel 8",
    price: 55999,
    image: "https://picsum.photos/seed/pixel8/600/400",
    description: "Smartphone with excellent photography and clean Android experience.",
    category: "Smartphones",
    brand: "Google",
    rating: 4.5,
    stock: 11
  },
  {
    name: "Nothing Phone 2",
    price: 39999,
    image: "https://picsum.photos/seed/nothing-phone/600/400",
    description: "Unique smartphone with a clean interface and distinctive design.",
    category: "Smartphones",
    brand: "Nothing",
    rating: 4.3,
    stock: 17
  },

  {
    name: "Sony WH-1000XM5",
    price: 29999,
    image: "https://picsum.photos/seed/sony-headphones/600/400",
    description: "Premium wireless headphones with immersive sound and noise cancellation.",
    category: "Audio",
    brand: "Sony",
    rating: 4.8,
    stock: 9
  },
  {
    name: "JBL Tune 770NC",
    price: 6999,
    image: "https://picsum.photos/seed/jbl-tune/600/400",
    description: "Wireless headphones with deep bass and active noise cancellation.",
    category: "Audio",
    brand: "JBL",
    rating: 4.4,
    stock: 22
  },
  {
    name: "Boat Rockerz 450",
    price: 1499,
    image: "https://picsum.photos/seed/boat-rockerz/600/400",
    description: "Affordable wireless headphones with long battery life.",
    category: "Audio",
    brand: "Boat",
    rating: 4.2,
    stock: 35
  },
  {
    name: "Apple AirPods Pro",
    price: 24999,
    image: "https://picsum.photos/seed/airpods-pro/600/400",
    description: "Compact wireless earbuds with noise cancellation and premium audio.",
    category: "Audio",
    brand: "Apple",
    rating: 4.7,
    stock: 13
  },
  {
    name: "Galaxy Buds 2 Pro",
    price: 11999,
    image: "https://picsum.photos/seed/galaxy-buds/600/400",
    description: "Premium wireless earbuds with clear sound and comfortable fit.",
    category: "Audio",
    brand: "Samsung",
    rating: 4.5,
    stock: 16
  },

  {
    name: "Logitech MX Master 3S",
    price: 8999,
    image: "https://picsum.photos/seed/mx-master/600/400",
    description: "Premium ergonomic wireless mouse designed for productivity.",
    category: "Accessories",
    brand: "Logitech",
    rating: 4.8,
    stock: 19
  },
  {
    name: "Logitech M331 Mouse",
    price: 1299,
    image: "https://picsum.photos/seed/logitech-mouse/600/400",
    description: "Quiet and comfortable wireless mouse for everyday work.",
    category: "Accessories",
    brand: "Logitech",
    rating: 4.3,
    stock: 40
  },
  {
    name: "Razer DeathAdder V2",
    price: 2999,
    image: "https://picsum.photos/seed/razer-mouse/600/400",
    description: "High-performance gaming mouse with ergonomic design.",
    category: "Gaming",
    brand: "Razer",
    rating: 4.6,
    stock: 21
  },
  {
    name: "HP Wireless Keyboard",
    price: 1699,
    image: "https://picsum.photos/seed/hp-keyboard/600/400",
    description: "Compact wireless keyboard suitable for home and office use.",
    category: "Accessories",
    brand: "HP",
    rating: 4.2,
    stock: 28
  },
  {
    name: "Keychron K2 Keyboard",
    price: 7999,
    image: "https://picsum.photos/seed/keychron/600/400",
    description: "Mechanical wireless keyboard for developers and enthusiasts.",
    category: "Gaming",
    brand: "Keychron",
    rating: 4.7,
    stock: 9
  },

  {
    name: "Apple Watch Series 9",
    price: 39999,
    image: "https://picsum.photos/seed/apple-watch/600/400",
    description: "Smartwatch with fitness tracking, notifications and premium design.",
    category: "Wearables",
    brand: "Apple",
    rating: 4.7,
    stock: 8
  },
  {
    name: "Samsung Galaxy Watch 6",
    price: 22999,
    image: "https://picsum.photos/seed/galaxy-watch/600/400",
    description: "Smartwatch with health tracking and a bright AMOLED display.",
    category: "Wearables",
    brand: "Samsung",
    rating: 4.5,
    stock: 13
  },
  {
    name: "Amazfit GTR 4",
    price: 14999,
    image: "https://picsum.photos/seed/amazfit/600/400",
    description: "Feature-rich smartwatch with long battery life and fitness tracking.",
    category: "Wearables",
    brand: "Amazfit",
    rating: 4.4,
    stock: 18
  },
  {
    name: "Noise ColorFit Pro",
    price: 3999,
    image: "https://picsum.photos/seed/noise-watch/600/400",
    description: "Affordable smartwatch with health and activity tracking features.",
    category: "Wearables",
    brand: "Noise",
    rating: 4.1,
    stock: 32
  },
  {
    name: "Fitbit Charge 6",
    price: 13999,
    image: "https://picsum.photos/seed/fitbit/600/400",
    description: "Fitness tracker focused on health, workouts and daily activity.",
    category: "Wearables",
    brand: "Fitbit",
    rating: 4.4,
    stock: 14
  },

  {
    name: "Dell 24-inch Monitor",
    price: 11999,
    image: "https://picsum.photos/seed/dell-monitor/600/400",
    description: "Full HD monitor ideal for office work, study and home use.",
    category: "Monitors",
    brand: "Dell",
    rating: 4.3,
    stock: 18
  },
  {
    name: "LG UltraGear 27-inch",
    price: 24999,
    image: "https://picsum.photos/seed/lg-ultragear/600/400",
    description: "Gaming monitor with fast refresh rate and immersive visuals.",
    category: "Monitors",
    brand: "LG",
    rating: 4.6,
    stock: 11
  },
  {
    name: "Samsung 27-inch 4K",
    price: 28999,
    image: "https://picsum.photos/seed/samsung-monitor/600/400",
    description: "Sharp 4K monitor for creative work and entertainment.",
    category: "Monitors",
    brand: "Samsung",
    rating: 4.5,
    stock: 9
  },
  {
    name: "BenQ Designer Monitor",
    price: 21999,
    image: "https://picsum.photos/seed/benq-monitor/600/400",
    description: "Color-focused monitor for designers and content creators.",
    category: "Monitors",
    brand: "BenQ",
    rating: 4.4,
    stock: 12
  },
  {
    name: "Acer Nitro Gaming Monitor",
    price: 17999,
    image: "https://picsum.photos/seed/acer-monitor/600/400",
    description: "Gaming monitor with smooth performance and responsive gameplay.",
    category: "Gaming",
    brand: "Acer",
    rating: 4.3,
    stock: 15
  },

  {
    name: "TP-Link WiFi Router",
    price: 2499,
    image: "https://picsum.photos/seed/tplink-router/600/400",
    description: "Reliable dual-band router for fast home internet connectivity.",
    category: "Networking",
    brand: "TP-Link",
    rating: 4.4,
    stock: 27
  },
  {
    name: "Netgear WiFi Router",
    price: 5499,
    image: "https://picsum.photos/seed/netgear-router/600/400",
    description: "High-performance router for larger homes and heavy usage.",
    category: "Networking",
    brand: "Netgear",
    rating: 4.5,
    stock: 12
  },
  {
    name: "TP-Link WiFi Extender",
    price: 1899,
    image: "https://picsum.photos/seed/wifi-extender/600/400",
    description: "Extend your WiFi coverage to eliminate dead zones at home.",
    category: "Networking",
    brand: "TP-Link",
    rating: 4.2,
    stock: 24
  },
  {
    name: "D-Link Gigabit Switch",
    price: 2299,
    image: "https://picsum.photos/seed/network-switch/600/400",
    description: "Compact network switch for reliable wired connectivity.",
    category: "Networking",
    brand: "D-Link",
    rating: 4.1,
    stock: 19
  },
  {
    name: "Amazon Echo Dot",
    price: 5499,
    image: "https://picsum.photos/seed/echo-dot/600/400",
    description: "Compact smart speaker for music, reminders and smart home control.",
    category: "Smart Home",
    brand: "Amazon",
    rating: 4.5,
    stock: 21
  },

  {
    name: "Kindle Paperwhite",
    price: 13999,
    image: "https://picsum.photos/seed/kindle/600/400",
    description: "Portable e-reader with a high-resolution glare-free display.",
    category: "Tablets",
    brand: "Amazon",
    rating: 4.8,
    stock: 10
  },
  {
    name: "iPad 10th Generation",
    price: 39999,
    image: "https://picsum.photos/seed/ipad/600/400",
    description: "Versatile tablet for study, entertainment and creative tasks.",
    category: "Tablets",
    brand: "Apple",
    rating: 4.7,
    stock: 8
  },
  {
    name: "Samsung Galaxy Tab S9",
    price: 64999,
    image: "https://picsum.photos/seed/galaxy-tab/600/400",
    description: "Premium Android tablet with powerful performance and vivid display.",
    category: "Tablets",
    brand: "Samsung",
    rating: 4.6,
    stock: 7
  },
  {
    name: "OnePlus Pad",
    price: 37999,
    image: "https://picsum.photos/seed/oneplus-pad/600/400",
    description: "Large-screen tablet designed for productivity and entertainment.",
    category: "Tablets",
    brand: "OnePlus",
    rating: 4.4,
    stock: 11
  },
  {
    name: "Lenovo Tab M10",
    price: 15999,
    image: "https://picsum.photos/seed/lenovo-tab/600/400",
    description: "Affordable family tablet for browsing, videos and study.",
    category: "Tablets",
    brand: "Lenovo",
    rating: 4.2,
    stock: 20
  },

  {
    name: "JBL Flip 6 Speaker",
    price: 9999,
    image: "https://picsum.photos/seed/jbl-speaker/600/400",
    description: "Portable Bluetooth speaker with powerful sound and waterproof design.",
    category: "Audio",
    brand: "JBL",
    rating: 4.7,
    stock: 17
  },
  {
    name: "Sony Bluetooth Speaker",
    price: 12999,
    image: "https://picsum.photos/seed/sony-speaker/600/400",
    description: "Compact wireless speaker delivering clear and rich audio.",
    category: "Audio",
    brand: "Sony",
    rating: 4.5,
    stock: 13
  },
  {
    name: "Boat Stone Speaker",
    price: 2999,
    image: "https://picsum.photos/seed/boat-speaker/600/400",
    description: "Budget-friendly portable speaker with punchy bass.",
    category: "Audio",
    brand: "Boat",
    rating: 4.2,
    stock: 30
  },
  {
    name: "Marshall Emberton",
    price: 15999,
    image: "https://picsum.photos/seed/marshall-speaker/600/400",
    description: "Stylish portable speaker with signature Marshall sound.",
    category: "Audio",
    brand: "Marshall",
    rating: 4.7,
    stock: 8
  },
  {
    name: "Anker Power Bank 20000mAh",
    price: 2499,
    image: "https://picsum.photos/seed/anker-powerbank/600/400",
    description: "High-capacity power bank for charging phones and accessories on the go.",
    category: "Accessories",
    brand: "Anker",
    rating: 4.6,
    stock: 26
  },

  {
    name: "Anker USB-C Hub",
    price: 3999,
    image: "https://picsum.photos/seed/usb-hub/600/400",
    description: "Multi-port USB-C hub for laptops, tablets and desktop setups.",
    category: "Accessories",
    brand: "Anker",
    rating: 4.5,
    stock: 16
  },
  {
    name: "Belkin USB-C Charger",
    price: 2999,
    image: "https://picsum.photos/seed/belkin-charger/600/400",
    description: "Fast and reliable charger for compatible smartphones and devices.",
    category: "Accessories",
    brand: "Belkin",
    rating: 4.4,
    stock: 23
  },
  {
    name: "Apple MagSafe Charger",
    price: 4499,
    image: "https://picsum.photos/seed/magsafe/600/400",
    description: "Magnetic wireless charger designed for compatible Apple devices.",
    category: "Accessories",
    brand: "Apple",
    rating: 4.6,
    stock: 10
  },
  {
    name: "Logitech C920 Webcam",
    price: 6999,
    image: "https://picsum.photos/seed/logitech-webcam/600/400",
    description: "Full HD webcam for video calls, online classes and streaming.",
    category: "Accessories",
    brand: "Logitech",
    rating: 4.5,
    stock: 18
  },
  {
    name: "Elgato Stream Deck",
    price: 14999,
    image: "https://picsum.photos/seed/stream-deck/600/400",
    description: "Customizable control deck for streaming and productivity workflows.",
    category: "Gaming",
    brand: "Elgato",
    rating: 4.7,
    stock: 6
  },

  {
    name: "PlayStation 5",
    price: 54999,
    image: "https://picsum.photos/seed/playstation5/600/400",
    description: "Next-generation gaming console with powerful performance.",
    category: "Gaming",
    brand: "Sony",
    rating: 4.9,
    stock: 5
  },
  {
    name: "Xbox Series X",
    price: 49999,
    image: "https://picsum.photos/seed/xbox-series-x/600/400",
    description: "High-performance gaming console with fast loading and 4K gaming.",
    category: "Gaming",
    brand: "Microsoft",
    rating: 4.8,
    stock: 7
  },
  {
    name: "Nintendo Switch OLED",
    price: 34999,
    image: "https://picsum.photos/seed/nintendo-switch/600/400",
    description: "Versatile gaming console for handheld and home entertainment.",
    category: "Gaming",
    brand: "Nintendo",
    rating: 4.7,
    stock: 9
  },
  {
    name: "Gaming Controller",
    price: 4999,
    image: "https://picsum.photos/seed/gaming-controller/600/400",
    description: "Comfortable wireless controller for gaming on multiple platforms.",
    category: "Gaming",
    brand: "GamePro",
    rating: 4.3,
    stock: 22
  },
  {
    name: "Gaming Mouse Pad",
    price: 999,
    image: "https://picsum.photos/seed/mouse-pad/600/400",
    description: "Large smooth mouse pad designed for accurate gaming movement.",
    category: "Gaming",
    brand: "GamePro",
    rating: 4.2,
    stock: 35
  }
];

export default products;