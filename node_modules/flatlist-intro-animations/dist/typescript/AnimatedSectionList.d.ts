import React from 'react';
import { SectionList, SectionListRenderItem, NativeSyntheticEvent, NativeScrollEvent, StyleProp, ViewStyle, Insets, ViewToken, SectionListData } from 'react-native';
import { AnimationType } from '.';
interface Props {
    sections: ReadonlyArray<SectionListData<object>>;
    renderItem: SectionListRenderItem<object>;
    renderSectionHeader?: (info: {
        section: SectionListData<any>;
    }) => React.ReactElement;
    animationType: AnimationType;
    animationDuration?: number;
    focused?: boolean;
    contentContainerStyle?: StyleProp<ViewStyle>;
    scrollIndicatorInsets?: Insets;
    sectionlistRef?: ((instance: SectionList<object> | null) => void) | React.RefObject<SectionList<object>>;
    ListEmptyComponent?: React.ComponentType<any> | React.ReactElement;
    ListHeaderComponent?: React.ComponentType<any> | React.ReactElement;
    ListFooterComponent?: React.ComponentType<any> | React.ReactElement;
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onViewableItemsChanged?: (info: {
        viewableItems: ViewToken[];
        changed: ViewToken[];
    }) => void;
    viewabilityConfig?: any;
    refreshing?: boolean;
    onRefresh?: () => void;
    keyExtractor?: (item: object, index: number) => string;
}
declare const AnimatedSectionList: React.FC<Props>;
export default AnimatedSectionList;
