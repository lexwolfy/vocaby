import React, { useState } from 'react';
import Flashcard from './Flashcard';
import { Button, Flex } from 'antd';
import {useThemeContext} from "../ThemeContext";

interface FlashcardDeckProps {
    words: {
        french: string;
        english: string;
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
    }[];
}

const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ words }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const { language } = useThemeContext();

    const handleNext = () => {
        const randomIndex = Math.floor(Math.random() * words.length);
        setCurrentIndex(randomIndex);
        setFlipped(false);  // Ensure the card shows English first
    };

    const handleFlip = () => {
        setFlipped(!flipped);
    };

    return (
        <Flex vertical justify="space-around">
            <Flashcard
                word={words[currentIndex]}
                category={words[currentIndex].category}
                subcategory={words[currentIndex].subcategory}
                flipped={flipped}
                onFlip={handleFlip}
            />
            <Button type="primary" onClick={handleNext} size={'large'}>
                { language === "en" ? 'Next' : 'Suivant' }
            </Button>
        </Flex>
    );
};

export default FlashcardDeck;