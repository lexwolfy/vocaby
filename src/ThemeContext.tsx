import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import vocabularyData from './vocabulary.json';

interface ThemeContextType {
    toggleTheme: () => void;
    mode: 'light' | 'dark';
    selectedCategories: number[];
    setActiveCategories: (categories: number[]) => void;
    language: 'fr' | 'en';
    toggleLanguage: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProviderComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<'light' | 'dark'>('light');
    const [language, setLanguage] = useState<'fr' | 'en'>('en');

    const allCategoryIds = useMemo(() => {
        return vocabularyData.flatMap(category =>
            [category.category.id, ...category.subcategories.map(subcategory => subcategory.subcategory.id)]
        );
    }, []);

    const [selectedCategories, setSelectedCategories] = useState<number[]>(allCategoryIds);

    useEffect(() => {
        setSelectedCategories(allCategoryIds);
    }, [allCategoryIds]);

    const currentTheme = useMemo(() => {
        const algorithm = mode === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm;
        return {
            algorithm,
            token: {
                colorPrimary: '#eb2f96',
                colorInfo: '#eb2f96'
            },
        };
    }, [mode]);

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const setActiveCategories = (categories: number[]) => setSelectedCategories(categories);

    const toggleLanguage = () => {
        setLanguage((prevLanguage) => (prevLanguage === 'fr' ? 'en' : 'fr'));
    };

    return (
        <ThemeContext.Provider value={{ toggleTheme, mode, selectedCategories, setActiveCategories, language, toggleLanguage }}>
            <ConfigProvider theme={currentTheme}>
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
};