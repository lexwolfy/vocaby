import React from 'react';
import { Card } from 'antd';
import {SoundOutlined, SwapOutlined} from '@ant-design/icons';
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
const synth = window.speechSynthesis;

const Flashcard: React.FC<FlashcardProps> = ({ word, category, subcategory, flipped, onFlip }) => {
    const { language } = useThemeContext();
    const lang = flipped ? (language === 'fr' ? 'english' : 'french') : (language === 'fr' ? 'french' : 'english');
    const flagSrc = flipped ? (language === 'fr' ? en : fr) : (language === 'fr' ? fr : en);

    const onSpeak = () => {
        const utterance = new SpeechSynthesisUtterance(word[lang]);
        utterance.lang = lang === 'french' ? 'fr-FR' : 'en-US';
        synth.speak(utterance);
    }

    return (
        <Card
            style={{
                width: 300,
                textAlign: 'center',
                cursor: 'pointer',
            }}
            actions={[
                <SwapOutlined key="swap" onClick={onFlip} />,
                <SoundOutlined key="sound" onClick={onSpeak} />
            ]}
        >
            <img src={flagSrc} alt="flag" style={{ position: 'absolute', top: 10, left: 10, width: 24 }} />
            <div style={{ marginTop: 50, fontSize: '1.5em' }}>{word[lang]}</div>
            <div style={{ marginTop: 20, color: 'gray' }}>
                {category[lang]}
            </div>
            <div style={{ color: 'gray' }}>
                {subcategory[lang]}
            </div>
        </Card>
    );
};

export default Flashcard;