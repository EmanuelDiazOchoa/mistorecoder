export const getProductImage = (name) => {
  const map = {
    pan: require('../../assets/Pan.webp'),
    torta: require('../../assets/Torta.webp'),
    budin: require('../../assets/Budin.webp'),
    galletitas: require('../../assets/Galletitas.jpg'),
    donas: require('../../assets/dona.png'),
    chocolate: require('../../assets/chocolate.webp'),
  };
  return map[name?.toLowerCase()] ?? require('../../assets/icon.png');
};

export const CATEGORIES = [
  { label: 'Panadería', emoji: '🥖', key: 'pan' },
  { label: 'Tortas', emoji: '🎂', key: 'torta' },
  { label: 'Galletitas', emoji: '🍪', key: 'galletitas' },
  { label: 'Donas', emoji: '🍩', key: 'donas' },
  { label: 'Postres', emoji: '🍰', key: 'budin' },
  { label: 'Chocolates', emoji: '🍫', key: 'chocolate' },
];