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
      brand: 'AgroChain',
      country: 'Ethiopia',
      home: 'Home',
      about: 'About',
      services: 'Services',
      contact: 'Contact',
      login: 'Login',
      register: 'Register',
      marketplace: 'Marketplace',
      logout: 'Logout',
      dashboard: 'Dashboard',
      faq: 'FAQ',
      legal: 'Legal',
      payment: {
        title: 'Add Balance',
        amount: 'Amount (ETB)',
        enterAmount: 'Enter amount',
        method: 'Payment Method',
        payNow: 'Pay Now',
        processing: 'Processing...',
        cancel: 'Cancel'
      },
    },
    auth: {
      verifyEmail: 'Verify Your Email',
      enterOtp: 'Enter the OTP sent to',
      otpLabel: 'OTP Code',
      otpPlaceholder: 'Enter 6-digit OTP',
      expired: 'Expired',
      resendOtp: 'Resend OTP',
      verifyButton: 'Verify OTP',
      welcomeBack: 'Welcome Back',
      joinTitle: 'Join AgroChain',
      signInDesc: 'Sign in to access your account',
      createAccountDesc: 'Create an account to get started',
      basicInfo: 'Basic Information',
      fullName: 'Full Name',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      password: 'Password',
      createPasswordPlaceholder: 'Create a password',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Confirm your password',
      agreeTo: 'I agree to the',
      terms: 'Terms',
      and: 'and',
      privacyPolicy: 'Privacy Policy',
      signIn: 'Sign In',
      createAccount: 'Create Account',
      newTo: 'New to AgroChain?',
      alreadyHaveAccount: 'Already have an account?',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot Password?',
      enterEmailPassword: 'Enter email and password.',
      validGmail: 'Valid Gmail required (e.g., user@gmail.com).',
      passwordsDoNotMatch: 'Passwords do not match.',
      loginSuccess: 'Login successful!',
      loginFailed: 'Login failed.',
      allFieldsRequired: 'All fields required.',
      validPhone: 'Valid phone (e.g., +251912345678).',
      agreeTermsError: 'Agree to Terms and Privacy.',
      registrationFailed: 'Registration failed.',
      otpVerified: 'Verified! Redirecting...',
      otpResent: 'OTP resent.',
      invalidInput: 'Invalid Input',
      // New Error/Status Messages
      enterValidOtp: 'Enter a valid 6-digit OTP',
      enterCredentials: 'Enter email and password.',
      validGmailHelper: 'Valid Gmail required (e.g., user@gmail.com).',
      passwordMismatch: 'Passwords do not match.',
      validNameHelper: 'Valid full name (2+ words, letters only).',
      validAddressHelper: 'Valid address (2-100 chars).',
      validPhoneHelper: 'Valid phone (e.g., +251912345678).',
      agreeTerms: 'Agree to Terms and Privacy.',
      loginError: 'Login error.',
      otpResendFailed: 'Failed to resend OTP',
      otpVerificationFailed: 'OTP verification failed'
    },
    hero: {
      title: 'AgroChain',
      subtitle: 'Ethiopia',
      tagline: 'Traceable. Transparent. Trusted.',
      description: 'Revolutionize Ethiopia’s food supply chain with Technology-powered platform connecting farmers, distributors, retailers, and consumers.',
      explore: 'Explore Marketplace',
      demo: 'Watch Demo',
      slides: [
        {
          title: 'AgroChain Ethiopia',
          tagline: 'Traceable. Transparent. Trusted.',
          description: 'Revolutionize Ethiopia’s food supply chain with Technology-powered platform connecting farmers, distributors, retailers, and consumers.'
        },
        {
          title: 'Empowering Farmers',
          tagline: 'Fair Markets, Thriving Futures',
          description: 'Unlock direct market access, secure payments, and fair pricing to empower Ethiopian farmers and boost local economies.'
        },
        {
          title: 'Ensuring Food Safety',
          tagline: 'From Farm to Fork, Verified',
          description: 'Empower consumers with full transparency to trace the origin and quality of their food, ensuring safety and trust.'
        },
        {
          title: 'Building Trust',
          tagline: 'A Unified Food Ecosystem',
          description: 'Create an efficient, fraud-free supply chain with compliance to global standards, fostering trust across Ethiopia.'
        }
      ],
      futureHarvest: {
        title: "AgroChain Ethiopia's Future Harvest",
        subtitle: 'Next-Gen Agricultural Transparency. Direct farmer-to-buyer connections. Real-time weather insights.',
        tagline: 'Fresh, organic, Ethiopian — delivered with trust.',
        features: {
          security: 'Cloud Security',
          carbon: 'Carbon Neutral',
          farmerFirst: 'Farmer-First'
        }
      },

      testimonials: {
        title: 'Voices of',
        titleSpan: 'Success',
        subtitle: 'Hear from farmers, distributors, and retailers thriving with AgroChain Ethiopia.',
        items: [
          {
            name: 'Ahmed Hassan',
            role: 'Coffee Farmer, Jimma',
            content: 'AgroChain’s traceability has made my coffee a trusted choice for buyers, ensuring I get fair prices every time.',
          },
          {
            name: 'Fatuma Ali',
            role: 'Distributor, Addis Ababa',
            content: 'This platform streamlined our supply chain, cutting costs and ensuring every product is traceable from source to shelf.',
          },
          {
            name: 'Bekele Tadesse',
            role: 'Retailer, Hawassa',
            content: 'Customers trust our produce because they can trace its journey. AgroChain has boosted our sales and reputation.',
          },
        ]
      }
    },
    marketplace: {
      hero: {
        title: 'Ethiopia’s Future Harvest',
        subtitle: 'Next-Gen Agricultural Transparency. Direct farmer-to-buyer connections. Real-time weather insights.',
        tagline: 'Fresh, organic, Ethiopian — delivered with trust.',
        badges: {
          security: 'Secure Records',
          carbon: 'Carbon Neutral',
          farmer: 'Farmer-First'
        }
      },
      filters: {
        search: 'Search products or locations...',
        searchBtn: 'Search',
        categories: {
          all: 'All Categories',
          vegetable: 'Vegetable',
          fruit: 'Fruit',
          grain: 'Grain',
          dairy: 'Dairy',
          other: 'Other'
        },
        sort: {
          priceLow: 'Price: Low to High',
          priceHigh: 'Price: High to Low',
          newest: 'Newest First',
          rating: 'Highest Rated'
        }
      },
      noProducts: 'No products found.',
      loadError: 'Failed to load products',
      toast: {
        restricted: 'Your account is restricted. You cannot perform this action.',
        addedToCart: 'added to cart',
        loginRequired: 'Login required to perform this action.',
        orderSuccess: 'Order placed successfully!',
        orderError: 'Failed to place order.'
      },
      cart: {
        title: 'Your Cart',
        empty: 'Your cart is empty.',
        subtotal: 'Subtotal',
        shipping: 'Shipping',
        total: 'Total',
        checkout: 'Checkout',
        delivery: 'Delivery'
      },
      checkout: {
        title: 'Checkout',
        address: 'Delivery Address',
        addressPlaceholder: 'Enter your delivery address',
        placeOrder: 'Place Order',
        processing: 'Processing...',
        cancel: 'Cancel',
        subtotal: 'Subtotal',
        platformFee: 'Platform Fee',
        shipping: 'Shipping',
        total: 'Total',
        deliveryDate: 'Delivery Date'
      },
      product: {
        verified: 'Verified',
        soldOut: 'Sold Out',
        unknown: 'Unknown',
        seller: 'Seller',
        from: 'From',
        view: 'View',
        cart: 'Add to Cart',
        buyNow: 'Buy Now',
        price: 'Price',
        available: 'Available',
        type: 'Type',
        origin: 'Origin',
        description: 'Description',
        noDescription: 'No description provided.',
        reviews: 'Reviews',
        noReviews: 'No reviews yet.',
        like: 'Like',
        unlike: 'Unlike',
        postReview: 'Post Review',
        posting: 'Posting...',
        writeReview: 'Write a review...',
        anonymous: 'Anonymous'
      },
      productsFound: 'Products Found',
      noProductsFound: 'No Products Found',
      allSoldOut: 'All Products Are Sold Out',
      pagination: {
        previous: 'Previous',
        next: 'Next',
        page: 'Page',
        of: 'of'
      }
    },
    features: {
      title: 'Transformative',
      titleSpan: 'Features',
      subtitle: 'Cutting-edge solutions to empower Ethiopia’s food supply chain with transparency and efficiency.',
      traceability: 'Full Traceability',
      traceabilityDesc: 'Track your products from farm to consumer with secure digital records',
      kyc: 'KYC Verification',
      kycDesc: 'Secure identity verification using Ethiopian National ID',
      marketplace: 'Digital Marketplace',
      marketplaceDesc: 'Connect directly with buyers and eliminate middlemen',
      security: 'Secure Transactions',
      securityDesc: 'Safe and encrypted payment processing',
      impact: 'Social Impact',
      impactDesc: 'Support local farmers and communities'
    },
    home: {
      benefits: {
        title: 'Why',
        titleSpan: 'AgroChain Ethiopia?',
        subtitle: 'Our platform delivers unmatched transparency, efficiency, and trust, transforming Ethiopia’s food supply chain for all stakeholders.',
        joinRevolution: 'Join the Revolution',
        revolutionDesc: 'Join thousands of farmers, distributors, and retailers transforming Ethiopia’s food ecosystem with AgroChain.',
        b1: 'Guaranteed food safety with end-to-end traceability',
        b2: 'Eliminate fraud with Technology-powered transparency',
        b3: 'Streamlined operations for all supply chain stakeholders',
        b4: 'Fair pricing and market access for Ethiopian farmers',
        b5: 'Increased consumer confidence in local produce',
        b6: 'Support for multi-role users: farmers, traders, and customers',
        b7: 'Access to detailed analytics for farmers, buyers, and sellers',
        b8: 'Empowers local farmers with technology-driven market insights',
        b9: 'Seamless compliance with global and national standards'
      },
      integrations: {
        title: 'Seamless',
        titleSpan: 'Integrations',
        subtitle: 'Connect AgroChain Ethiopia with global marketplaces and payment solutions for a truly omnichannel experience.',
        sync: 'Worldwide Market Sync (Coming Soon)',
        syncDesc: 'Connect effortlessly with global and local marketplaces like Amazon, eBay, and regional platforms for unparalleled reach.',
        payment: 'Seamless Payment Gateways (Coming Soon)',
        paymentDesc: 'Integrate payment providers, including mobile payments and Tap to Pay, for fast and secure transactions.'
      },
      cta: {
        title: 'Shape the',
        titleSpan: 'Future of Ethiopian Agriculture',
        subtitle: 'Join AgroChain Ethiopia to drive transparency, efficiency, and trust across the food supply chain.',
        startShopping: 'Start Shopping',
        contactSales: 'Contact Sales'
      }
    },
    footer: {
      about: 'Revolutionizing Ethiopian agriculture through technology, connecting farmers directly with consumers for a transparent and profitable supply chain.',
      quickLinks: 'Quick Links',
      services: 'Services',
      contactInfo: 'Contact Info',
      address: 'Addis Ababa, Ethiopia',
      allRights: 'All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookie: 'Cookie Policy',
      kyc: 'KYC Verification',
      digitalMarket: 'Digital Marketplace',
      supplyChain: 'Supply Chain Management',
      agroFinancing: 'Agro Financing',
      faq: 'FAQ',
      social: {
        facebook: 'Facebook',
        twitter: 'Twitter',
        instagram: 'Instagram',
        linkedin: 'LinkedIn',
        telegram: 'Telegram'
      }
    },
    kycPage: {
      title: 'KYC Verification',
      subtitle: 'Building a Trusted Agricultural Ecosystem',
      intro: 'At AgroChain Ethiopia, security and trust are the cornerstones of our digital marketplace. Our Know Your Customer (KYC) process ensures that every participant—whether a farmer, trader, or buyer—is verified and authentic.',
      whyTitle: 'Why Verification Matters',
      trust: 'Fraud Prevention',
      trustDesc: 'By verifying every user, we create a shield against unauthorized activities and fraudulent transactions, protecting your investments.',
      safety: 'Ecosystem Safety',
      safetyDesc: 'A verified community means higher accountability. KYC builds the bridge of trust between remote farmers and urban buyers.',
      access: 'Full Platform Access',
      accessDesc: 'Only verified users can list products, manage supply chains, and access our premium financing tools.',
      stepsTitle: 'Verification Steps',
      step1: 'Upload National ID',
      step1Desc: 'Upload a clear photo of your Ethiopian National ID or Passport.',
      step2: 'Business Info',
      step2Desc: 'Provide your farm or business registration details if applicable.',
      step3: 'Expert Review',
      step3Desc: 'Our team reviews your submission within 24-48 hours for authenticity.'
    },
    digitalMarketPage: {
      title: 'Digital Marketplace',
      subtitle: 'Connecting Ethiopia’s Harvest to the World',
      intro: 'Our digital marketplace is more than a platform—it’s a revolution in how agricultural products are discovered, traded, and valued across Ethiopia.',
      featuresTitle: 'Core Marketplace Concepts',
      price: 'Price Discovery',
      priceDesc: 'Eliminate middlemen with real-time, transparent pricing based on actual market demand and supply.',
      direct: 'Direct Sourcing',
      directDesc: 'Buyers connect directly with farmers, ensuring fresher produce and better margins for the producers.',
      global: 'Global Reach',
      globalDesc: 'Scale your business beyond local borders by reaching international buyers seeking premium Ethiopian goods.',
      howTitle: 'How It Works',
      browse: 'Discover & Compare',
      browseDesc: 'Browse verified listings by category, region, or price with full quality details.',
      secure: 'Secure Transaction',
      secureDesc: 'Our smart-routing system ensures payments only release when delivery milestones are met.'
    },
    supplyChainPage: {
      title: 'Supply Chain Management',
      subtitle: 'Farm-to-Table Transparency',
      intro: 'We leverage blockchain-inspired technology to track the journey of every teff grain and coffee bean, ensuring total accountability.',
      conceptsTitle: 'The Chain of Trust',
      trace: 'Full Traceability',
      traceDesc: 'Scan a QR code to see exactly where your food was grown and who handled it.',
      efficiency: 'Logistics Optimization',
      efficiencyDesc: 'Reduce post-harvest loss with data-driven routing and warehouse management.',
      quality: 'Quality Assurance',
      qualityDesc: 'Digital records ensure that quality standards are met at every node of the supply chain.',
      visionTitle: 'Our Vision',
      visionDesc: 'To create a resilient agricultural network where efficiency meets equity, empowering every stakeholder in the process.'
    },
    financingPage: {
      title: 'Agro Financing',
      subtitle: 'Fueling Agricultural Growth',
      intro: 'Financial inclusion is the key to unlocking Ethiopia’s agricultural potential. We bridge the gap between farmers and capital.',
      productsTitle: 'Financial Solutions',
      loans: 'Micro-loans',
      loansDesc: 'Access small, low-interest seasonal loans for seeds, fertilizers, and equipment.',
      insurance: 'Crop Insurance',
      insuranceDesc: 'Protect your harvest from climate risks through our partner-driven digital insurance schemes.',
      investment: 'Agro-Investment',
      investmentDesc: 'Connect with investors who want to fund large-scale agricultural projects directly.',
      eligibilityTitle: 'How to Qualify',
      criteria1: 'Verified KYC Profile',
      criteria2: 'Good Transaction History',
      criteria3: 'Registered Farm or Cooperative'
    },
    faqPage: {
      title: 'Frequently Asked Questions',
      subtitle: 'Your Questions, Answered',
      q1: 'What is AgroChain Ethiopia?',
      a1: 'AgroChain is a digital ecosystem designed to revitalize Ethiopia’s agriculture by connecting farmers, buyers, and suppliers through a transparent, tech-enabled supply chain.',
      q2: 'How do I start selling?',
      a2: 'Simply register as a seller, complete your KYC verification, and you can start listing your products immediately.',
      q3: 'Are the payments secure?',
      a3: 'Yes. We use end-to-end encryption and integrate with Telebirr, Safaricom M-Pesa, and major Ethiopian banks to ensure safe transactions.',
      q4: 'How is quality guaranteed?',
      a4: 'Through our traceability system and verified seller ratings, buyers can make informed decisions based on historical performance and origin data.',
      q5: 'Can I track my delivery?',
      a5: 'Absolutely. Every order comes with a real-time tracking dashboard from the farm to your doorstep.',
      q6: 'What happens if there is a dispute?',
      a6: 'Our platform includes a dedicated dispute resolution center that uses digital evidence to resolve issues fairly and quickly.'
    },
    legal: {
      privacyTitle: 'Privacy Policy',
      privacyUpdate: 'Last Updated: February 2026',
      termsTitle: 'Terms of Service',
      termsUpdate: 'Last Updated: February 2026',
      cookieTitle: 'Cookie Policy',
      cookieUpdate: 'Last Updated: February 2026',
      intro: 'Your trust is our most valuable asset. We are committed to protecting your data and ensuring a transparent legal framework.',
      dataCollection: 'Data Collection',
      dataCollectionDesc: 'We only collect essential information like your ID for KYC and contact details for shipping.',
      dataSecurity: 'Data Security',
      dataSecurityDesc: 'All communications are encrypted using high-level SSL and stored on secure enterprise servers.',
      userResponsibilities: 'User Responsibilities',
      userResponsibilitiesDesc: 'Users must provide accurate information and honor the transactions they commit to on the platform.'
    },
    dashboard: {
      welcome: 'Welcome back',
      subtitle: 'Manage your agricultural business efficiently.',
      buyProducts: 'Buy Products',
      sellProducts: 'Sell Products',
      salesOverview: 'Sales Overview',
      periods: {
        d7: '7 Days',
        d30: '30 Days',
        d90: '90 Days'
      },
      loading: 'Loading...',
      stats: {
        posted: 'Posted Products',
        totalOrders: 'Total Orders',
        sold: 'Sold Products',
        rating: 'Customer Rating'
      },
      recentActivity: 'Recent Activities',
      noActivity: 'No recent activities.',
      quickActions: {
        title: 'Quick Actions',
        addProduct: 'Add New Product',
        addProductDesc: 'List your agriculture products for sale',
        viewMarket: 'Marketplace',
        about: 'About Us',
        aboutDesc: 'Learn more about our mission',
        addBalance: 'Add Balance',
        addBalanceDesc: 'Add funds to your wallet for transactions',
        viewCustomers: 'View Customers',
        viewCustomersDesc: 'See potential buyers in your area',
        verifyAccount: 'Verify Account',
        verifyAccountDesc: 'Complete KYC to unlock full features'
      },
      chart: {
        sales: 'Sales (ETB)',
        date: 'Date',
        salesAmount: 'Sales Amount (ETB)'
      },
      viewAllOrders: 'View All Orders',
      about: 'About Platform',
      time: {
        local: 'Local Time',
        ethiopian: 'Ethiopian Time',
        periods: {
          morning: 'Morning',
          afternoon: 'Afternoon',
          evening: 'Evening',
          night: 'Night'
        }
      },
      productUpload: {
        title: 'Upload Product',
        productTitle: 'Product Title',
        enterTitle: 'Enter product title',
        type: 'Type',
        selectType: 'Select Type',
        price: 'Price (ETB)',
        quantity: 'Quantity (kg)',
        originAddress: 'Origin Address',
        enterAddress: 'Enter origin address',
        images: 'Images (max 6)',
        description: 'Description',
        describeProduct: 'Describe your product...',
        upload: 'Upload',
        uploading: 'Uploading...',
        cancel: 'Cancel',
        chooseFiles: 'Choose Files',
        noFileChosen: 'No file chosen',
        maxImages: 'Maximum 6 images allowed',
        fillRequired: 'Please fill in all required fields',
        uploadSuccess: 'Product uploaded successfully',
        uploadFailed: 'Product upload failed',
        types: {
          vegetable: 'Vegetable',
          fruit: 'Fruit',
          grain: 'Grain',
          dairy: 'Dairy',
          other: 'Other'
        }
      },
      profile: {
        email: 'Email',
        balance: 'Balance',
        fullName: 'Full Name',
        phone: 'Phone',
        address: 'Address',
        location: 'Location',
        saveChanges: 'Save Changes',
        darkMode: 'Dark Mode',
        lightMode: 'Light Mode',
        logout: 'Logout',
        accountRestricted: 'Account Restricted',
        restrictedMessage: 'Your account has been restricted by an administrator. You cannot buy or sell products at this time. Please contact support for assistance.',
        notSet: 'Not set',
        enter: 'Enter'
      },
      theme: {
        light: 'Light Mode',
        dark: 'Dark Mode'
      },
      activity: {
        youSold: 'You sold',
        to: 'to',
        youPurchased: 'You purchased',
        from: 'from',
        you: 'You'
      },
      status: {
        completed: 'Completed',
        shipped: 'Shipped',
        pending: 'Pending',
        cancelled: 'Cancelled',
        verified: 'Verified',
        unverified: 'Unverified',
        rejected: 'Rejected'
      },
      actions: {
        markShipped: 'Mark Shipped',
        confirmDelivery: 'Confirm Delivery'
      }
    },
    contact: {
      title: 'Contact AgroChain Ethiopia',
      titlePart1: 'Contact',
      titlePart2: 'AgroChain Ethiopia',
      subtitle: "Let's grow together! Reach out to transform your agricultural journey.",
      getInTouch: 'Get in Touch',
      sendMessage: 'Send Us A Message',
      submit: 'Send Message',
      fullName: 'Full Name',
      email: 'Email Address',
      subject: 'Subject',
      message: 'Your Message',
      recordVoice: 'Record Voice',
      stop: 'Stop Recording',
      attachFiles: 'Attach Files',
      sendButton: 'Send Message',
      office: 'Our Office',
      phone: 'Phone',
      emailInfo: 'Email',
      hours: 'Business Hours',
      faqTitle: 'Frequently Asked Questions',
      faqSubtitle: 'Find answers to common questions',
      ctaTitle: 'Ready to Transform Your Agricultural Business?',
      ctaSubtitle: 'Join thousands of Ethiopian farmers already benefiting from our platform',
      getStarted: 'Get Started Today',
      success: 'Message sent successfully!',
      error: 'Failed to send message.',
      invalidEmail: 'Invalid email address',
      micDenied: 'Microphone access denied.',
      networkError: 'Network error. Please try again.',
      officeDetails: {
        bole: 'Bole Sub City, Addis Ababa',
        region: 'Ethiopia, East Africa',
        poBox: 'P.O. Box 12345'
      },
      phoneNumbers: 'Phone Numbers',
      emailAddresses: 'Email Addresses',
      hoursSat: 'Saturday',
      hoursSun: 'Sunday',
      hoursClosed: 'Closed',
      messagePlaceholder: 'Your message...',
      recording: {
        start: 'Start Voice Message',
        stop: 'Stop Recording',
        delete: 'Delete recording'
      },
      files: 'Attach Files',
      uploadLabel: 'Upload files',
      faqDesc: 'Discover answers to your questions about AgroChain Ethiopia.',
      ctaBottomTitle: 'Ready to Transform Your Business?',
      ctaBottomSubtitle: 'Join AgroChain Ethiopia and unlock a transparent, efficient agricultural ecosystem.',
      faq: [
        {
          question: 'How does the verification process work?',
          answer: 'Upload your Ethiopian National ID and basic business information. Our team reviews submissions within 24-48 hours.'
        },
        {
          question: 'What are the transaction fees?',
          answer: 'We charge a small 2% platform fee on completed transactions to maintain and improve our services.'
        },
        {
          question: 'How do I track my products?',
          answer: 'Every product gets a unique digital record that tracks its journey from farm to consumer using secure digital technology.'
        },
        {
          question: 'Is my personal information secure?',
          answer: 'Yes, we use industry-standard encryption and security measures to protect all user data and transactions.'
        }
      ],
    },
    about: {
      title: 'About AgroChain Ethiopia',
      titlePart1: 'About',
      titlePart2: 'AgroChain Ethiopia',
      subtitle: 'Revolutionizing the food supply chain with transparency and technology.',
      mission: {
        title: 'Our Mission',
        desc: 'To revolutionize Ethiopian agriculture with a transparent, efficient, and profitable supply chain ecosystem powered by technology.'
      },
      vision: {
        title: 'Our Vision',
        desc: 'To lead as Africa’s top agricultural technology platform, empowering farmers and connecting communities through innovation.'
      },
      locations: {
        addisAbaba: 'Addis Ababa',
        bahirDar: 'Bahir Dar',
        hawassa: 'Hawassa',
        direDawa: 'Dire Dawa',
        mekelle: 'Mekelle',
        adama: 'Adama',
        gondar: 'Gondar'
      },
      values: {
        title: 'Our Values',
        titlePart1: 'Our',
        titlePart2: 'Values',
        desc: 'Transparency, innovation, sustainability, and empowerment guide our support for Ethiopian agricultural communities.'
      },
      impact: {
        title: 'Our Impact',
        desc: 'Driving positive change in rural communities with access to global markets and fair pricing.'
      },
      story: {
        title: 'Our Story',
        titlePart1: 'Our',
        titlePart2: 'Story',
        p1: 'AgroChain Ethiopia was born from a vision to uplift Ethiopian farmers by tackling the inefficiencies of traditional agricultural supply chains. Founded in 2025, we leverage advanced technology to bridge the gap between rural producers and global markets.',
        p2: 'Our platform offers real-time traceability, secure logistics, and a digital marketplace, empowering farmers with fair pricing and direct buyer connections. We are committed to sustainable practices, supporting local economies, and fostering innovation in agriculture.',
        p3: 'With a team of agricultural experts and tech innovators, AgroChain Ethiopia aims to set a new standard for agricultural transformation across Africa, ensuring prosperity for generations to come.'
      },
      team: {
        title: 'Meet Our Team',
        subtitle: 'Combining agricultural expertise with cutting-edge technology.'
      },
      services: {
        title: 'Our Core Services',
        titlePart1: 'Our Core',
        titlePart2: 'Services',
        subtitle: 'Innovative solutions transforming Ethiopian agriculture.',
        traceability: {
          title: 'Enhanced Traceability',
          desc: 'Track your products from farm to consumer with a secure and verifiable record for unmatched transparency.',
          f1: 'Verifiable transaction records',
          f2: 'Real-time supply chain visibility',
          f3: 'Fraud prevention and authenticity verification',
          f4: 'Automated regulatory compliance reporting'
        },
        logistics: {
          title: 'Logistics & Transport',
          desc: 'Reliable transport solutions connecting farms to markets, ensuring timely delivery.',
          f1: 'Optimized route planning',
          f2: 'Cold chain management',
          f3: 'Fleet tracking and real-time updates',
          f4: 'Last-mile delivery coordination'
        },
        kyc: {
          title: 'KYC Verification',
          desc: 'Secure identity verification using Ethiopian National ID for trusted market participation.',
          f1: 'Ethiopian National ID integration',
          f2: 'Multi-level verification process',
          f3: 'Compliance with local regulations'
        },
        marketplace: {
          title: 'Digital Marketplace',
          desc: 'Connect farmers directly with buyers, eliminating middlemen and maximizing profits.',
          f1: 'Direct farmer-to-buyer connections',
          f2: 'Real-time price discovery',
          f3: 'Secure payment processing',
          f4: 'Multi-language support'
        },
        additional: {
          title: 'Additional Features',
          titlePart1: 'Additional',
          titlePart2: 'Features',
          subtitle: 'Enhancing your experience on our platform.',
          mobile: { title: 'Mobile App', desc: '(Coming Soon) Access platform features on the go with our mobile application.' },
          data: { title: 'Data Management', desc: 'Secure cloud storage and agricultural data management.' },
          security: { title: 'Security', desc: 'Enterprise-grade security protecting all user data and transactions.' }
        }
      },
      weather: {
        title: 'Real-Time Weather',
        subtitle: 'Auto-detected from your location or select from Ethiopian places for accurate planning.',
        detecting: 'Fetching real-time weather...',
        retry: 'Retry',
        useLocation: 'Use Current Location'
      },
      payment: {
        title: 'Add Balance',
        amount: 'Amount (ETB)',
        enterAmount: 'Enter amount',
        method: 'Payment Method',
        payNow: 'Add to Wallet',
        processing: 'Processing...',
        cancel: 'Cancel'
      },

    },
  },
  am: {
    nav: {
      brand: 'አግሮቼይን',
      country: 'ኢትዮጵያ',
      home: 'ቤት',
      about: 'ስለ እኛ',
      services: 'አገልግሎቶች',
      contact: 'ያግኙን',
      login: 'ግባ',
      register: 'ተመዝገብ',
      marketplace: 'ገበያ',
      logout: 'ውጣ',
      dashboard: 'ዳሽቦርድ',
      faq: 'ተደጋጋሚ ጥያቄዎች',
      legal: 'ህጋዊ'
    },
    marketplace: {
      hero: {
        title: 'የኢትዮጵያ የወደፊት ምርት',
        subtitle: 'ቀጣይ ትውልድ የግብርና ግልፅነት። ቀጥተኛ የገበሬ-ገዢ ግንኙነቶች። እውነተኛ ጊዜ የአየር ሁኔታ መረጃ።',
        tagline: 'ትኩስ፣ ኦርጋኒክ፣ ኢትዮጵያዊ — በታማኝነት የቀረበ።',
        badges: {
          security: 'ደህንነቱ የተጠበቀ መረጃ',
          carbon: 'ካርቦን ገለልተኛ',
          farmer: 'ለገበሬ ቅድሚያ'
        }
      },
      filters: {
        search: 'ምርቶችን ወይም ቦታዎችን ይፈልጉ...',
        searchBtn: 'ፈልግ',
        categories: {
          all: 'ሁሉም ምድቦች',
          vegetable: 'አትክልት',
          fruit: 'ፍራፍሬ',
          grain: 'ጥራጥሬ',
          dairy: 'ወተት እና የወተት ተዋጽኦ',
          other: 'ሌላ'
        },
        sort: {
          priceLow: 'ዋጋ፡ ከዝቅተኛ ወደ ከፍተኛ',
          priceHigh: 'ዋጋ፡ ከከፍተኛ ወደ ዝቅተኛ',
          newest: 'አዲስ መጀመሪያ',
          rating: 'ከፍተኛ ደረጃ የተሰጠው'
        }
      },
      noProducts: 'ምንም ምርቶች አልተገኙም።',
      loadError: 'ምርቶችን መጫን አልተቻለም',
      toast: {
        restricted: 'መለያዎ ተገድቧል። ይህንን ተግባር ማከናወን አይችሉም።',
        addedToCart: 'ወደ ጋሪ ተጨምሯል',
        loginRequired: 'ይህንን ተግባር ለማከናወን መግባት ያስፈልጋል።',
        orderSuccess: 'ትዕዛዝዎ በተሳካ ሁኔታ ተልኳል!',
        orderError: 'ትዕዛዝ መላክ አልተቻለም።'
      },
      cart: {
        title: 'የእርስዎ ጋሪ',
        empty: 'ጋሪዎ ባዶ ነው።',
        subtotal: 'ጠቅላላ ዋጋ',
        shipping: 'የማጓጓዣ ክፍያ',
        total: 'መክፈል ያለብዎት',
        checkout: 'ክፍያ ፈጽሙ',
        delivery: 'ርክክብ'
      },
      checkout: {
        title: 'ክፍያ መፈጸሚያ',
        address: 'የመረከቢያ አድራሻ',
        addressPlaceholder: 'የመረከቢያ አድራሻዎን ያስገቡ',
        placeOrder: 'ትዕዛዝ ይላኩ',
        processing: 'በማከናወን ላይ...',
        cancel: 'ሰርዝ',
        subtotal: 'ጠቅላላ ዋጋ',
        platformFee: 'የመድረክ ክፍያ',
        shipping: 'የማጓጓዣ ክፍያ',
        total: 'መክፈል ያለብዎት',
        deliveryDate: 'የሚረከቡበት ቀን'
      },
      product: {
        verified: 'የተረጋገጠ',
        soldOut: 'ያለቀ',
        unknown: 'ያልታወቀ',
        seller: 'ሻጭ',
        from: 'ከ',
        view: 'ተመልከት',
        cart: 'ወደ ጋሪ ጨምር',
        buyNow: 'አሁን ግዛ',
        price: 'ዋጋ',
        available: 'ያለ ምርት',
        type: 'ዓይነት',
        origin: 'ምንጭ',
        description: 'መግለጫ',
        noDescription: 'ምንም መግለጫ አልተሰጠም።',
        reviews: 'አስተያየቶች',
        noReviews: 'እስካሁን ምንም አስተያየት የለም።',
        like: 'ውደድ',
        unlike: 'አትውደድ',
        postReview: 'አስተያየት ላክ',
        posting: 'በመላክ ላይ...',
        writeReview: 'አስተያየት ይጻፉ...'
      },
      productsFound: 'ምርቶች ተገኝተዋል',
      noProductsFound: 'ምንም ምርቶች አልተገኙም',
      allSoldOut: 'ሁሉም ምርቶች አልቀዋል',
      pagination: {
        previous: 'ቀዳሚ',
        next: 'ቀጣይ',
        page: 'ገጽ',
        of: 'ከ'
      }
    },
    auth: {
      verifyEmail: 'ተጨማሪ ማረጋገጫ',
      enterOtp: 'ወደ',
      otpLabel: 'የመለያ ቁጥር',
      otpPlaceholder: '6-አሃዝ ኮድ ያስገቡ',
      expired: 'ጊዜው አልፎበታል',
      resendOtp: 'እንደገና ይላኩ',
      verifyButton: 'አረጋግጥ',
      welcomeBack: 'እንኳን በደህና መጡ',
      joinTitle: 'አግሮቼይን ይቀላቀሉ',
      signInDesc: 'ወደ መለያዎ ይግቡ',
      createAccountDesc: 'መለያ ይፍጠሩ',
      basicInfo: 'መሰረታዊ መረጃ',
      fullName: 'ሙሉ ስም',
      phone: 'ስልክ ቁጥር',
      email: 'ኢሜይል',
      address: 'አድራሻ',
      password: 'የይለፍ ቃል',
      createPasswordPlaceholder: 'የይለፍ ቃል ይፍጠሩ',
      confirmPassword: 'የይለፍ ቃል ያረጋግጡ',
      confirmPasswordPlaceholder: 'የይለፍ ቃልዎን ያረጋግጡ',
      agreeTo: 'በ',
      terms: 'ደንቦች',
      and: 'እና',
      privacyPolicy: 'ግላዊነት ፖሊሲ',
      signIn: 'ግባት',
      createAccount: 'መለያ ይፍጠሩ',
      newTo: 'አዲስ ነዎት?',
      alreadyHaveAccount: 'መለያ አለዎት?',
      rememberMe: 'አስታውሰኝ',
      forgotPassword: 'የይለፍ ቃል ረሱ?',
      enterEmailPassword: 'ኢሜይል እና የይለፍ ቃል ያስገቡ።',
      validGmail: 'ትክክለኛ ኢሜይል ያስፈልጋል (ለምሳሌ፡ user@gmail.com)።',
      passwordsDoNotMatch: 'የይለፍ ቃሎች አይመሳሰሉም።',
      loginSuccess: 'በተሳካ ሁኔታ ገብተዋል!',
      loginFailed: 'መግባት አልተሳካም።',
      allFieldsRequired: 'ሁሉም መረጃ ያስፈልጋል።',
      validPhone: 'ትክክለኛ ስልክ ቁጥር ያስፈልጋል (ለምሳሌ፡ +251912345678)።',
      agreeTermsError: 'በደንቦች እና ግላዊነት ፖሊሲ ይስማሙ።',
      registrationFailed: 'ምዝገባ አልተሳካም።',
      otpVerified: 'ተረጋግጧል! በመሄድ ላይ...',
      otpResent: 'ኮዱ እንደገና ተልኳል።',
      invalidInput: 'የተሳሳተ መረጃ',
      // New Error/Status Messages
      enterValidOtp: 'ትክክለኛ 6-አሃዝ ኮድ ያስገቡ',
      enterCredentials: 'ኢሜይል እና የይለፍ ቃል ያስገቡ።',
      validGmailHelper: 'ትክክለኛ Gmail ያስፈልጋል (ለምሳሌ፡ user@gmail.com)።',
      passwordMismatch: 'የይለፍ ቃሎች አይመሳሰሉም።',
      validNameHelper: 'ትክክለኛ ሙሉ ስም (2+ ቃላት፣ ፊደላት ብቻ)።',
      validAddressHelper: 'ትክክለኛ አድራሻ (2-100 ቁምፊዎች)።',
      validPhoneHelper: 'ትክክለኛ ስልክ (ለምሳሌ፡ +251912345678)።',
      agreeTerms: 'በደንቦች እና ግላዊነት ፖሊሲ ይስማሙ።',
      loginError: 'የመግባት ስህተት።',
      otpResendFailed: 'ኮዱን እንደገና መላክ አልተቻለም።',
      otpVerificationFailed: 'ኮድ ማረጋገጥ አልተቻለም።'
    },
    hero: {
      title: 'አግሮቼይን',
      subtitle: 'ኢትዮጵያ',
      tagline: 'ተከታታይ። ግልጽ። የታመነ።',
      description: 'ገበሬዎችን፣ አከፋፋዮችን፣ ቸርቻሪዎችን እና ሸማቾችን በማገናኘት የኢትዮጵያን የምግብ አቅርቦት ሰንሰለት በቴክኖሎጂ የታገዘ መድረክ ይለውጡ።',
      explore: 'ገበያውን ያስሱ',
      demo: 'ማሳያ ይመልከቱ',
      slides: [
        {
          title: 'አግሮቼይን ኢትዮጵያ',
          tagline: 'ተከታታይ። ግልጽ። የታመነ።',
          description: 'የገበሬዎችን፣ አከፋፋዮችን፣ ቸርቻሪዎችን እና ሸማቾችን በማገናኘት የኢትዮጵያን የምግብ አቅርቦት ሰንሰለት በቴክኖሎጂ የታገዘ መድረክ ይለውጡ።'
        },
        {
          title: 'ገበሬዎችን ማብቃት',
          tagline: 'ፍትሃዊ ገበያ፣ የበለፀገ የወደፊት ጊዜ',
          description: 'የኢትዮጵያ ገበሬዎችን ለማብቃት እና የአካባቢውን ኢኮኖሚ ለማሳደግ የቀጥታ የገበያ ተደራሽነትን፣ አስተማማኝ ክፍያዎችን እና ፍትሃዊ ዋጋን ይክፈቱ።'
        },
        {
          title: 'የምግብ ደህንነትን ማረጋገጥ',
          tagline: 'ከእርሻ እስከ ሸማች፣ የተረጋገጠ',
          description: 'ሸማቾች የምግባቸውን አመጣጥ እና ጥራት ለመከታተል ሙሉ ግልጽነት እንዲኖራቸው በማድረግ ደህንነትን እና እምነትን ማረጋገጥ።'
        },
        {
          title: 'እምነት መገንባት',
          tagline: 'የተቀናጀ የምግብ ስነ-ምህዳር',
          description: 'በኢትዮጵያ ውስጥ እምነትን በማጎልበት፣ ከአለም አቀፍ ደረጃዎች ጋር የሚስማማ ቀልጣፋ እና ከማጭበርበር የጸዳ የአቅርቦት ሰንሰለት መፍጠር።'
        }
      ],
      futureHarvest: {
        title: "የአግሮቼይን ኢትዮጵያ የወደፊት ምርት",
        subtitle: 'የቀጣዩ ትውልድ የግብርና ግልጽነት። ቀጥታ ከገበሬ-ወደ-ገዢ ግንኙነቶች። የእውነተኛ ጊዜ የአየር ሁኔታ መረጃ።',
        tagline: 'ትኩስ፣ ኦርጋኒክ፣ ኢትዮጵያዊ — በታማኝነት የቀረበ።',
        features: {
          security: 'ክላውድ ደህንነት',
          carbon: 'ካርቦን ገለልተኛ',
          farmerFirst: 'ገበሬ-ቅድሚያ'
        }
      },
      empoweringSection: {
        title: 'አግሮቼይን ኢትዮጵያ',
        description: 'ለገበሬዎች እና ማህበረሰቦች ዘመናዊ ቴክኖሎጂን፣ ግልጽነትን እና ዘላቂ እድገትን በመጠቀም የኢትዮጵያን ግብርና ማብቃት።',
        joinNow: 'አሁን ይቀላቀሉ',
        getStarted: 'ዛሬ ጀምር'
      },
      testimonials: {
        title: 'የስኬት',
        titleSpan: 'ድምፆች',
        subtitle: 'በአግሮቼይን ኢትዮጵያ ስኬታማ ከሆኑ ገበሬዎች፣ አከፋፋዮች እና ቸርቻሪዎች ይስሙ።',
        items: [
          {
            name: 'አህመድ ሀሰን',
            role: 'የቡና አምራች፣ ጅማ',
            content: 'የአግሮቼይን ተከታታይነት የእኔ ቡና በገዢዎች ዘንድ የታመነ ምርጫ እንዲሆን አድርጎታል፣ ይህም ሁልጊዜ ተገቢውን ዋጋ እንዳገኝ ያረጋግጥልኛል።',
          },
          {
            name: 'ፋጡማ አሊ',
            role: 'አከፋፋይ፣ አዲስ አበባ',
            content: 'ይህ መድረክ የአቅርቦት ሰንሰለታችንን አቀላጥፏል፣ ወጪዎችን ቀንሷል እና እያንዳንዱ ምርት ከመነሻው እስከ መደርደሪያው ድረስ ተከታታይነት ያለው መሆኑን አረጋግጧል።',
          },
          {
            name: 'በቀለ ታደሰ',
            role: 'ቸርቻሪ፣ ሀዋሳ',
            content: 'ደንበኞቻችን ምርቶቻችንን ያምናሉ ምክንያቱም ጉዞውን መከታተል ስለሚችሉ ነው። አግሮቼይን ሽያጫችንን እና ስማችንን ከፍ አድርጎታል።',
          },
        ]
      }
    },

    features: {
      title: 'ለውጥ የሚያመጡ',
      titleSpan: 'ባህርያት',
      subtitle: 'የኢትዮጵያን የምግብ አቅርቦት ሰንሰለት በግልፅነት እና በብቃት ለማጎልበት ዘመናዊ መፍትሄዎች።',
      traceability: 'ሙሉ ተከታታይነት',
      traceabilityDesc: 'ምርቶችዎን ከእርሻ እስከ ሸማች በደህንነቱ በተጠበቀ የዲጂታል መዝገብ ይከታተሉ',
      kyc: 'KYC ማረጋገጫ',
      kycDesc: 'የኢትዮጵያ ብሔራዊ መታወቂያ በመጠቀም ደህንነቱ የተጠበቀ ማንነት ማረጋገጫ',
      marketplace: 'ዲጂታል ገበያ',
      marketplaceDesc: 'ከገዢዎች ጋር በቀጥታ ይገናኙ እና መካከለኞችን ያስወግዱ',
      security: 'ደህንነቱ የተጠበቁ ግብይቶች',
      securityDesc: 'ደህንነቱ የተጠበቀ እና የተመሰጠረ የክፍያ ሂደት',
      impact: 'የማህበራዊ ተጽእኖ',
      impactDesc: 'የአካባቢ ገበሬዎችን እና ማህበረሰቦችን ይደግፉ'
    },
    home: {
      benefits: {
        title: 'ለምን',
        titleSpan: 'አግሮቼይን ኢትዮጵያ?',
        subtitle: 'መድረካችን ወደር የለሽ ግልጽነት፣ ብቃት እና እምነትን ይሰጣል፣ ይህም የኢትዮጵያን የምግብ አቅርቦት ሰንሰለት ለሁሉም ባለድርሻ አካላት ይለውጣል።',
        joinRevolution: 'አብዮቱን ይቀላቀሉ',
        revolutionDesc: 'የኢትዮጵያን የምግብ ስነ-ምህዳር በአግሮቼይን የሚቀይሩ በሺዎች የሚቆጠሩ ገበሬዎችን፣ አከፋፋዮችን እና ቸርቻሪዎችን ይቀላቀሉ።',
        b1: 'ከዳር-እስከ-ዳር ተከታታይነት ያለው አስተማማኝ የምግብ ደህንነት',
        b2: 'በቴክኖሎጂ የታገዘ ግልጽነት ማጭበርበርን ያስወግዱ',
        b3: 'ለሁሉም የአቅርቦት ሰንሰለት ባለድርሻ አካላት የተቀናጀ አሰራር',
        b4: 'ለኢትዮጵያ ገበሬዎች ፍትሃዊ ዋጋ እና የገበያ ተደራሽነት',
        b5: 'በአካባቢው ምርቶች ላይ የሸማቾችን እምነት መጨመር',
        b6: 'ለብዙ-ሚና ተጠቃሚዎች ድጋፍ: ገበሬዎች, ነጋዴዎች እና ደንበኞች',
        b7: 'ለገበሬዎች, ገዢዎች እና ሻጮች ዝርዝር ትንታኔዎችን ማግኘት',
        b8: 'በቴክኖሎጂ በሚመሩ የገበያ ግንዛቤዎች የአካባቢ ገበሬዎችን ያበረታታል',
        b9: 'ከዓለም አቀፍ እና ብሔራዊ ደረጃዎች ጋር እንከን የለሽ ተገዢነት'
      },
      integrations: {
        title: 'እንከን የለሽ',
        titleSpan: 'ውህደቶች',
        subtitle: 'ለእውነተኛ ባለብዙ-ቻናል ልምድ አግሮቼይን ኢትዮጵያን ከዓለም አቀፍ ገበያዎች እና የክፍያ መፍትሄዎች ጋር ያገናኙ።',
        sync: 'የዓለም አቀፍ ገበያ ማመሳሰል (በቅርቡ የሚመጣ)',
        syncDesc: 'ለማይመጣጠን ተደራሽነት እንደ አማዞን፣ ኢቤይ እና ክልላዊ መድረኮች ካሉ ዓለም አቀፍ እና የአካባቢ ገበያዎች ጋር ያለ ምንም ጥረት ይገናኙ።',
        payment: 'እንከን የለሽ የክፍያ መንገዶች (በቅርቡ የሚመጣ)',
        paymentDesc: 'ፈጣን እና ደህንነቱ የተጠበቀ ግብይቶችን ለማግኘት የሞባይል ክፍያዎችን እና ታፕ ቱ ፔይን ጨምሮ የክፍያ አቅራቢዎችን ያዋህዱ።'
      },
      cta: {
        title: 'የኢትዮጵያን ግብርና',
        titleSpan: 'የወደፊት ዕጣ ፈንታ ይቅረጹ',
        subtitle: 'በምግብ አቅርቦት ሰንሰለት ውስጥ ግልጽነትን፣ ብቃትን እና እምነትን ለመምራት አግሮቼይን ኢትዮጵያን ይቀላቀሉ።',
        startShopping: 'መገብየት ይጀምሩ',
        contactSales: 'ሽያጭ ያግኙ'
      }
    },
    footer: {
      about: 'ዘመናዊ ቴክኖሎጂን በመጠቀም የኢትዮጵያን ግብርና በማዘመን ገበሬዎችን በቀጥታ ከሸማቾች ጋር የሚያገናኝ እና ግልጽነት የሰፈነበት እንዲሁም ትርፋማ የሆነ የአቅርቦት ሰንሰለት መገንባት።',
      quickLinks: 'ፈጣን አገናኞች',
      services: 'አገልግሎቶች',
      contactInfo: 'የአድራሻ መረጃ',
      address: 'አዲስ አበባ፣ ኢትዮጵያ',
      allRights: 'መብቱ በሕግ የተጠበቀ ነው።',
      privacy: 'የግላዊነት መመሪያ',
      terms: 'የአጠቃቀም ውሎች',
      cookie: 'የኩኪ ፖሊሲ',
      kyc: 'የደንበኛ ማንነት ማረጋገጫ (KYC)',
      digitalMarket: 'ዲጂታል የገበያ ቦታ',
      supplyChain: 'የአቅርቦት ሰንሰለት አስተዳደር',
      agroFinancing: 'የግብርና ፋይናንስ',
      faq: 'ተደጋጋሚ ጥያቄዎች',
      social: {
        facebook: 'ፌስቡክ',
        twitter: 'ትዊተር',
        instagram: 'ኢንስታግራም',
        linkedin: 'ሊንክድኢን',
        telegram: 'ቴሌግራም'
      }
    },
    kycPage: {
      title: 'የደንበኛ ማንነት ማረጋገጫ (KYC)',
      subtitle: 'የታመነ የግብርና ስነ-ምህዳር መገንባት',
      intro: 'በአግሮቼይን ኢትዮጵያ፣ ደህንነት እና እምነት የዲጂታል ገበያችን የመሰረት ድንጋዮች ናቸው። የእኛ የKYC ሂደት እያንዳንዱ ተሳታፊ—ገበሬ፣ ነጋዴ ወይም ገዥ—መረጋገጡን እና ትክክለኛ መሆኑን ያረጋግጣል።',
      whyTitle: 'ማረጋገጫ ለምን አስፈላጊ ሆነ?',
      trust: 'ማጭበርበርን መከላከል',
      trustDesc: 'እያንዳንዱን ተጠቃሚ በማረጋገጥ፣ ያልተፈቀዱ ተግባራትን እና የማጭበርበር ድርጊቶችን እንከላከላለን፣ ይህም የእርስዎን ኢንቨስትመንት ይጠብቃል።',
      safety: 'የስነ-ምህዳር ደህንነት',
      safetyDesc: 'የተረጋገጠ ማህበረሰብ ማለት ከፍ ያለ ተጠያቂነት ማለት ነው። KYC በርቀት ባሉ ገበሬዎች እና በከተማ ገዥዎች መካከል የእምነት ድልድይ ይገነባል።',
      access: 'ሙሉ የመድረክ መዳረሻ',
      accessDesc: 'የተረጋገጡ ተጠቃሚዎች ብቻ ምርቶችን መመዝገብ፣ የአቅርቦት ሰንሰለቶችን ማስተዳደር እና የፋይናንስ መሳሪያዎችን መጠቀም ይችላሉ።',
      stepsTitle: 'የማረጋገጫ ደረጃዎች',
      step1: 'ብሔራዊ መታወቂያ ይስቀሉ',
      step1Desc: 'የኢትዮጵያን ብሔራዊ መታወቂያ ወይም ፓስፖርት ግልጽ ፎቶ ይስቀሉ።',
      step2: 'የንግድ መረጃ',
      step2Desc: 'ካለዎት የእርሻ ወይም የንግድ ምዝገባ ዝርዝሮችን ያቅርቡ።',
      step3: 'የባለሙያ ግምገማ',
      step3Desc: 'ቡድናችን የቀረበውን መረጃ ትክክለኛነት በ24-48 ሰዓታት ውስጥ ይገመግማል።'
    },
    digitalMarketPage: {
      title: 'ዲጂታል የገበያ ቦታ',
      subtitle: 'የኢትዮጵያን ምርት ከዓለም ጋር ማገናኘት',
      intro: 'የእኛ ዲጂታል የገበያ ቦታ ከመድረክ በላይ ነው — የግብርና ምርቶች በኢትዮጵያ ውስጥ እንዴት እንደሚገኙ፣ እንደሚገበያዩ እና ዋጋ እንደሚሰጣቸው የሚያሳይ አብዮት ነው።',
      featuresTitle: 'የገበያ ቦታው ዋና ፅንሰ-ሀሳቦች',
      price: 'የዋጋ ግኝት',
      priceDesc: 'ትክክለኛ የገበያ ፍላጎት እና አቅርቦት ላይ የተመሰረተ ግልጽ የዋጋ መረጃ በማቅረብ ደላላዎችን ያስቀሩ።',
      direct: 'ቀጥተኛ ግብይት',
      directDesc: 'ገዢዎች በቀጥታ ከገበሬዎች ጋር ይገናኛሉ፣ ይህም ትኩስ ምርቶችን እና ለአምራቾች የተሻለ ትርፍ ያረጋግጣል።',
      global: 'ዓለም አቀፍ ተደራሽነት',
      globalDesc: 'ጥራት ያላቸው የኢትዮጵያ ምርቶችን የሚፈልጉ ዓለም አቀፍ ገዢዎችን በማግኘት ንግድዎን ከአካባቢው ድንበር በላይ ያስፋፉ።',
      howTitle: 'እንዴት እንደሚሰራ',
      browse: 'ይፈልጉ እና ያወዳድሩ',
      browseDesc: 'የተረጋገጡ ምርቶችን በምድብ፣ በክልል ወይም በዋጋ ከሙሉ የጥራት መረጃ ጋር ይመልከቱ።',
      secure: 'ደህንነቱ የተጠበቀ ግብይት',
      secureDesc: 'የእኛ ዘመናዊ የአሰራር ስርዓት ክፍያዎች የሚለቀቁት ምርቱ መድረሱ ሲረጋገጥ ብቻ መሆኑን ያረጋግጣል።'
    },
    supplyChainPage: {
      title: 'የአቅርቦት ሰንሰለት አስተዳደር',
      subtitle: 'ከእርሻ እስከ ማዕድ ግልጽነት',
      intro: 'እያንዳንዱን የጤፍ ቅንጣት እና የቡና ፍሬ ጉዞ ለመከታተል በቴክኖሎጂ የታገዘ አሰራርን እንጠቀማለን፣ ይህም ሙሉ ተጠያቂነትን ያረጋግጣል።',
      conceptsTitle: 'የእምነት ሰንሰለት',
      trace: 'ሙሉ ተከታታይነት',
      traceDesc: 'የQR ኮድ በመቃኘት ምግብዎ በትክክል የት እንደበቀለ እና ማን እንደያዘው ማየት ይችላሉ።',
      efficiency: 'የሎጂስቲክስ ማመቻቸት',
      efficiencyDesc: 'በመረጃ የሚመራ የመጋዘን አስተዳደርን በመጠቀም ከምርት በኋላ የሚከሰተውን ብክነት ይቀንሱ።',
      quality: 'የጥራት ማረጋገጫ',
      qualityDesc: 'ዲጂታል መዝገቦች በእያንዳንዱ የአቅርቦት ሰንሰለት ደረጃ ላይ የጥራት ደረጃዎች መጠበቃቸውን ያረጋግጣሉ።',
      visionTitle: 'ራዕያችን',
      visionDesc: 'ውጤታማነት እና ፍትሃዊነት የሚገናኙበት፣ እያንዳንዱን ባለድርሻ አካል የሚያበረታታ ጠንካራ የግብርና መረብ መፍጠር።'
    },
    financingPage: {
      title: 'የግብርና ፋይናንስ',
      subtitle: 'ለግብርና እድገት የሚሆን አቅም',
      intro: 'የኢትዮጵያን የግብርና አቅም ለመጠቀም የፋይናንስ ተጠቃሚነት ቁልፍ ነው። በገበሬዎች እና በካፒታል መካከል ያለውን ክፍተት እንደፍናለን።',
      productsTitle: 'የፋይናንስ መፍትሄዎች',
      loans: 'አነስተኛ ብድሮች',
      loansDesc: 'ለዘር፣ ለማዳበሪያ እና ለመሳሪያዎች የሚሆን አነስተኛ ወለድ ያላቸው ወቅታዊ ብድሮችን ያግኙ።',
      insurance: 'የምርት መድን',
      insuranceDesc: 'በአጋሮቻችን በኩል በሚቀርቡ ዲጂታል የመድን ዋስትናዎች ምርትዎን ከአየር ንብረት አደጋዎች ይጠብቁ።',
      investment: 'የግብርና ኢንቨስትመንት',
      investmentDesc: 'ትላልቅ የግብርና ፕሮጀክቶችን በቀጥታ ፋይናንስ ማድረግ ከሚፈልጉ ባለሀብቶች ጋር ይገናኙ።',
      eligibilityTitle: 'እንዴት ብቁ መሆን ይቻላል?',
      criteria1: 'የተረጋገጠ የKYC ፕሮፋይል',
      criteria2: 'ጥሩ የግብይት ታሪክ',
      criteria3: 'የተመዘገበ እርሻ ወይም ህብረት ስራ ማህበር'
    },
    faqPage: {
      title: 'ተደጋጋሚ ጥያቄዎች',
      subtitle: 'ለጥያቄዎችዎ መልስ',
      q1: 'አግሮቼይን ኢትዮጵያ ምንድን ነው?',
      a1: 'አግሮቼይን ገበሬዎችን፣ ገዢዎችን እና አቅራቢዎችን በቴክኖሎጂ በተደገፈ ግልጽ የአቅርቦት ሰንሰለት በማገናኘት የኢትዮጵያን ግብርና ለማነቃቃት የተነደፈ ዲጂታል ስነ-ምህዳር ነው።',
      q2: 'እንዴት መሸጥ እጀምራለሁ?',
      a2: 'በቀላሉ እንደ ሻጭ ይመዝገቡ፣ የKYC ማረጋገጫዎን ያጠናቅቁ እና ወዲያውኑ ምርቶችዎን መመዝገብ መጀመር ይችላሉ።',
      q3: 'ክፍያዎች ደህንነታቸው የተጠበቀ ነው?',
      a3: 'አዎ። አስተማማኝ ግብይቶችን ለማረጋገጥ ከቴሌብርር፣ ከሳፋሪኮም ኤም-ፔሳ እና ከዋና ዋና የኢትዮጵያ ባንኮች ጋር እንሰራለን።',
      q4: 'ጥራት እንዴት ይረጋገጣል?',
      a4: 'በእኛ የተከታታይነት ስርዓት እና በሻጮች ደረጃ አሰጣጥ በኩል ገዢዎች ስለ ምርቱ አመጣጥ እና ጥራት ትክክለኛ መረጃ ማግኘት ይችላሉ።',
      q5: 'ትዕዛዜን መከታተል እችላለሁ?',
      a5: 'በእርግጥ። እያንዳንዱ ትዕዛዝ ከእርሻ እስከ ቤትዎ ደጃፍ ድረስ ያለውን ጉዞ ለመከታተል የሚያስችል ዳሽቦርድ አለው።',
      q6: 'ክርክር ቢፈጠር ምን ይደረጋል?',
      a6: 'መድረካችን ችግሮችን በፍትሃዊነት እና በፍጥነት ለመፍታት ዲጂታል ማስረጃዎችን የሚጠቀም የክርክር አፈታት ማዕከልን ያካትታል።'
    },
    legal: {
      privacyTitle: 'የግላዊነት መመሪያ',
      privacyUpdate: 'የመጨረሻው ማሻሻያ፡ የካቲት 2026',
      termsTitle: 'የአጠቃቀም ውሎች',
      termsUpdate: 'የመጨረሻው ማሻሻያ፡ የካቲት 2026',
      cookieTitle: 'የኩኪ ፖሊሲ',
      cookieUpdate: 'የመጨረሻው ማሻሻያ፡ የካቲት 2026',
      intro: 'የእርስዎ እምነት ትልቁ ሀብታችን ነው። የእርስዎን መረጃ ለመጠበቅ እና ግልጽ የሆነ ህጋዊ ማዕቀፍ ለማረጋገጥ ቁርጠኞች ነን።',
      dataCollection: 'የመረጃ አሰባሰብ',
      dataCollectionDesc: 'ለKYC አስፈላጊ የሆኑ እንደ መታወቂያ ያሉ መረጃዎችን እና ምርቱን ለመላክ አስፈላጊ አድራሻዎችን ብቻ እንሰበስባለን።',
      dataSecurity: 'የመረጃ ደህንነት',
      dataSecurityDesc: 'ሁሉም ግንኙነቶች በከፍተኛ ደረጃ SSL የተመሰጠሩ እና ደህንነቱ በተጠበቀ ሰርቨር ላይ የተቀመጡ ናቸው።',
      userResponsibilities: 'የተጠቃሚ ግዴታዎች',
      userResponsibilitiesDesc: 'ተጠቃሚዎች ትክክለኛ መረጃ መስጠት እና በመድረኩ ላይ ለሚገቡባቸው ግብይቶች ታማኝ መሆን አለባቸው።'
    },
    dashboard: {
      welcome: 'እንኳን ደህና መጡ',
      subtitle: 'የግብርና ንግድዎን በብቃት ያስተዳድሩ።',
      buyProducts: 'ምርቶችን ይግዙ',
      sellProducts: 'ምርቶችን ይሽጡ',
      salesOverview: 'የሽያጭ አጠቃላይ እይታ',
      periods: {
        d7: '7 ቀናት',
        d30: '30 ቀናት',
        d90: '90 ቀናት'
      },
      loading: 'በመጫን ላይ...',
      stats: {
        posted: 'የተለጠፉ ምርቶች',
        totalOrders: 'ጠቅላላ ትዕዛዞች',
        sold: 'የተሸጡ ምርቶች',
        rating: 'የደንበኛ ደረጃ'
      },
      recentActivity: 'የቅርብ ጊዜ እንቅስቃሴዎች',
      noActivity: 'ምንም የቅርብ ጊዜ እንቅስቃሴ የለም።',
      quickActions: {
        title: 'ፈጣን ተግባራት',
        addProduct: 'አዲስ ምርት አክል',
        addProductDesc: 'የግብርና ምርቶችዎን ለሽያጭ ይዘርዝሩ',
        viewMarket: 'ገበያ',
        about: 'ስለ እኛ',
        aboutDesc: 'ስለ ተልዕኳችን የበለጠ ይወቁ',
        addBalance: 'ቀሪ ሂሳብ ጨምር',
        addBalanceDesc: 'ለግብይቶች ገንዘብ ወደ ቦርሳዎ ያስገቡ',
        viewCustomers: 'ደንበኞችን ይመልከቱ',
        viewCustomersDesc: 'በአካባቢዎ ያሉ ሊሆኑ የሚችሉ ገዢዎችን ይመልከቱ',
        verifyAccount: 'መለያ ያረጋግጡ',
        verifyAccountDesc: 'ሙሉ ባህሪያትን ለማግኘት KYCን ያጠናቅቁ'
      },
      chart: {
        sales: 'ሽያጭ (ETB)',
        date: 'ቀን',
        salesAmount: 'የሽያጭ መጠን (ETB)'
      },
      viewAllOrders: 'ሁሉንም ትዕዛዞች ይመልከቱ',
      about: 'ስለ መድረኩ',
      time: {
        local: 'የአካባቢ ሰዓት',
        ethiopian: 'የኢትዮጵያ ሰዓት',
        periods: {
          morning: 'ጥዋት',
          afternoon: 'ከሰዓት',
          evening: 'ማታ',
          night: 'ሌሊት'
        }
      },
      productUpload: {
        title: 'ምርት ይስቀሉ',
        productTitle: 'የምርት ስም',
        enterTitle: 'የምርቱን ስም ያስገቡ',
        type: 'ዓይነት',
        selectType: 'ዓይነት ይምረጡ',
        price: 'ዋጋ (ETB)',
        quantity: 'ብዛት (ኪ.ግ)',
        originAddress: 'መነሻ አድራሻ',
        enterAddress: 'መነሻ አድራሻ ያስገቡ',
        images: 'ምስሎች (ከፍተኛ 6)',
        description: 'መግለጫ',
        describeProduct: 'ስለ ምርትዎ ይግለጹ...',
        upload: 'ስቀል',
        uploading: 'በመጫን ላይ...',
        cancel: 'ይቅር',
        chooseFiles: 'ፋይል ይምረጡ',
        noFileChosen: 'ምንም ፋይል አልተመረጠም',
        maxImages: 'ከፍተኛ 6 ምስሎች ብቻ ይፈቀዳሉ',
        fillRequired: 'እባክዎ ሁሉንም አስፈላጊ መረጃዎች ይሙሉ',
        uploadSuccess: 'ምርቱ በተሳካ ሁኔታ ተሰቅሏል',
        uploadFailed: 'ምርቱን መስቀል አልተቻለም',
        types: {
          vegetable: 'አትክልት',
          fruit: 'ፍራፍሬ',
          grain: 'ጥራጥሬ',
          dairy: 'ወተት እና የወተት ተዋጽኦ',
          other: 'ሌላ'
        }
      },
      profile: {
        email: 'ኢሜይል',
        balance: 'ቀሪ ሂሳብ',
        fullName: 'ሙሉ ስም',
        phone: 'ስልክ ቁጥር',
        address: 'አድራሻ',
        location: 'ቦታ',
        saveChanges: 'ለውጦችን ያስቀምጡ',
        darkMode: 'ጨለማ',
        lightMode: 'ብርሃን',
        logout: 'ውጣ',
        accountRestricted: 'መለያ ተገድቧል',
        restrictedMessage: 'መለያዎ በአስተዳዳሪ ተገድቧል። በዚህ ጊዜ ምርቶችን መግዛት ወይም መሸጥ አይችሉም። እባክዎ ለእርዳታ ድጋፍን ያነጋግሩ።',
        notSet: 'አልተዘጋጀም',
        enter: 'ያስገቡ'
      },
      theme: {
        light: 'የብርሃን ሁነታ',
        dark: 'የጨለማ ሁነታ'
      },
      activity: {
        youSold: 'ሸጠዋል',
        to: 'ለ',
        youPurchased: 'ገዝተዋል',
        from: 'ከ',
        you: 'እርስዎ'
      },
      status: {
        pending: 'በጥበቃ ላይ',
        shipped: 'ተልኳል',
        delivered: 'ደርሷል',
        cancelled: 'ተሰርዟል',
        completed: 'ተጠናቋል',
        unknown: 'ያልታወቀ',
        verified: 'የተረጋገጠ',
        unverified: 'ያልተረጋገጠ',
        rejected: 'ውድቅ ተደርጓል'
      },
      actions: {
        markShipped: 'ተልኳል በል',
        confirmDelivery: 'መድረሱን አረጋግጥ'
      }
    },
    contact: {
      title: 'አግሮቼይን ኢትዮጵያን ያግኙ',
      titlePart1: 'አግሮቼይን ኢትዮጵያን',
      titlePart2: 'ያግኙ',
      subtitle: "አብረን እንደግ! የግብርና ጉዞዎን ለመለወጥ ያነጋግሩን።",
      getInTouch: 'ይገናኙ',
      sendMessage: 'መልዕክት ይላኩልን',
      submit: 'መልዕክት ላክ',
      fullName: 'ሙሉ ስም',
      email: 'የኢሜይል አድራሻ',
      subject: 'ርዕስ',
      message: 'መልእክትዎ',
      recordVoice: 'ድምፅ ይቅዱ',
      stop: 'ቀረፃ አቁም',
      attachFiles: 'ፋይሎችን አያይዝ',
      sendButton: 'ዛሬ መልእክት ላክ',
      office: 'ቢሮአችን',
      phone: 'ስልክ',
      emailInfo: 'ኢሜይል',
      hours: 'የስራ ሰዓታት',
      faqTitle: 'በተደጋጋሚ የሚጠየቁ ጥያቄዎች',
      faqSubtitle: 'ለተለመዱ ጥያቄዎች መልሶችን ያግኙ',
      ctaTitle: 'የእርስዎን የግብርና ንግድ ለመቀየር ዝግጁ ነዎት?',
      ctaSubtitle: 'ቀድሞውም ከመድረካችን የሚጠቀሙ በ ሺዎች የሚቆጠሩ የኢትዮጵያ ገበሬዎች ይቀላቀሉ',
      getStarted: 'ዛሬ ጀምር',
      success: 'መልዕክትዎ በተሳካ ሁኔታ ተልኳል!',
      error: 'መልዕክት መላክ አልተቻለም።',
      invalidEmail: 'ልክ ያልሆነ ኢሜል አድራሻ',
      micDenied: 'ማይክሮፎን መጠቀም አልተቻለም።',
      networkError: 'የአውታረ መረብ ችግር። እባክዎ እንደገና ይሞክሩ።',
      officeDetails: {
        bole: 'ቦሌ ክፍለ ከተማ፣ አዲስ አበባ',
        region: 'ኢትዮጵያ፣ ምስራቅ አፍሪካ',
        poBox: 'የፖስታ ሳጥን ቁጥር 12345'
      },
      phoneNumbers: 'ስልክ ቁጥሮች',
      emailAddresses: 'የኢሜል አድራሻዎች',
      hoursMonFri: 'ከሰኞ - አርብ',
      hoursSat: 'ቅዳሜ',
      hoursSun: 'እሁድ',
      hoursClosed: 'ዝግ ነው',
      messagePlaceholder: 'መልዕክትዎን እዚህ ይጻፉ...',
      recording: {
        start: 'በድምፅ መላክ ጀምር',
        stop: 'መቅዳት አቁም',
        delete: 'ቅጂውን ሰርዝ'
      },
      files: 'ፋይሎችን አያይዝ',
      uploadLabel: 'ፋይሎችን ስቀል',
      faqDesc: 'ስለ አግሮቼን ኢትዮጵያ የሚነሱ ጥያቄዎችን እዚህ ያግኙ።',
      faqPart1: 'በተደጋጋሚ',
      faqPart2: 'የሚጠየቁ',
      faqPart3: 'ጥያቄዎች',
      ctaBottomTitle: 'ንግድዎን ለመለወጥ ዝግጁ ነዎት?',
      ctaBottomTitlePart1: 'ንግድዎን ለመለወጥ',
      ctaBottomTitlePart2: 'ዝግጁ ነዎት?',
      ctaBottomSubtitle: 'አግሮቼን ኢትዮጵያን ይቀላቀሉ እና ግልጽ፣ ቀልጣፋ የግብርና ሥነ-ምህዳር ይክፈቱ።',
      faq: [
        {
          question: 'የማረጋገጫው ሂደት እንዴት ይሰራል?',
          answer: 'የኢትዮጵያ ብሔራዊ መታወቂያዎን እና መሰረታዊ የንግድ መረጃ ይስቀሉ። ቡድናችን ማስገባቶችን በ24-48 ሰዓታት ውስጥ ይገመግማል።'
        },
        {
          question: 'የግብይት ክፍያዎቹ ስንት ናቸው?',
          answer: 'አገልግሎቶቻችንን ለመጠበቅ እና ለማሻሻል በተጠናቀቁ ግብይቶች ላይ ትንሽ 2% የመድረክ ክፍያ እንከፍላለን።'
        },
        {
          question: 'ምርቶቼን እንዴት እከታተላለሁ?',
          answer: 'እያንዳንዱምርት ከእርሻ እስከ ሸማች ጉዞውን በደህንነቱ በተጠበቀ ዲጂታል ቴክኖሎጂ የሚከታተል ልዩ ዲጂታል መዝገብ ያገኛል።'
        },
        {
          question: 'የግል መረጃዬ ደህንነቱ የተጠበቀ ነው?',
          answer: 'አዎ፣ ሁሉንም የተጠቃሚ ውሂብ እና ግብይቶችን ለመጠበቅ በኢንዱስትሪ-ደረጃ ምስጠራ እና የደህንነት እርምጃዎችን እንጠቀማለን።'
        }
      ],
    },
    about: {
      title: 'ስለ አግሮቼን ኢትዮጵያ',
      titlePart1: 'ስለ',
      titlePart2: 'አግሮቼን ኢትዮጵያ',
      subtitle: 'የምግብ አቅርቦት ሰንሰለቱን በግልፅነት እና በቴክኖሎጂ በማዘመን ላይ።',
      mission: {
        title: 'ተልዕኳችን',
        desc: 'በቴክኖሎጂ የታገዘ ግልጽ፣ ቀልጣፋ እና ትርፋማ የአቅርቦት ሰንሰለት ስነ-ምህዳር በመፍጠር የኢትዮጵያን ግብርና መለወጥ።'
      },
      vision: {
        title: 'ራዕያችን',
        desc: 'በአፍሪካ ቀዳሚ የግብርና ቴክኖሎጂ መድረክ በመሆን፣ ገበሬዎችን ማብቃት እና ማህበረሰቦችን በፈጠራ ማገናኘት።'
      },
      locations: {
        addisAbaba: 'አዲስ አበባ',
        bahirDar: 'ባህር ዳር',
        hawassa: 'ሀዋሳ',
        direDawa: 'ድሬ ዳዋ',
        mekelle: 'መቀሌ',
        adama: 'አዳማ',
        gondar: 'ጎንደር'
      },
      values: {
        title: 'እሴቶቻችን',
        titlePart1: 'እሴቶ',
        titlePart2: 'ቻችን',
        desc: 'ግልጽነት፣ ፈጠራ፣ ዘላቂነት እና ማብቃት ለኢትዮጵያ የግብርና ማህበረሰቦች የምናደርገውን ድጋፍ ይመራሉ ።'
      },
      impact: {
        title: 'ተፅእኖአችን',
        desc: 'ለአለም አቀፍ ገበያ ተደራሽነት እና ፍትሃዊ ዋጋ በማቅረብ በገጠር ማህበረሰቦች ውስጥ አወንታዊ ለውጥ ማምጣት።'
      },
      story: {
        title: 'ታሪካችን',
        titlePart1: 'ታሪ',
        titlePart2: 'ካችን',
        p1: 'አግሮቼይን ኢትዮጵያ የተመሰረተው የኢትዮጵያን ገበሬዎች ለማንሳት እና ባህላዊ የግብርና አቅርቦት ሰንሰለት ጉድለቶችን ለመቅረፍ ባለን ራዕይ ነው። በ2025 የተመሰረተ ሲሆን፣ በገጠር አምራቾች እና በአለም አቀፍ ገበያዎች መካከል ያለውን ልዩነት ለመሙላት የላቀ ቴክኖሎጂን እንጠቀማለን።',
        p2: 'መድረካችን እውነተኛ ጊዜ የክትትል አገልግሎት፣ አስተማማኝ ሎጅስቲክስ እና ዲጂታል ገበያ ያቀርባል፣ ይህም ገበሬዎች ፍትሃዊ ዋጋ እና ቀጥተኛ የገዢ ግንኙነት እንዲኖራቸው ያደርጋል። ለዘላቂ አሰራር፣ ለአካባቢ ኢኮኖሚ ድጋፍ እና በግብርና ላይ ፈጠራን ለማጎልበት ቆርጠን ተነስተናል።',
        p3: 'በግብርና ባለሙያዎች እና በቴክኖሎጂ ፈጣሪዎች ቡድን፣ አግሮቼይን ኢትዮጵያ በመላው አፍሪካ ለግብርና ለውጥ አዲስ ደረጃን ለማውጣት ያለማል፣ ይህም ለሚቀጥሉት ትውልዶች ብልጽግናን ያረጋግጣል።'
      },
      services: {
        title: 'የእኛ ዋና አገልግሎቶች',
        titlePart1: 'የእኛ ዋና',
        titlePart2: 'አገልግሎቶች',
        subtitle: 'የኢትዮጵያን ግብርና የሚቀይሩ የፈጠራ መፍትሄዎች።',
        traceability: {
          title: 'የተሻሻለ ተከታታይነት',
          desc: 'ለማይመጣጠን ግልጽነት ምርቶችዎን ከእርሻ እስከ ሸማች ደህንነቱ በተጠበቀ እና ሊረጋገጥ በሚችል መዝገብ ይከታተሉ።',
          f1: 'ሊረጋገጡ የሚችሉ የግብይት መዝገቦች',
          f2: 'የእውነተኛ ጊዜ የአቅርቦት ሰንሰለት ታይነት',
          f3: 'ማጭበርበርን መከላከል እና ትክክለኛነትን ማረጋገጥ',
          f4: 'አውቶማቲክ የአሰራር ተገዢነት ሪፖርት'
        },
        logistics: {
          title: 'ሎጅስቲክስ እና ትራንስፖርት',
          desc: 'እርሻዎችን ከገበያ ጋር የሚያገናኙ አስተማማኝ የትራንስፖርት መፍትሄዎች፣ ወቅታዊ አቅርቦትን ያረጋግጣሉ።',
          f1: 'የተመቻቸ መስመር እቅድ',
          f2: 'የቀዝቃዛ ሰንሰለት አስተዳደር',
          f3: 'የተሽከርካሪ መርከቦች ክትትል እና የእውነተኛ ጊዜ ዝመናዎች',
          f4: 'የመጨረሻ ማይል ማቅረቢያ ቅንጅት'
        },
        kyc: {
          title: 'KYC ማረጋገጫ',
          desc: 'ለታማኝ የገበያ ተሳትፎ የኢትዮጵያ ብሔራዊ መታወቂያ በመጠቀም ደህንነቱ የተጠበቀ ማንነት ማረጋገጫ።',
          f1: 'የኢትዮጵያ ብሄራዊ መታወቂያ ውህደት',
          f2: 'ባለብዙ-ደረጃ የማረጋገጫ ሂደት',
          f3: 'ከአካባቢው ደንቦች ጋር ተገዢነት'
        },
        marketplace: {
          title: 'ዲጂታል ገበያ',
          desc: 'መካከለኞችን በማስወገድ እና ትርፍን በማሳደግ ገበሬዎችን በቀጥታ ከገዢዎች ጋር ያገናኙ።',
          f1: 'ቀጥተኛ የገበሬ-ለ-ገዢ ግንኙነቶች',
          f2: 'የእውነተኛ ጊዜ የዋጋ ግኝት',
          f3: 'ደህንነቱ የተጠበቀ የክፍያ ሂደት',
          f4: 'ባለብዙ ቋንቋ ድጋፍ',
          productsFound: 'ምርቶች ተገኝተዋል',
          noProductsFound: 'ምንም ምርቶች አልተገኙም',
          allSoldOut: 'ሁሉም ምርቶች አልቀዋል',
          pagination: {
            previous: 'ቀዳሚ',
            next: 'ቀጣይ',
            page: 'ገጽ',
            of: 'ከ'
          }
        },
        additional: {
          title: 'ተጨማሪ ባህሪያት',
          titlePart1: 'ተጨማሪ',
          titlePart2: 'ባህሪያት',
          subtitle: 'ለመድረካችን ያለዎትን ልምድ ማሻሻል።',
          mobile: { title: 'የሞባይል መተግበሪያ', desc: '(በቅርቡ የሚመጣ) በእኛ የሞባይል መተግበሪያ በጉዞ ላይ እያሉ የመድረክ ባህሪያትን ያግኙ።' },
          data: { title: 'የውሂብ አስተዳደር', desc: 'ደህንነቱ የተጠበቀ የደመና ማከማቻ እና የግብርና መረጃ አያያዝ።' },
          security: { title: 'ደህንነት', desc: 'ሁሉንም የተጠቃሚ ውሂብ እና ግብይቶች የሚጠብቅ የድርጅት-ደረጃ ደህንነት።' }
        }
      },
      testimonials: {
        title: 'ደንበኞቻችን ምን ይላሉ',
        subtitle: 'አግሮቼይን ኢትዮጵያን ከሚያምኑ ገበሬዎች እና ንግዶች ይስሙ።',
        t1: {
          quote: 'አግሮቼይን ሰብሎቻችንን የምንሸጥበትን መንገድ ቀይሮታል፣ በቀጥታ ከገዢዎች ጋር ያገናኘናል እና ፍትሃዊ ዋጋን ያረጋግጣል።',
          author: 'አበበ ከበደ',
          role: 'ገበሬ፣ አማራ ክልል'
        },
        t2: {
          quote: 'የተከታታይነት ባህሪው ደንበኞቻችን በምርቶቻችን ትክክለኛነት ላይ እምነት እንዲኖራቸው ያደርጋል።',
          author: 'ሰላማዊት ታደሰ',
          role: 'የግብርና ህብረት ስራ ማህበር ስራ አስኪያጅ'
        },
        t3: {
          quote: 'የሎጅስቲክስ መፍትሄዎች የእኛን የአቅርቦት ሰንሰለት አቀላጥፈዋል፣ ጊዜን በመቆጠብ እና ወጪን በመቀነስ።',
          author: 'ዮናስ አለማየሁ',
          role: 'የገበያ አከፋፋይ'
        }
      },
      team: {
        title: 'ቡድናችንን ያግኙ',
        subtitle: 'የግብርና እውቀትን ከዘመናዊ ቴክኖሎጂ ጋር ማጣመር።',
        tilahun: { role: 'ዋና ስራ አስፈፃሚ እና መስራች', bio: 'ስለ ኢትዮጵያ የግብርና ስርዓት ጥልቅ ፍቅር ያላቸው የግብርና ባለሙያ።' },
        bantalem: { role: 'የቴክኖሎጂ ዋና ኦፊሰር', bio: 'የግብርና አቅርቦት ሰንሰለት መፍትሄዎችን በማስጠበቅ ረገድ ባለሙያ።' },
        tegene: { role: 'የክንውን ኃላፊ', bio: 'ጥልቅ የግብርና እውቀት ያላቸው የቀድሞ የግብርና ኤክስቴንሽን ኦፊሰር።' }
      },
      weather: {
        title: 'እውነተኛ ጊዜ የአየር ሁኔታ በ',
        subtitle: 'ከአካባቢዎ በራስ-ሰር የተገኘ ወይም ለትክክለኛ እቅድ ከኢትዮጵያ ቦታዎች ይምረጡ።',
        detecting: 'እውነተኛ ጊዜ የአየር ሁኔታን በማምጣት ላይ...',
        retry: 'እንደገና ይሞክሩ',
        useLocation: 'የአሁኑን አካባቢ ተጠቀም',
        humidity: 'እርጥበት',
        windSpeed: 'የንፋስ ፍጥነት',
        precipitation: 'ዝናብ',
        tip: 'ጠቃሚ ምክር: ለዝናብ ክትትል ያድርጉ; ደረቅ ከሆነ የመስኖ ዝግጅት ያድርጉ።',
        condition: 'ሁኔታ',
        feelsLike: 'እንደዚህ ይሰማል',
        high: 'ከፍተኛ',
        low: 'ዝቅተኛ',
        updateInfo: 'የአየር ሁኔታ መረጃ ከበስተጀርባ በእውነተኛ ጊዜ ተገኝቷል። በእያንዳንዱ ጭነት ይዘምናል።'
      },
      payment: {
        title: 'ሂሳብ ይጨምሩ',
        amount: 'መጠን (ETB)',
        enterAmount: 'መጠን ያስገቡ',
        method: 'የክፍያ ዘዴ',
        payNow: 'ወደ ቦርሳ ጨምር',
        processing: 'በማስኬድ ላይ...',
        cancel: 'ይቅር'
      },
      cta: {
        title: 'የኢትዮጵያን ግብርና ዛሬ ይለውጡ',
        subtitle: 'ግልጽነትን እና ፈጠራን በመጠቀም ግብርናን አብዮት ከሚያደርጉ በሺዎች የሚቆጠሩ ገበሬዎች እና ንግዶች ጋር ይቀላቀሉ።',
        contactSales: 'ሽያጭ ያግኙ'
      },
      dashboard: {
        time: { local: 'የአካባቢ ሰዓት', ethiopian: 'የኢትዮጵያ ሰዓት' },
        stats: { posted: 'የተለጠፉ ምርቶች', totalOrders: 'ጠቅላላ ትዕዛዞች', sold: 'የተሸጡ ምርቶች', rating: 'ደረጃ', loading: 'በመጫን ላይ...' },
        status: { completed: 'ተጠናቀቀ', shipped: 'ተልኳል', pending: 'በመጠባበቅ ላይ', cancelled: 'ተሰርዟል' },
        chart: { sales: 'ሽያጭ', date: 'ቀን', salesAmount: 'የሽያጭ መጠን' },
        quickActions: {
          addProduct: 'ምርት ጨምር', addProductDesc: 'አዲስ ምርት ለሽያጭ ይለጥፉ',
          addBalance: 'ሂሳብ ጨምር', addBalanceDesc: 'ቦርሳዎን ይሙሉ',
          viewCustomers: 'ደንበኞችን ይመልከቱ', viewCustomersDesc: 'የደንበኛ መሰረትዎን ያስተዳድሩ',
          about: 'ስለ መድረኩ', aboutDesc: 'ስለ አግሮቼይን የበለጠ ይወቁ',
          verifyAccount: 'መለያ አረጋግጥ', verifyAccountDesc: 'ለማረጋገጫ መታወቂያ ይስቀሉ'
        },
        profile: { accountRestricted: 'መለያ ተገድቧል', restrictedMessage: 'መለያዎ ተገድቧል። እባክዎን ድጋፍ ሰጪን ያነጋግሩ።' }
      }
    }
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    const savedLang = localStorage.getItem('preferredLanguage')
    if (savedLang && (savedLang === 'en' || savedLang === 'am')) {
      setLanguage(savedLang)
    }
  }, [])

  const changeLanguage = (lang) => {
    if (lang === 'en' || lang === 'am') {
      setLanguage(lang)
      localStorage.setItem('preferredLanguage', lang)
    }
  }

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]

    if (language === 'am' && key.startsWith('marketplace')) {
      console.log(`[LanguageContext] Lookup: ${key}`);
      console.log(`[LanguageContext] am.marketplace keys:`, translations['am']?.marketplace ? Object.keys(translations['am'].marketplace) : 'MISSING');
    }

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback to English if translation missing
        let englishValue = translations.en
        for (const ek of keys) {
          if (englishValue && typeof englishValue === 'object' && ek in englishValue) {
            englishValue = englishValue[ek]
          } else {
            englishValue = key
            break
          }
        }
        console.warn(`Translation for key "${key}" missing in "${language}". Falling back to English or key itself.`)
        return englishValue
      }
    }

    return value || key
  }

  const transliterateName = (name) => {
    if (language !== 'am') return name;
    if (!name) return '';
    const map = {
      'Tilahun': 'ጥላሁን',
      'Bantalem': 'ባንተአለም',
      'Tegene': 'ተገኔ',
      'Abebe': 'አበበ',
      'Kebede': 'ከበደ',
      'Selamawit': 'ሰላማዊት',
      'Tadesse': 'ታደሰ',
      'Yonas': 'ዮናስ',
      'Alemayehu': 'አለማየሁ',
      'Tomato': 'ቲማቲም',
      'Onion': 'ሽንኩርት',
      'Potato': 'ድንች',
      'Garlic': 'ነጭ ሽንኩርት',
      'Pepper': 'ቃሪያ',
      'Coffee': 'ቡና',
      'Teff': 'ጤፍ',
      'Wheat': 'ስንዴ',
      'Barley': 'ገብስ',
      'Maize': 'በቆሎ',
      'Honey': 'ማር',
      'Milk': 'ወተት',
      'Egg': 'እንቁላል',
      'Apple': 'ፖም',
      'Banana': 'ሙዝ',
      'Orange': 'ብርቱካን',
      'Mango': 'ማንጎ',
      'Avocado': 'አቮካዶ',
      'Pineapple': 'አናናስ'
    };
    return map[name] || name;
  };

  const value = {
    language,
    changeLanguage,
    t,
    transliterateName
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageProvider;
// Translation keys updated: Resend + Login + Dashboard