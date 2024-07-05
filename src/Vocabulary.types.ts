export interface VocabularyItem {
    french: string;
    english: string;
}

export interface Subcategory {
    subcategory: {
        id: number;
        french: string;
        english: string;
    };
    vocabulary: VocabularyItem[];
}

export interface Category {
    category: {
        id: number;
        french: string;
        english: string;
    };
    subcategories: Subcategory[];
}