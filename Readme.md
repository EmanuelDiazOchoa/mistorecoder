# 🍞 Roma Store

Aplicación móvil de ecommerce para una panadería artesanal, desarrollada con **React Native + Expo**. Diseño premium dark mode, autenticación con Firebase, carrito persistido y más.


---

## 🚀 Funcionalidades

- ✅ Login y registro con Firebase Auth (email + Google)
- ✅ Sesión persistente con SQLite — no requiere login en cada apertura
- ✅ Productos desde Firebase Realtime Database con imágenes reales
- ✅ Carrito con control de cantidades y persistencia local
- ✅ Favoritos persistidos con AsyncStorage
- ✅ Historial de pedidos
- ✅ Filtros por categoría con scroll horizontal
- ✅ Skeleton loaders mientras cargan los productos
- ✅ Notificación local al confirmar pedido
- ✅ Ubicación del usuario en tiempo real
- ✅ Animaciones con React Native Animated API
- ✅ Tab bar personalizado con SVG icons

---

## 🧰 Stack tecnológico

| Tecnología | Uso |
|---|---|
| React Native + Expo SDK 55 | Base de la app |
| Firebase Auth | Autenticación |
| Firebase Realtime Database | Productos |
| Redux Toolkit | Estado global |
| AsyncStorage | Carrito y favoritos |
| expo-sqlite | Sesión persistente |
| expo-notifications | Notificaciones locales |
| expo-location | Ubicación del usuario |
| React Navigation | Navegación stack + tabs |
| react-native-svg | Iconos del tab bar |
| react-native-reanimated | Animaciones avanzadas |

---

## ⚙️ Instalación

### Requisitos
- Node.js 18+
- Expo CLI
- Cuenta en Firebase

### Pasos
```bash
# 1. Clonar el repositorio
git clone https://github.com/EmanuelDiazOchoa/mistorecoder
cd mistorecoder

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Completar .env con tus credenciales de Firebase

# 4. Iniciar el proyecto
npx expo start --dev-client
```

### Variables de entorno

Crear un archivo `.env` en la raíz con:
```
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_DATABASE_URL=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

---

## 🗄️ Estructura de Firebase

Los productos en Realtime Database siguen esta estructura:
```json
{
  "products": {
    "1": {
      "id": 1,
      "name": "Pan de campo",
      "category": "pan",
      "price": 100,
      "image": "https://..."
    }
  }
}
```

**Categorías disponibles:** `pan`, `torta`, `galletitas`, `donas`, `budin`, `chocolate`

---

## 📁 Estructura del proyecto
```
src/
├── components/          # ProductCard, SearchBar, SkeletonCard, EmptyState
├── features/auth/       # authSlice
├── hooks/               # useTheme
├── navigation/          # StackNavigator, BottomTabNavigator
├── redux/               # store, cartSlice, favoritesSlice, ordersSlice...
├── screens/             # Home, Cart, Categories, Details, Orders, Profile...
├── service/             # firebase.js, sessionStorage.js
├── theme/               # index.js (colores dark/light)
└── utils/               # productImages.js
```

---

## 👤 Autor

**Emanuel Diaz Ochoa**
[GitHub](https://github.com/EmanuelDiazOchoa)

---

## 📄 Licencia

MIT