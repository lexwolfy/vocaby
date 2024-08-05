import React, {useState} from 'react';
import { Card, message } from 'antd';
import {AudioFilled, AudioOutlined, SoundOutlined, StarFilled, StarOutlined, SwapOutlined} from '@ant-design/icons';
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
const SpeechRecognition = (window as any).webkitSpeechRecognition;

const Flashcard: React.FC<FlashcardProps> = ({ word, category, subcategory, flipped, onFlip }) => {
    const { language, toggleFavorite, isFavorite } = useThemeContext();
    const lang = flipped ? (language === 'fr' ? 'english' : 'french') : (language === 'fr' ? 'french' : 'english');
    const flagSrc = flipped ? (language === 'fr' ? en : fr) : (language === 'fr' ? fr : en);
    const [listening, setListening] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const onSpeak = () => {
        const utterance = new SpeechSynthesisUtterance(word[lang]);
        utterance.lang = lang === 'french' ? 'fr-FR' : 'en-US';
        synth.speak(utterance);
    }

    const recognition = new SpeechRecognition();

    const onListen = () => {
        recognition.lang = lang === 'french' ? 'fr' : 'en';
        setListening(true);
        if (!listening) {
            recognition.start();
            console.log('started');
        }
    }

    recognition.onerror = (event: any) => {
        console.error('error', event.error);
        messageApi.open({
            type: 'error',
            content: 'Oops! Looks like an error happened',
        });
    }

    recognition.onend = () => {
        setListening(false);
    }

    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript === word[lang]) {
            messageApi.open({
                type: 'success',
                content: 'Congratulations!',
            });
        } else {
            messageApi.open({
                type: 'warning',
                content: `We understood "${transcript}"... Try again!`,
            });
        }
    };

    const onStar = () => {
        toggleFavorite(word);
    }

    return (
        <>
        {contextHolder}
        <Card
            style={{
                width: 300,
                textAlign: 'center',
                cursor: 'pointer',
            }}
            actions={[
                <SwapOutlined key="swap" onClick={onFlip} />,
                <SoundOutlined key="speak" onClick={onSpeak} />,
                listening ? <AudioFilled disabled={true} key="listen" onClick={onListen} /> : <AudioOutlined disabled={true} key="listen" onClick={onListen} />,
                isFavorite(word) ? <StarFilled key="star" onClick={onStar} /> : <StarOutlined key="star" onClick={onStar} />,
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
        </>
    );
};

export default Flashcard;