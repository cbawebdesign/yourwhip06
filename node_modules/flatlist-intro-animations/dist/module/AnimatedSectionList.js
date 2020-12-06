import React from 'react';
import { SectionList } from 'react-native';
import { SlideFromBottomAnimatedItem, SlideFromRightAnimatedItem, FadeAnimatedItem, AnimationType, RotateAnimatedItem, DiveAnimatedItem } from '.';

const AnimatedSectionList = ({
  sections,
  renderItem,
  renderSectionHeader,
  animationType,
  animationDuration,
  focused = true,
  sectionlistRef,
  contentContainerStyle,
  scrollIndicatorInsets,
  ListEmptyComponent,
  ListHeaderComponent,
  ListFooterComponent,
  onScroll,
  onViewableItemsChanged,
  viewabilityConfig,
  refreshing,
  onRefresh,
  keyExtractor
}) => {
  const handleRenderItem = args => {
    switch (animationType) {
      case AnimationType.SlideFromBottom:
        return /*#__PURE__*/React.createElement(SlideFromBottomAnimatedItem, {
          renderItem: renderItem,
          args: args,
          focused: focused
        });

      case AnimationType.SlideFromRight:
        return /*#__PURE__*/React.createElement(SlideFromRightAnimatedItem, {
          renderItem: renderItem,
          args: args,
          focused: focused
        });

      case AnimationType.Fade:
        return /*#__PURE__*/React.createElement(FadeAnimatedItem, {
          renderItem: renderItem,
          args: args,
          animationDuration: animationDuration,
          focused: focused
        });

      case AnimationType.Rotate:
        return /*#__PURE__*/React.createElement(RotateAnimatedItem, {
          renderItem: renderItem,
          args: args,
          animationDuration: animationDuration,
          focused: focused
        });

      case AnimationType.Dive:
        return /*#__PURE__*/React.createElement(DiveAnimatedItem, {
          renderItem: renderItem,
          args: args,
          focused: focused
        });

      case AnimationType.None:
        return renderItem(args);

      default:
        return;
    }
  };

  return /*#__PURE__*/React.createElement(SectionList, {
    ref: sectionlistRef,
    contentContainerStyle: contentContainerStyle,
    scrollIndicatorInsets: scrollIndicatorInsets,
    sections: sections,
    renderItem: handleRenderItem,
    renderSectionHeader: renderSectionHeader,
    refreshing: refreshing,
    onRefresh: onRefresh,
    ListEmptyComponent: ListEmptyComponent,
    ListHeaderComponent: ListHeaderComponent,
    ListFooterComponent: ListFooterComponent,
    onScroll: onScroll,
    onViewableItemsChanged: onViewableItemsChanged,
    viewabilityConfig: viewabilityConfig,
    keyExtractor: keyExtractor
  });
};

export default AnimatedSectionList;
//# sourceMappingURL=AnimatedSectionList.js.map