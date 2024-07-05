import React, { useEffect } from 'react';
import { Card } from 'antd';
import { useThemeContext } from '../ThemeContext';

interface FlashcardProps {
    word: {
        french: string;
        english: string;
    };
    category: {
        id: number;
        french: string;
        english: string;
    };
    subcategory: {
        id: number;
        french: string;
        english: string;
    };
    flipped: boolean;
    onFlip: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ word, category, subcategory, flipped, onFlip }) => {
    const { language } = useThemeContext();
    const lang = flipped ? (language === 'fr' ? 'english' : 'french') : (language === 'fr' ? 'french' : 'english');
    const flagSrc = flipped ? (language === 'fr' ? '/uk.svg' : '/fr.svg') : (language === 'fr' ? '/fr.svg' : '/uk.svg');

    useEffect(() => {
        if ((language === 'en' && flipped) || (language === 'fr' && !flipped)) {
            onFlip();
        }
    }, [word, language]);

    return (
        <Card
            onClick={onFlip}
            style={{
                width: 300,
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative',
                backgroundColor: 'white'
            }}
        >
            <img src={flagSrc} alt="flag" style={{ position: 'absolute', top: 10, left: 10, width: 24 }} />
            <div style={{ marginTop: 50 }}>{flipped ? word.french : word.english}</div>
            <div style={{ marginTop: 20, fontSize: '0.8em', color: 'gray' }}>
                {category[lang]}
            </div>
            <div style={{ fontSize: '0.8em', color: 'gray' }}>
                {subcategory[lang]}
            </div>
        </Card>
    );
};

export default Flashcard;