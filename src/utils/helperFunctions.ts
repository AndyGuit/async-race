export const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const generateRandomCarName = () => {
  const brands = [
    'BMW',
    'Ford',
    'Audi',
    'Ferrari',
    'Tesla',
    'Porsche',
    'Opel',
    'Peugeot',
    'Dodge',
    'Bentley',
    'Chevrolet',
    'Lamborghini',
    'Fiat',
    'Honda',
  ];
  const models = [
    'Sedan',
    'Hatchback',
    'Coupe',
    'SUV',
    'Hybrid',
    'Muscle',
    'Off-Road',
    'Micro',
    'Compact',
    'Truck',
    'Vans',
    'Electric',
  ];

  return `${brands[Math.floor(Math.random() * brands.length)]} ${models[Math.floor(Math.random() * models.length)]}`;
};
