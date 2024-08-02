import React, {useState} from 'react';
import FlashcardDeck from './components/FlashcardDeck';
import SiderMenu from './components/SiderMenu';
import vocabularyData from './vocabulary.json';
import { useThemeContext } from './ThemeContext';
import { Layout, Button, Flex, Typography, Switch } from 'antd';
import { BulbOutlined, BulbFilled, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

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
    const { toggleTheme, mode, selectedCategories, language, toggleLanguage, collapsed, toggleCollapsed,  } = useThemeContext();

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

    const localFavoriteStr = localStorage.getItem('favorite');
    const localFavorite = localFavoriteStr ? JSON.parse(localFavoriteStr) : [];

    const filteredWords = [...words.filter(
        (word) =>
            selectedCategories.includes(word.category.id) ||
            selectedCategories.includes(word.subcategory.id)
    ), ...localFavorite];

    return (
        <Layout style={{ height: '100dvh' }}>
            <Header style={{ display: 'flex', paddingLeft: 0 }}>
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => toggleCollapsed()}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                        color: 'white'
                    }}
                />
                <Flex justify={'space-between'} align={'center'} style={{flexGrow: 1}}>
                <Typography.Title level={3} style={{ color: 'white', margin: 0 }}>
                    Vocaby
                </Typography.Title>
                <Button type="primary" shape="circle" icon={mode === 'dark' ? <BulbFilled /> : <BulbOutlined />} onClick={toggleTheme} />
                </Flex>
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
            <Footer style={{ backgroundColor: '#001529'}}>
                <Flex justify='center' align='center'>
                    <Switch
                        checked={language === 'en'}
                        onChange={toggleLanguage}
                        checkedChildren="EN"
                        unCheckedChildren="FR"
                    />
                </Flex>
            </Footer>
        </Layout>
    );
};

export default App;
