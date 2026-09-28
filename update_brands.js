import fs from 'fs';
import { BRAND_DATABASE } from './src/data/brands.js';

const visualData = {
  "Apple": {
    formArchetypeShape: "rounded-rectangle",
    materialTextureSwatch: "brushed-metal",
    colorTemperature: 3,
    images: { hero: "https://upload.wikimedia.org/wikipedia/commons/3/3b/IPhone_13_Pro_Max.jpg", product1: "https://upload.wikimedia.org/wikipedia/commons/8/82/MacBook_Pro_16_inch.jpg", product2: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Apple_Watch_Series_5.jpg", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" }
  },
  "Braun": {
    formArchetypeShape: "rounded-rectangle",
    materialTextureSwatch: "matte-plastic",
    colorTemperature: 4,
    images: { hero: null, product1: null, product2: null, logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Braun_logo.svg" }
  },
  "Braun (Dieter Rams Era)": {
    formArchetypeShape: "rectangle",
    materialTextureSwatch: "polished",
    colorTemperature: 2,
    images: { hero: null, product1: null, product2: null, logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Braun_logo.svg" }
  },
  "Dyson": {
    formArchetypeShape: "cylinder",
    materialTextureSwatch: "matte-plastic",
    colorTemperature: 5,
    images: { hero: null, product1: null, product2: null, logoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Dyson_logo.svg" }
  },
  "Sony": {
    formArchetypeShape: "rectangle",
    materialTextureSwatch: "matte-plastic",
    colorTemperature: 3,
    images: { hero: null, product1: null, product2: null, logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg" }
  },
  "Nike": {
    formArchetypeShape: "wedge",
    materialTextureSwatch: "woven-fabric",
    colorTemperature: 7,
    images: { hero: null, product1: null, product2: null, logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" }
  },
  "Adidas": {
    formArchetypeShape: "wedge",
    materialTextureSwatch: "woven-fabric",
    colorTemperature: 6,
    images: { hero: null, product1: null, product2: null, logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" }
  },
  "Bang & Olufsen": {
    formArchetypeShape: "cylinder",
    materialTextureSwatch: "brushed-metal",
    colorTemperature: 7,
    images: { hero: null, product1: null, product2: null, logoUrl: null }
  },
  "Muji": {
    formArchetypeShape: "cylinder",
    materialTextureSwatch: "raw-wood",
    colorTemperature: 6,
    images: { hero: null, product1: null, product2: null, logoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Mujirushi_Ryohin_logo.svg" }
  },
  "Leica": {
    formArchetypeShape: "rectangle",
    materialTextureSwatch: "leather",
    colorTemperature: 4,
    images: { hero: null, product1: null, product2: null, logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Leica_Camera_logo.svg" }
  },
  "Ferrari": {
    formArchetypeShape: "wedge",
    materialTextureSwatch: "polished",
    colorTemperature: 9,
    images: { hero: null, product1: null, product2: null, logoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Ferrari-Logo.svg" }
  },
  "Porsche": {
    formArchetypeShape: "blob",
    materialTextureSwatch: "polished",
    colorTemperature: 5,
    images: { hero: null, product1: null, product2: null, logoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Porsche_logo.svg" }
  },
  "Tesla": {
    formArchetypeShape: "blob",
    materialTextureSwatch: "polished",
    colorTemperature: 3,
    images: { hero: null, product1: null, product2: null, logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg" }
  },
  "Herman Miller": {
    formArchetypeShape: "blob",
    materialTextureSwatch: "woven-fabric",
    colorTemperature: 5,
    images: { hero: null, product1: null, product2: null, logoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Herman_Miller_logo.svg" }
  },
  "Vitra": {
    formArchetypeShape: "blob",
    materialTextureSwatch: "soft-touch",
    colorTemperature: 6,
    images: { hero: null, product1: null, product2: null, logoUrl: null }
  },
  "Aesop": {
    formArchetypeShape: "cylinder",
    materialTextureSwatch: "glass",
    colorTemperature: 8,
    images: { hero: null, product1: null, product2: null, logoUrl: null }
  },
  "Patagonia": {
    formArchetypeShape: "blob",
    materialTextureSwatch: "woven-fabric",
    colorTemperature: 6,
    images: { hero: null, product1: null, product2: null, logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Patagonia_logo.svg" }
  },
  "Arc'teryx": {
    formArchetypeShape: "blob",
    materialTextureSwatch: "woven-fabric",
    colorTemperature: 4,
    images: { hero: null, product1: null, product2: null, logoUrl: null }
  },
  "Teenage Engineering": {
    formArchetypeShape: "rectangle",
    materialTextureSwatch: "matte-plastic",
    colorTemperature: 5,
    images: { hero: null, product1: null, product2: null, logoUrl: null }
  },
  "Nothing Phone": {
    formArchetypeShape: "rounded-rectangle",
    materialTextureSwatch: "glass",
    colorTemperature: 2,
    images: { hero: null, product1: null, product2: null, logoUrl: null }
  },
  "Rimowa": {
    formArchetypeShape: "rectangle",
    materialTextureSwatch: "anodized",
    colorTemperature: 3,
    images: { hero: null, product1: null, product2: null, logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Rimowa_logo.svg" }
  },
  "Bottega Veneta": {
    formArchetypeShape: "blob",
    materialTextureSwatch: "leather",
    colorTemperature: 7,
    images: { hero: null, product1: null, product2: null, logoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Bottega_Veneta_logo.svg" }
  },
  "Loewe": {
    formArchetypeShape: "blob",
    materialTextureSwatch: "leather",
    colorTemperature: 8,
    images: { hero: null, product1: null, product2: null, logoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Loewe_logo.svg" }
  },
  "Hoka": {
    formArchetypeShape: "wedge",
    materialTextureSwatch: "soft-touch",
    colorTemperature: 6,
    images: { hero: null, product1: null, product2: null, logoUrl: null }
  },
  "Bose": {
    formArchetypeShape: "oval",
    materialTextureSwatch: "soft-touch",
    colorTemperature: 4,
    images: { hero: null, product1: null, product2: null, logoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/82/Bose_logo.svg" }
  },
  "Logitech MX Series": {
    formArchetypeShape: "blob",
    materialTextureSwatch: "soft-touch",
    colorTemperature: 5,
    images: { hero: null, product1: null, product2: null, logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo.svg" }
  },
  "Peak Design": {
    formArchetypeShape: "rounded-rectangle",
    materialTextureSwatch: "woven-fabric",
    colorTemperature: 4,
    images: { hero: null, product1: null, product2: null, logoUrl: null }
  },
  "Anglepoise": {
    formArchetypeShape: "L-shape",
    materialTextureSwatch: "polished",
    colorTemperature: 5,
    images: { hero: null, product1: null, product2: null, logoUrl: null }
  },
  "HAY": {
    formArchetypeShape: "oval",
    materialTextureSwatch: "matte-plastic",
    colorTemperature: 7,
    images: { hero: null, product1: null, product2: null, logoUrl: null }
  },
  "Fujifilm": {
    formArchetypeShape: "rectangle",
    materialTextureSwatch: "leather",
    colorTemperature: 5,
    images: { hero: null, product1: null, product2: null, logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Fujifilm_logo.svg" }
  }
};

const updatedDatabase = BRAND_DATABASE.map(brand => {
  const overrides = visualData[brand.brand] || {
    formArchetypeShape: "rounded-rectangle",
    materialTextureSwatch: "matte-plastic",
    colorTemperature: 5,
    images: { hero: null, product1: null, product2: null, logoUrl: null }
  };
  return { ...brand, ...overrides };
});

const fileContent = `export const BRAND_DATABASE = ${JSON.stringify(updatedDatabase, null, 2)};\n`;

fs.writeFileSync('./src/data/brands.js', fileContent);
console.log('Successfully updated brands.js');
