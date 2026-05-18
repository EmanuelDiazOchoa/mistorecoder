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
|:-----:|:----:|:-------:|
| <img src="assets/screenshots/login.webp" width="180"/> | <img src="assets/screenshots/home.webp" width="180"/> | <img src="assets/screenshots/detail.webp" width="180"/> |

| Carrito | Pedido confirmado | Perfil |
|:-------:|:-----------------:|:------:|
| <img src="assets/screenshots/cart.webp" width="180"/> | <img src="assets/screenshots/success.webp" width="180"/> | <img src="assets/screenshots/profile.webp" width="180"/> |

</div>

---

## ✨ Funcionalidades

### Autenticación
- Login y registro con **Firebase Auth** (email + contraseña)
- **Google OAuth** nativo vía `@react-native-google-signin`
- Sesión persistente con **SQLite** — no requiere login en cada apertura

### Catálogo
- Productos en tiempo real desde **Firebase Realtime Database**
- Filtros por categoría con scroll horizontal animado
- Búsqueda en tiempo real
- **Skeleton loaders** durante la carga
- **Sistema de valoración** de productos con estrellas (persiste entre sesiones)

### Carrito y pedidos
- Carrito con control de cantidades, persistido en **AsyncStorage**
- Modal de confirmación animado (bottom sheet)
- **Pantalla de éxito** animada con número de pedido, total y tiempo estimado
- Simulador de estados del pedido (Confirmado → Preparando → En camino)
- Historial de pedidos

### UI/UX
- Diseño **dark mode premium** con sistema de tema dinámico
- **6 colores de acento** personalizables — toda la UI reacciona en tiempo real
- Tab bar custom con **SVG icons** y animaciones de escala
- Animaciones con **React Native Animated API** (spring, stagger, sequence)
- Toast animado para feedback de acciones
- Botón de favorito animado (♥) con persistencia
- Iconografía consistente con **SVG** (sin dependencias de icon fonts)
- Ubicación del usuario en tiempo real (pantalla de perfil)

---

## 🧰 Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
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

```
src/
├── components/          # Componentes reutilizables
│   ├── ConfirmModal.tsx  # Bottom sheet animado
│   ├── ProductCard.tsx   # Card con animaciones
│   ├── StarRating.tsx    # Sistema de valoración
│   ├── SkeletonCard.tsx  # Loader placeholder
│   └── Toast.tsx         # Feedback animado
├── features/
│   └── auth/authSlice.ts # Slice de autenticación
├── hooks/
│   ├── useRedux.ts       # Typed hooks de Redux
│   └── useTheme.ts       # Hook de tema dinámico
├── navigation/
│   ├── StackNavigator.tsx
│   └── BottomTabNavigator.tsx
├── redux/
│   ├── store.ts
│   ├── cartSlice.ts
│   ├── favoritesSlice.ts
│   ├── ordersSlice.ts
│   ├── productsSlice.ts
│   ├── ratingsSlice.ts   # Sistema de valoraciones
│   └── uiSlice.ts        # Tema + accentColor
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
│   ├── firebase.ts       # Inicialización Firebase
│   └── sessionStorage.ts # Sesión SQLite
├── theme/index.ts        # getTheme(), palette, shadows
├── types/index.ts        # Tipos globales
└── utils/productImages.ts
```

---

## ⚙️ Instalación

### Requisitos
- Node.js 18+
- Expo CLI — `npm install -g expo-cli`
- EAS CLI — `npm install -g eas-cli`
- Cuenta en [Firebase](https://firebase.google.com)

### Setup

```bash
# 1. Clonar
git clone https://github.com/EmanuelDiazOchoa/mistorecoder
cd mistorecoder

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Completar con tus credenciales de Firebase

# 4. Iniciar
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
# Development build (APK para testing)
eas build --profile development --platform android

# Production
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

**Categorías:** `pan` · `torta` · `galletitas` · `donas` · `budin` · `chocolate`

**Reglas recomendadas:**
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

El usuario elige entre 6 colores de acento desde Perfil. Toda la UI reacciona en tiempo real: botones, tab bar, badges, glows y chips.

```ts
const ACCENT_COLORS = ['#E85D26', '#7C3AED', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'];
```

`isLightColor()` garantiza legibilidad del texto sobre cualquier color de acento.

---

## 🗺️ Roadmap

- [x] MVP — auth, catálogo, carrito, favoritos, pedidos
- [x] UI premium — dark mode, animaciones, tema dinámico, SVG icons
- [x] Sistema de valoraciones con persistencia
- [x] Pantalla de éxito animada con tracking de pedido
- [ ] Pagos — Mercado Pago Checkout Pro (sandbox)
- [ ] Backend — estados de pedido en Firebase, notificaciones push

---

## 👤 Autor

**Emanuel Diaz Ochoa**

[![GitHub](https://img.shields.io/badge/GitHub-EmanuelDiazOchoa-181717?style=flat-square&logo=github)](https://github.com/EmanuelDiazOchoa)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Conectar-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/emanuel-diaz-ochoa)

---

## 📄 Licencia

MIT © 2025 Emanuel Diaz Ochoa