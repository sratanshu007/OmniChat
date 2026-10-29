/**
 * ChatIndia Localization (English & Hindi)
 * Ready for additional Indian regional languages (Tamil, Telugu, Bengali, Marathi, etc.)
 */

export type Language = 'en' | 'hi';

export const translations = {
  en: {
    appName: 'ChatIndia',
    tagline: 'Chat. Connect. Share.',
    tabs: {
      chats: 'Chats',
      contacts: 'Contacts',
      discover: 'Discover',
      services: 'Services',
      me: 'Me'
    },
    common: {
      search: 'Search chats, contacts, and groups',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      back: 'Back',
      done: 'Done',
      send: 'Send',
      add: 'Add',
      delete: 'Delete',
      edit: 'Edit',
      retry: 'Retry',
      offline: 'You are currently offline. Check connection.',
      loading: 'Loading...'
    },
    chats: {
      title: 'Chats',
      greetingMorning: 'Good morning',
      greetingAfternoon: 'Good afternoon',
      greetingEvening: 'Good evening',
      scanQr: 'Scan QR',
      payUpi: 'Scan & Pay',
      wallet: 'UPI Wallet',
      newChat: 'New Chat',
      activeNow: 'Active Now',
      typing: 'typing...',
      emptyChats: 'No conversations yet',
      emptySub: 'Scan a friend\'s QR code or start a new chat!',
      startChatBtn: 'Start Chatting',
      pinned: 'PINNED',
      recent: 'RECENT'
    },
    chatDetail: {
      placeholder: 'Type a message...',
      sendVoice: 'Voice Note',
      sendPhoto: 'Photo',
      sendDocument: 'Document',
      shagunGift: 'Shagun Envelope',
      upiTransfer: 'UPI Transfer',
      callAudio: 'Audio Call',
      callVideo: 'Video Call'
    },
    contacts: {
      title: 'Contacts',
      searchPlaceholder: 'Search contacts by name or UPI ID',
      newFriends: 'New Friend Requests',
      scanQr: 'Scan QR Code',
      myQrCard: 'My QR Profile Card',
      officialAccounts: 'Verified Businesses & Channels',
      createGroup: 'Create New Group',
      allContacts: 'ALL CONTACTS',
      friendAdded: 'Friend added successfully!'
    },
    discover: {
      title: 'Discover',
      moments: 'Moments & Stories',
      channels: 'Channels & Video Clips',
      scanQr: 'Scan QR Code',
      nearby: 'Nearby People & Communities',
      trending: 'Trending Across India',
      searchDirectory: 'Search India Directory'
    },
    services: {
      title: 'Services & Mini Apps',
      bannerTitle: 'Indian Super Ecosystem',
      bannerSubtitle: 'Instant services, Zero app downloads. Powered by UPI.',
      categories: {
        all: 'All',
        utilities: 'Utilities',
        travel: 'Travel',
        food: 'Food',
        citizen: 'Citizen Services',
        finance: 'Finance'
      }
    },
    wallet: {
      title: 'ChatIndia UPI Wallet',
      balanceLabel: 'Total Available Balance',
      kycVerified: 'UPI & KYC Verified',
      receiveQr: 'Receive QR',
      addMoney: 'Add Money',
      scanPay: 'Scan & Pay',
      sendUpi: 'Send UPI',
      transactions: 'TRANSACTION HISTORY'
    },
    me: {
      title: 'Me',
      upiIdLabel: 'UPI ID',
      myQr: 'My QR Code',
      walletRow: 'ChatIndia Pay & UPI',
      saved: 'Saved Messages & Notes',
      moments: 'My Moments & Posts',
      stickers: 'Stickers & Memes',
      settings: 'Settings & Privacy',
      help: 'Help & Customer Support',
      logout: 'Log Out'
    },
    onboarding: {
      welcome: 'Welcome to ChatIndia',
      subtitle: 'The modern Indian super communication platform',
      slide1Title: 'Chat & Connect Seamlessly',
      slide1Desc: 'Rich real-time messaging, voice notes, stickers, and crystal-clear voice/video calls.',
      slide2Title: 'Scan & Connect Instantly',
      slide2Desc: 'Exchange unguessable, secure QR tokens to add friends without exposing your private phone number.',
      slide3Title: 'Super Fast UPI Payments',
      slide3Desc: 'Send Shagun gift envelopes, split dinner bills, and pay merchants directly inside conversations.',
      slide4Title: 'Instant Mini Ecosystem',
      slide4Desc: 'Book cabs, order biryani, check IRCTC train status, and pay utility bills without separate apps.',
      getStarted: 'Get Started',
      skip: 'Skip'
    }
  },
  hi: {
    appName: 'चैटइंडिया',
    tagline: 'बातचीत। जुड़ाव। साझा करें।',
    tabs: {
      chats: 'बातें',
      contacts: 'संपर्क',
      discover: 'खोजें',
      services: 'सेवाएं',
      me: 'मैं'
    },
    common: {
      search: 'बातें, संपर्क और समूह खोजें',
      cancel: 'रद्द करें',
      confirm: 'पुष्टि करें',
      save: 'सहेजें',
      back: 'वापस',
      done: 'हो गया',
      send: 'भेजें',
      add: 'जोड़ें',
      delete: 'हटाएं',
      edit: 'बदलें',
      retry: 'पुनः प्रयास करें',
      offline: 'आप ऑफ़लाइन हैं। इंटरनेट जांचें।',
      loading: 'लोड हो रहा है...'
    },
    chats: {
      title: 'बातें',
      greetingMorning: 'शुभ प्रभात',
      greetingAfternoon: 'शुभ दोपहर',
      greetingEvening: 'शुभ संध्या',
      scanQr: 'क्यूआर स्कैन',
      payUpi: 'स्कैन और भुगतान',
      wallet: 'यूपीआई वॉलेट',
      newChat: 'नई बातचीत',
      activeNow: 'सक्रिय',
      typing: 'टाइप कर रहे हैं...',
      emptyChats: 'अभी कोई बातचीत नहीं है',
      emptySub: 'मित्र का क्यूआर कोड स्कैन करें या नई चैट शुरू करें!',
      startChatBtn: 'बातचीत शुरू करें',
      pinned: 'पिन किए गए',
      recent: 'हाल के'
    },
    chatDetail: {
      placeholder: 'संदेश लिखें...',
      sendVoice: 'वॉयस नोट',
      sendPhoto: 'तस्वीर',
      sendDocument: 'दस्तावेज़',
      shagunGift: 'शगुन लिफाफा',
      upiTransfer: 'यूपीआई ट्रांसफर',
      callAudio: 'ऑडियो कॉल',
      callVideo: 'वीडियो कॉल'
    },
    contacts: {
      title: 'संपर्क',
      searchPlaceholder: 'नाम या यूपीआई आईडी से खोजें',
      newFriends: 'मित्रता अनुरोध',
      scanQr: 'क्यूआर कोड स्कैन करें',
      myQrCard: 'मेरा क्यूआर कार्ड',
      officialAccounts: 'सत्यापित व्यवसाय व चैनल',
      createGroup: 'नया समूह बनाएं',
      allContacts: 'सभी संपर्क',
      friendAdded: 'मित्र सफलतापूर्वक जुड़ गया!'
    },
    discover: {
      title: 'खोजें',
      moments: 'मोमेंट्स और कहानियां',
      channels: 'चैनल और वीडियो क्लिप',
      scanQr: 'क्यूआर स्कैन करें',
      nearby: 'आस-पास के लोग',
      trending: 'भारत में ट्रेंडिंग',
      searchDirectory: 'भारत डायरेक्टरी खोजें'
    },
    services: {
      title: 'सेवाएं और मिनी ऐप्स',
      bannerTitle: 'भारतीय सुपर इकोसिस्टम',
      bannerSubtitle: 'तुरंत सेवाएं, बिना ऐप डाउनलोड किए। यूपीआई द्वारा संचालित।',
      categories: {
        all: 'सभी',
        utilities: 'सुविधाएं',
        travel: 'यात्रा',
        food: 'भोजन',
        citizen: 'नागरिक सेवाएं',
        finance: 'वित्तीय सेवाएं'
      }
    },
    wallet: {
      title: 'चैटइंडिया यूपीआई वॉलेट',
      balanceLabel: 'उपलब्ध शेष राशि',
      kycVerified: 'यूपीआई व केवाईसी सत्यापित',
      receiveQr: 'क्यूआर प्राप्त करें',
      addMoney: 'पैसे जोड़ें',
      scanPay: 'स्कैन और भुगतान',
      sendUpi: 'यूपीआई भेजें',
      transactions: 'लेन-देन इतिहास'
    },
    me: {
      title: 'मैं',
      upiIdLabel: 'यूपीआई आईडी',
      myQr: 'मेरा क्यूआर कोड',
      walletRow: 'चैटइंडिया पे व यूपीआई',
      saved: 'सहेजे गए संदेश',
      moments: 'मेरे मोमेंट्स और तस्वीरें',
      stickers: 'स्टिकर व मीम्स',
      settings: 'सेटिंग्स व गोपनीयता',
      help: 'सहायता केंद्र',
      logout: 'लॉग आउट'
    },
    onboarding: {
      welcome: 'चैटइंडिया में आपका स्वागत है',
      subtitle: 'भारत का आधुनिक सुपर सोशल संचार मंच',
      slide1Title: 'सहज चैट और संपर्क',
      slide1Desc: 'रीयल-टाइम संदेश, वॉयस नोट्स, स्टिकर और उच्च गुणवत्ता ऑडियो/वीडियो कॉल।',
      slide2Title: 'तुरंत क्यूआर से जुड़ें',
      slide2Desc: 'सुरक्षित क्यूआर टोकन से मित्रों को जोड़ें, बिना निजी फोन नंबर दिखाए।',
      slide3Title: 'अत्यंत तेज यूपीआई भुगतान',
      slide3Desc: 'शगुन उपहार लिफाफे भेजें, बिल साझा करें और चैट में ही भुगतान करें।',
      slide4Title: 'मिनी ऐप्स इकोसिस्टम',
      slide4Desc: 'कैब बुक करें, खाना मंगाएं, ट्रेन स्थिति जांचें और बिल भरें।',
      getStarted: 'शुरू करें',
      skip: 'छोड़ें'
    }
  }
};
