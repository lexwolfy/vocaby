import React, { useState } from 'react';
import { Button, Flex, Layout, Tree } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import { useThemeContext } from '../ThemeContext';
import vocabularyData from '../vocabulary.json';
import {Category, Subcategory} from '../Vocabulary.types';

const { Sider } = Layout;

const SiderMenu: React.FC = () => {
    const { selectedCategories, setActiveCategories, language, collapsed } = useThemeContext();
    const lang = language === 'fr' ? 'french' : 'english';
    // const [collapsed, setCollapsed] = useState(false);
    const allCategoryIds = vocabularyData.flatMap(category =>  [category.category.id, ...category.subcategories.map(subcategory => subcategory.subcategory.id)]);

    const treeCategories: TreeDataNode[] = vocabularyData.map((category: Category) => ({
        title: category.category[lang],
        key: category.category.id,
        children: category.subcategories.map((subcategory: Subcategory) => ({
            title: subcategory.subcategory[lang],
            key: subcategory.subcategory.id
        }))
    }));

    const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
        console.log('onCheck', checkedKeysValue);
        setActiveCategories(checkedKeysValue as number[]);
        // setCheckedKeys(checkedKeysValue as React.Key[]);
        // toggleCategory(checkedKeysValue);
        console.log('clicky click');
    };

    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(selectedCategories);
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

    const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
        console.log('onExpand', expandedKeysValue);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };

    const onSelect: TreeProps['onSelect'] = (selectedKeysValue, info) => {
        console.log('onSelect', info);
        // setSelectedKeys(selectedKeysValue);
        // Can add toggle here actually for ease of use
    };

    return (
        <Sider width={300} style={{ background: '#fff', maxHeight: '100vh', overflow: 'scroll' }} collapsible collapsedWidth={0} trigger={null} collapsed={collapsed}>
                <Flex justify={'space-around'} align={'center'} style={{padding: '10px 0'}}>
                    <Button onClick={() => setActiveCategories(allCategoryIds)}>Select All</Button>
                    <Button danger onClick={() => setActiveCategories([])}>Unselect All</Button>
                </Flex>
                <Tree
                    checkable
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onCheck={onCheck}
                    checkedKeys={selectedCategories}
                    onSelect={onSelect}
                    // selectedKeys={selectedCategories}
                    treeData={treeCategories}
                />

        </Sider>
    );
};

export default SiderMenu;