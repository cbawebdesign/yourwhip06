let scrollOffsetY = 0;

export const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}) => {
  const hasContent = contentSize.height > 100;
  const paddingToBottom = 100;
  const scrollDirection = scrollOffsetY > contentOffset.y ? 'UP' : 'DOWN';

  scrollOffsetY = contentOffset.y;

  return (
    hasContent &&
    scrollDirection === 'DOWN' &&
    layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
  );
};

export default { isCloseToBottom };
