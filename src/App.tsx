import React from 'react';
import FlashcardDeck from './components/FlashcardDeck';
import SiderMenu from './components/SiderMenu';
import vocabularyData from './vocabulary.json';
import { useThemeContext } from './ThemeContext';
import { Layout, Button, Typography, Switch } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';

const { Header, Content } = Layout;

interface VocabularyItem {
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
}

interface Subcategory {
    subcategory: {
        id: number;
        french: string;
        english: string;
    };
    vocabulary: Omit<VocabularyItem, 'category' | 'subcategory'>[];
}

interface Category {
    category: {
        id: number;
        french: string;
        english: string;
    };
    subcategories: Subcategory[];
}

const App: React.FC = () => {
    const [words, setWords] = React.useState<VocabularyItem[]>([]);
    const { toggleTheme, mode, selectedCategories, language, toggleLanguage } = useThemeContext();

    React.useEffect(() => {
        const data: Category[] = vocabularyData;
        const allWords: VocabularyItem[] = data.flatMap((category) =>
            category.subcategories.flatMap((subcategory) =>
                subcategory.vocabulary.map((word) => ({
                    ...word,
                    category: category.category,
                    subcategory: subcategory.subcategory,
                }))
            )
        );
        setWords(allWords);
    }, []);

    const filteredWords = words.filter(
        (word) =>
            selectedCategories.includes(word.category.id) ||
            selectedCategories.includes(word.subcategory.id)
    );

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography.Title level={3} style={{ color: 'white', margin: 0 }}>
                    Vocaby
                </Typography.Title>
                    <Switch
                        checked={language === 'en'}
                        onChange={toggleLanguage}
                        checkedChildren="EN"
                        unCheckedChildren="FR"
                    />
                    <Button type="primary" shape="circle" icon={mode === 'dark' ? <BulbFilled /> : <BulbOutlined />} onClick={toggleTheme} />
            </Header>
            <Layout>
                <SiderMenu />
                <Layout>
                    <Content style={{ padding: '50px', display: 'flex', justifyContent: 'center' }}>
                        {filteredWords.length > 0 ? (
                            <FlashcardDeck words={filteredWords} />
                        ) : (
                            <Typography.Text>No flashcards available for selected categories</Typography.Text>
                        )}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default App;