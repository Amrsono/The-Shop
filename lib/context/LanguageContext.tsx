'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    dir: 'ltr' | 'rtl';
}

const translations: Record<Language, Record<string, string>> = {
    en: {
        'home': 'Home',
        'products': 'Products',
        'about': 'About',
        'contact': 'Contact',
        'cart': 'Cart',
        'search': 'Search',
        'admin': 'Admin',
        'login': 'Login',
        'logout': 'Logout',
        'my_profile': 'My Profile',
        'total': 'Total',
        'checkout': 'Checkout',
        'proceed_to_checkout': 'Proceed to Checkout',
        'cash_notice': 'Cash on Delivery Only. Card payment coming soon.',
        'trending': 'Trending Now',
        'view_all': 'View All',
        'points': 'Loyalty Points',
        'dashboard': 'Dashboard',
        'orders': 'Orders',
        'my_orders': 'My Orders',
        'account_settings': 'Account Settings',
        'full_name': 'Full Name',
        'email_address': 'Email Address',
        'phone_number': 'Phone Number',
        'preferred_address': 'Preferred Address',
        'payment_methods': 'Payment Methods',
        'save_changes': 'Save Changes',
        'profile_updated': 'Profile updated successfully!',
    },
    ar: {
        'home': 'الرئيسية',
        'products': 'المنتجات',
        'about': 'من نحن',
        'contact': 'تواصل معنا',
        'cart': 'عربة التسوق',
        'search': 'بحث',
        'admin': 'المسؤول',
        'login': 'تسجيل الدخول',
        'logout': 'تسجيل الخروج',
        'my_profile': 'ملفي الشخصي',
        'total': 'الإجمالي',
        'checkout': 'إتمام الشراء',
        'proceed_to_checkout': 'المتابعة لإتمام الشراء',
        'cash_notice': 'الدفع عند الاستلام فقط. دفع البطاقة قادم قريباً.',
        'trending': 'الأكثر مبيعاً',
        'view_all': 'مشاهدة الكل',
        'points': 'نقاط الولاء',
        'dashboard': 'لوحة التحكم',
        'orders': 'الطلبات',
        'my_orders': 'طلباتي',
        'account_settings': 'إعدادات الحساب',
        'full_name': 'الاسم بالكامل',
        'email_address': 'البريد الإلكتروني',
        'phone_number': 'رقم الهاتف',
        'preferred_address': 'العنوان المفضل',
        'payment_methods': 'طرق الدفع',
        'save_changes': 'حفظ التغييرات',
        'profile_updated': 'تم تحديث الملف الشخصي بنجاح!',
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        const storedLang = localStorage.getItem('language') as Language;
        if (storedLang) {
            setLanguage(storedLang);
            document.documentElement.dir = storedLang === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = storedLang;
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    };

    const t = (key: string) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, dir: language === 'ar' ? 'rtl' : 'ltr' }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
