import React, { createContext, useState, useMemo, useContext } from 'react';
import { ConfigProvider, theme } from 'antd';
import vocabularyData from './vocabulary.json';
import { VocabularyItem } from './Vocabulary.types';

interface ThemeContextType {
    toggleTheme: () => void;
    mode: 'light' | 'dark';
    selectedCategories: number[];
    setActiveCategories: (categories: number[]) => void;
    language: 'fr' | 'en';
    toggleLanguage: () => void;
    collapsed: boolean;
    toggleCollapsed: () => void;
    toggleFavorite: (word: VocabularyItem) => void;
    isFavorite: (word: VocabularyItem) => boolean;
    clearFavorite: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProviderComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<'light' | 'dark'>('light');
    const [language, setLanguage] = useState<'fr' | 'en'>('en');
    const [collapsed, setCollapsed] = useState(localStorage.getItem('collapsed') === 'true' ?? false);

    const localFavoriteStr = localStorage.getItem('favorite');
    const localFavorite = localFavoriteStr ? JSON.parse(localFavoriteStr) : [];
    const [favorite, setFavorite] = useState<VocabularyItem[]>(localFavorite);

    const localCategoryIds = localStorage.getItem('selectedCategories');
    const selectedLocalCategories = localCategoryIds ? JSON.parse(localCategoryIds) : null;

    const allCategoryIds = useMemo(() => {
        return vocabularyData.flatMap(category =>
            [category.category.id, ...category.subcategories.map(subcategory => subcategory.subcategory.id)]
        );
    }, []);

    const [selectedCategories, setSelectedCategories] = useState<number[]>(selectedLocalCategories ?? allCategoryIds);


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

    const setActiveCategories = (categories: number[]) => {
        localStorage.setItem('selectedCategories', JSON.stringify(categories));
        setSelectedCategories(categories);
    }

    const toggleLanguage = () => {
        setLanguage((prevLanguage) => (prevLanguage === 'fr' ? 'en' : 'fr'));
    };

    const toggleCollapsed = () => {
        setCollapsed((prevCollapsed) => !prevCollapsed);
        localStorage.setItem('collapsed', JSON.stringify(!collapsed));
    }

    const toggleFavorite = (word: VocabularyItem) => {
        if (favorite.some(fav => fav.english === word.english)) {
            setFavorite(favorite.filter(fav => fav.english !== word.english));
            localStorage.setItem('favorite', JSON.stringify(favorite.filter(fav => fav.english !== word.english)));
        } else {
            setFavorite([...favorite, word]);
            localStorage.setItem('favorite', JSON.stringify([...favorite, word]));
        }
    }

    const isFavorite = (word: VocabularyItem) => {
        return favorite.some(fav => fav.english === word.english);
    }

    const clearFavorite = () => {
        setFavorite([]);
    }

    return (
        <ThemeContext.Provider value={{ toggleTheme, mode, selectedCategories, setActiveCategories, language, toggleLanguage, collapsed, toggleCollapsed, toggleFavorite, isFavorite, clearFavorite }}>
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