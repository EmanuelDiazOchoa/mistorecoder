<!-- markdownlint-disable MD033 -->

# 🍞 Roma Store

> Aplicación móvil de ecommerce para una panadería artesanal — Portfolio project

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-0.83-61DAFB?style=flat-square&logo=react)
![Expo](https://img.shields.io/badge/Expo-SDK_55-000020?style=flat-square&logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-11-FFCA28?style=flat-square&logo=firebase)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.8-764ABC?style=flat-square&logo=redux)

</div>

---

## 📸 Capturas

<div align="center">

| Login | Home | Detalle |
| :---: | :--: | :-----: |
| ![Login](assets/screenshots/login.webp) | ![Home](assets/screenshots/home.webp) | ![Detalle](assets/screenshots/detail.webp) |

| Carrito | Pedido confirmado | Perfil |
| :------: | :----------------: | :----: |
| ![Carrito](assets/screenshots/cart.webp) | ![Pedido confirmado](assets/screenshots/success.webp) | ![Perfil](assets/screenshots/profile.webp) |

</div>

---

## ✨ Funcionalidades

### 🔐 Autenticación

- Login y registro con **Firebase Auth** (email + contraseña)
- **Google OAuth** nativo vía `@react-native-google-signin`
- Sesión persistente con **SQLite** — no requiere login en cada apertura

### 🛍️ Catálogo

- Productos en tiempo real desde **Firebase Realtime Database**
- Filtros por categoría con scroll horizontal animado
- Búsqueda en tiempo real
- **Skeleton loaders** durante la carga
- Sistema de valoración con estrellas (persistencia entre sesiones)

### 🛒 Carrito y pedidos

- Carrito con control de cantidades persistido en **AsyncStorage**
- Modal de confirmación animado (bottom sheet)
- Pantalla de éxito animada con número de pedido, total y tiempo estimado
- Simulador de estados del pedido:
  - Confirmado
  - Preparando
  - En camino
- Historial de pedidos

### 🎨 UI/UX

- Diseño **dark mode premium** con sistema de tema dinámico
- 6 colores de acento personalizables
- Tab bar custom con SVG icons y animaciones
- Animaciones con **React Native Animated API**
- Toast animado para feedback visual
- Botón de favorito animado con persistencia
- Iconografía SVG sin dependencias de icon fonts
- Ubicación del usuario en tiempo real

---

## 🧰 Stack tecnológico

| Tecnología | Versión | Uso |
| --- | --- | --- |
| React Native | 0.83.6 | Base de la app |
| Expo SDK | 55 | Toolchain y módulos nativos |
| TypeScript | 5.5 | Tipado estático |
| Firebase Auth | 11 | Autenticación email y Google |
| Firebase Realtime DB | 11 | Catálogo de productos |
| Redux Toolkit | 2.8 | Estado global |
| AsyncStorage | 2.2 | Persistencia local |
| expo-sqlite | 55 | Sesión persistente |
| expo-location | 55 | Geolocalización |
| expo-notifications | 55 | Notificaciones locales |
| React Navigation | 7 | Stack + Bottom Tabs |
| react-native-svg | 15 | Iconografía SVG |
| EAS Build | — | Build nativo Android |

---

## 🏗️ Arquitectura

```txt
src/
├── components/
│   ├── ConfirmModal.tsx
│   ├── ProductCard.tsx
│   ├── StarRating.tsx
│   ├── SkeletonCard.tsx
│   └── Toast.tsx
├── features/
│   └── auth/authSlice.ts
├── hooks/
│   ├── useRedux.ts
│   └── useTheme.ts
├── navigation/
│   ├── StackNavigator.tsx
│   └── BottomTabNavigator.tsx
├── redux/
│   ├── store.ts
│   ├── cartSlice.ts
│   ├── favoritesSlice.ts
│   ├── ordersSlice.ts
│   ├── productsSlice.ts
│   ├── ratingsSlice.ts
│   └── uiSlice.ts
├── screens/
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── HomeScreen.tsx
│   ├── CategoriesScreen.tsx
│   ├── CategoryProductsScreen.tsx
│   ├── DetailsScreen.tsx
│   ├── CartScreen.tsx
│   ├── OrderSuccessScreen.tsx
│   ├── OrdersScreen.tsx
│   └── ProfileScreen.tsx
├── service/
│   ├── firebase.ts
│   └── sessionStorage.ts
├── theme/index.ts
├── types/index.ts
└── utils/productImages.ts
```

---

## ⚙️ Instalación

### Requisitos

- Node.js 18+
- Expo CLI — `npm install -g expo-cli`
- EAS CLI — `npm install -g eas-cli`
- Cuenta en Firebase

### Setup

```bash
# 1. Clonar repositorio
git clone https://github.com/EmanuelDiazOchoa/mistorecoder

# 2. Entrar al proyecto
cd mistorecoder

# 3. Instalar dependencias
npm install

# 4. Configurar variables de entorno
cp .env.example .env

# 5. Iniciar proyecto
npx expo start --dev-client
```

### Variables de entorno

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_DATABASE_URL=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

### Build Android

```bash
# APK de desarrollo
eas build --profile development --platform android

# Producción
eas build --profile production --platform android
```

---

## 🗄️ Estructura Firebase

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

### Categorías

`pan` · `torta` · `galletitas` · `donas` · `budin` · `chocolate`

### Reglas recomendadas

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

---

## 🎨 Sistema de temas

El usuario puede elegir entre 6 colores de acento desde la pantalla de perfil. Toda la UI reacciona en tiempo real: botones, badges, glows, chips y tab bar.

```ts
const ACCENT_COLORS = [
  '#E85D26',
  '#7C3AED',
  '#EC4899',
  '#10B981',
  '#F59E0B',
  '#3B82F6'
];
```

`isLightColor()` garantiza legibilidad del texto sobre cualquier color de acento.

---

## 🗺️ Roadmap

- [x] MVP — auth, catálogo, carrito, favoritos y pedidos
- [x] UI premium — dark mode, animaciones y SVG icons
- [x] Sistema de valoraciones persistente
- [x] Pantalla de éxito animada con tracking de pedido
- [ ] Integración Mercado Pago Checkout Pro (sandbox)
- [ ] Backend de estados de pedido en Firebase
- [ ] Notificaciones push

---

## 👤 Autor

**Emanuel Diaz Ochoa*

- GitHub: <https://github.com/EmanuelDiazOchoa>
- LinkedIn: <https://linkedin.com/in/emanuel-diaz-ochoa>

---

## 📄 Licencia

MIT © 2025 Emanuel Diaz Ochoa
