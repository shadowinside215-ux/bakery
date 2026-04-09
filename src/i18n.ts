import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "nav": {
        "about": "About",
        "whyUs": "Why Us",
        "reviews": "Reviews",
        "gallery": "Gallery",
        "visit": "Visit Us",
        "admin": "Admin"
      },
      "hero": {
        "tagline": "Sweet, Fresh & Perfect — Salé's Finest Bakery",
        "cta": "Find Us",
        "story": "Our Story"
      },
      "about": {
        "title": "Crafting Moments of Joy",
        "text": "MounRed is a beloved neighborhood bakery in Salé, Morocco, known for its irresistible baked goods, exceptional quality, and warm service. Every product is crafted with care — from our golden pastries to our freshly baked bread."
      },
      "whyUs": {
        "ingredients": "Quality Ingredients",
        "ingredientsText": "Only the freshest and finest go into every product we bake daily.",
        "service": "Outstanding Service",
        "serviceText": "Warm, friendly, and always welcoming to our Salé community.",
        "favorite": "Customer Favorite",
        "favoriteText": "Proudly rated 4.2/5 by 44 happy customers and counting."
      },
      "reviews": {
        "title": "What Our Customers Say",
        "count": "Based on 44 reviews"
      },
      "visit": {
        "title": "Visit Us",
        "text": "Come visit us and experience the taste that everyone's talking about. We're waiting for you with fresh batches every morning.",
        "address": "Address",
        "hours": "Hours",
        "hoursText": "Open Daily: 7:00 AM - 10:00 PM",
        "directions": "Get Directions"
      }
    }
  },
  fr: {
    translation: {
      "nav": {
        "about": "À Propos",
        "whyUs": "Pourquoi Nous",
        "reviews": "Avis",
        "gallery": "Galerie",
        "visit": "Visitez-nous",
        "admin": "Admin"
      },
      "hero": {
        "tagline": "Doux, Frais et Parfait — La Meilleure Boulangerie de Salé",
        "cta": "Nous Trouver",
        "story": "Notre Histoire"
      },
      "about": {
        "title": "Créer des Moments de Joie",
        "text": "MounRed est une boulangerie de quartier appréciée à Salé, au Maroc, connue pour ses pâtisseries irrésistibles, sa qualité exceptionnelle et son service chaleureux. Chaque produit est fabriqué avec soin — de nos pâtisseries dorées à notre pain fraîchement cuit."
      },
      "whyUs": {
        "ingredients": "Ingrédients de Qualité",
        "ingredientsText": "Seuls les ingrédients les plus frais et les meilleurs entrent dans chaque produit que nous cuisons quotidiennement.",
        "service": "Service Exceptionnel",
        "serviceText": "Chaleureux, amical et toujours accueillant pour notre communauté de Salé.",
        "favorite": "Favori des Clients",
        "favoriteText": "Fièrement noté 4,2/5 par 44 clients satisfaits."
      },
      "reviews": {
        "title": "Ce que Disent Nos Clients",
        "count": "Basé sur 44 avis"
      },
      "visit": {
        "title": "Visitez-nous",
        "text": "Venez nous rendre visite et découvrez le goût dont tout le monde parle. Nous vous attendons avec des fournées fraîches chaque matin.",
        "address": "Adresse",
        "hours": "Horaires",
        "hoursText": "Ouvert tous les jours : 7h00 - 22h00",
        "directions": "Obtenir l'itinéraire"
      }
    }
  },
  ar: {
    translation: {
      "nav": {
        "about": "حول",
        "whyUs": "لماذا نحن",
        "reviews": "المراجعات",
        "gallery": "المعرض",
        "visit": "زرنا",
        "admin": "المسؤول"
      },
      "hero": {
        "tagline": "حلو، طازج ومثالي — أفضل مخبز في سلا",
        "cta": "جدنا",
        "story": "قصتنا"
      },
      "about": {
        "title": "صنع لحظات من الفرح",
        "text": "مون ري هو مخبز حي محبوب في سلا، المغرب، معروف بمنتجاته المخبوزة التي لا تقاوم، وجودته الاستثنائية، وخدمته الدافئة. يتم صنع كل منتج بعناية — من حلوياتنا الذهبية إلى خبزنا الطازج."
      },
      "whyUs": {
        "ingredients": "مكونات عالية الجودة",
        "ingredientsText": "فقط المكونات الطازجة والأفضل تدخل في كل منتج نخبزه يوميًا.",
        "service": "خدمة متميزة",
        "serviceText": "دافئة وودودة ومرحبة دائمًا بمجتمعنا في سلا.",
        "favorite": "المفضل لدى الزبائن",
        "favoriteText": "مصنف بفخر 4.2/5 من قبل 44 زبونًا سعيدًا."
      },
      "reviews": {
        "title": "ماذا يقول زبائننا",
        "count": "بناءً على 44 مراجعة"
      },
      "visit": {
        "title": "زرنا",
        "text": "تعال لزيارتنا وتذوق الطعم الذي يتحدث عنه الجميع. نحن بانتظارك مع دفعات طازجة كل صباح.",
        "address": "العنوان",
        "hours": "ساعات العمل",
        "hoursText": "مفتوح يوميًا: 7:00 صباحًا - 10:00 مساءً",
        "directions": "احصل على الاتجاهات"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
