export const generateRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

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
