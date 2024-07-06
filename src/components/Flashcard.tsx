import React from 'react';
import { Card } from 'antd';
import { SoundOutlined } from '@ant-design/icons';
import { useThemeContext } from '../ThemeContext';
import fr from "../assets/fr.svg";
import en from "../assets/uk.svg";

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
    const flagSrc = flipped ? (language === 'fr' ? en : fr) : (language === 'fr' ? fr : en);

    return (
        <Card
            onClick={onFlip}
            style={{
                width: 300,
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative',
            }}
            actions={[
                <SoundOutlined key="sound" />
            ]}
        >
            <img src={flagSrc} alt="flag" style={{ position: 'absolute', top: 10, left: 10, width: 24 }} />
            <div style={{ marginTop: 50 }}>{word[lang]}</div>
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