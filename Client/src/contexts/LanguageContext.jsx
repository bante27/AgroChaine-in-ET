import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      contact: 'Contact',
      login: 'Login',
      register: 'Register',
      marketplace: 'Marketplace'
    },
    hero: {
      title: 'Revolutionary Agricultural Supply Chain',
      subtitle: 'Empowering Ethiopian farmers with blockchain technology for transparent, traceable, and profitable agriculture',
      cta: 'Get Started',
      learnMore: 'Learn More'
    },
    features: {
      traceability: 'Full Traceability',
      traceabilityDesc: 'Track your products from farm to consumer with blockchain technology',
      kyc: 'KYC Verification',
      kycDesc: 'Secure identity verification using Ethiopian National ID',
      marketplace: 'Digital Marketplace',
      marketplaceDesc: 'Connect directly with buyers and eliminate middlemen'
    }
  },
  am: {
    nav: {
      home: 'ቤት',
      about: 'ስለ እኛ',
      services: 'አገልግሎቶች',
      contact: 'ያግኙን',
      login: 'ግባ',
      register: 'ተመዝገብ',
      marketplace: 'ገበያ'
    },
    hero: {
      title: 'አብዮታዊ የግብርና አቅርቦት ሰንሰለት',
      subtitle: 'የኢትዮጵያ ገበሬዎችን በብሎክቼይን ቴክኖሎጂ በማጎልበት ግልጽ፣ ተከታታይ እና ትርፋማ ግብርና',
      cta: 'ጀምር',
      learnMore: 'የበለጠ ለመረዳት'
    },
    features: {
      traceability: 'ሙሉ ተከታታይነት',
      traceabilityDesc: 'ምርቶችዎን ከእርሻ እስከ ሸማች በብሎክቼይን ቴክኖሎጂ ይከታተሉ',
      kyc: 'KYC ማረጋገጫ',
      kycDesc: 'የኢትዮጵያ ብሔራዊ መታወቂያ በመጠቀም ደህንነቱ የተጠበቀ ማንነት ማረጋገጫ',
      marketplace: 'ዲጂታል ገበያ',
      marketplaceDesc: 'ከገዢዎች ጋር በቀጥታ ይገናኙ እና መካከለኞችን ያስወግዱ'
    }
  },
  om: { // Afan Oromo (Oromo)
    nav: {
      home: 'Mana',
      about: 'Waa\'ee Keenya',
      services: 'Tajaajiloota',
      contact: 'Nu Qunnamaa',
      login: 'Seenuu',
      register: 'Galmaa\'uu',
      marketplace: 'Gabaa Dijitaalaa'
    },
    hero: {
      title: 'Tarkaanfii Marsaa Qonnaa Jijjirama Fidu',
      subtitle: 'Qonnaan Bultoota Itoophiyaa Teeknooloojii Bloochaayin-tiin Humneessuu, Karaa Ifaa, Hordofamaa fi Bu’a Qabeessa Ta’een',
      cta: 'Eegali',
      learnMore: 'Dabalata Baradhu'
    },
    features: {
      traceability: 'Guutummaatti Hordofamummaa',
      traceabilityDesc: 'Oomishoota keessan qonna irraa hanga fayyadamtootaatti teeknooloojii bloochaayin-tiin hordofaa',
      kyc: 'KYC Mirkanneeffannaa',
      kycDesc: 'Akaakayoo biyyoolessaa Itoophiyaa fayyadamuun eenyummaa keessan mirkaneeffadhaa',
      marketplace: 'Gabaa Dijitaalaa',
      marketplaceDesc: 'Bitattoota waliin kallattiin wal qunnamuu fi gidduu galummaa haquu'
    }
  },
  ti: { // Tigrigna
    nav: {
      home: 'ገዛ',
      about: 'ብዛዕባና',
      services: 'ኣገልግሎታት',
      contact: 'ረኸቡና',
      login: 'እቶ',
      register: 'ተመዝገብ',
      marketplace: 'ዕዳጋ'
    },
    hero: {
      title: 'ሓድሽ ዝኾነ ሰንሰለት ኣቅርቦት ሕርሻ',
      subtitle: 'ንኢትዮጵያውያን ሓረስቶት ብቴክኖሎጂ ብሎክቸይን ብግልፂ፣ ክትትል ዝካኣልን ኣታዊ ዘለዎን ሕርሻ ንምግባር ምሕጋዝ',
      cta: 'ጀምር',
      learnMore: 'ተወሳኺ ምፍላጥ'
    },
    features: {
      traceability: 'ምሉእ ክትትል',
      traceabilityDesc: 'ንፍርያትኩም ካብ ሕርሻ ክሳብ ተጠቃሚ ብቴክኖሎጂ ብሎክቸይን ክትትል ግበሩ',
      kyc: 'KYC ምምዝጋብ',
      kycDesc: 'ብሃገራዊ መንነት ኢትዮጵያ ምትእስሳር ዝተረጋገፀ መንነት',
      marketplace: 'ዲጂታል ዕዳጋ',
      marketplaceDesc: 'ምስ ገዛእቲ ብቀጥታ ተራኸቡን መሽረፍቲ ኣወግዱን'
    }
  },
  ar: { // Arabic
    nav: {
      home: 'الرئيسية',
      about: 'عنا',
      services: 'الخدمات',
      contact: 'اتصل بنا',
      login: 'تسجيل الدخول',
      register: 'التسجيل',
      marketplace: 'السوق'
    },
    hero: {
      title: 'سلسلة إمداد زراعية ثورية',
      subtitle: 'تمكين المزارعين الإثيوبيين بتقنية البلوك تشين من أجل زراعة شفافة ويمكن تتبعها ومربحة',
      cta: 'ابدأ الآن',
      learnMore: 'معرفة المزيد'
    },
    features: {
      traceability: 'تتبع كامل',
      traceabilityDesc: 'تتبع منتجاتك من المزرعة إلى المستهلك بتقنية البلوك تشين',
      kyc: 'التحقق من الهوية (KYC)',
      kycDesc: 'تحقق آمن من الهوية باستخدام الهوية الوطنية الإثيوبية',
      marketplace: 'السوق الرقمي',
      marketplaceDesc: 'تواصل مباشرة مع المشترين وتخلص من الوسطاء'
    }
  },
  es: { // Spanish
    nav: {
      home: 'Inicio',
      about: 'Acerca de',
      services: 'Servicios',
      contact: 'Contacto',
      login: 'Iniciar sesión',
      register: 'Registrarse',
      marketplace: 'Mercado'
    },
    hero: {
      title: 'Cadena de Suministro Agrícola Revolucionaria',
      subtitle: 'Empoderando a los agricultores etíopes con tecnología blockchain para una agricultura transparente, rastreable y rentable',
      cta: 'Comenzar',
      learnMore: 'Saber más'
    },
    features: {
      traceability: 'Trazabilidad Completa',
      traceabilityDesc: 'Rastrea tus productos desde la granja hasta el consumidor con tecnología blockchain',
      kyc: 'Verificación KYC',
      kycDesc: 'Verificación segura de identidad usando la Cédula Nacional de Etiopía',
      marketplace: 'Mercado Digital',
      marketplaceDesc: 'Conéctate directamente con compradores y elimina intermediarios'
    }
  }
}

export const LanguageProvider = ({ children }) => {
  // Initialize language from localStorage or default to 'en'
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en'
  })

  useEffect(() => {
    // Optionally, if you want to set the HTML lang attribute
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (lang) => {
    if (translations[lang]) { // Only change if the language exists in our translations
      setLanguage(lang)
      localStorage.setItem('language', lang)
    } else {
      console.warn(`Language '${lang}' not supported. Defaulting to English.`)
      setLanguage('en') // Fallback to English if unsupported language is requested
      localStorage.setItem('language', 'en')
    }
  }

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]

    for (const k of keys) {
      if (value && typeof value === 'object' && value.hasOwnProperty(k)) {
        value = value[k]
      } else {
        // Fallback to English if translation is missing for the current language
        let englishValue = translations.en
        for (const ek of keys) {
          if (englishValue && typeof englishValue === 'object' && englishValue.hasOwnProperty(ek)) {
            englishValue = englishValue[ek]
          } else {
            englishValue = key; // Return the key itself if not found even in English
            break;
          }
        }
        console.warn(`Translation for key "${key}" missing in "${language}". Falling back to English or key itself.`)
        return englishValue;
      }
    }

    return value || key
  }

  const value = {
    language,
    changeLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}