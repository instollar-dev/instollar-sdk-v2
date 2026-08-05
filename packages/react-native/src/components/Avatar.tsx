import { useState } from 'react';
import {
  Image,
  Pressable,
  View,
  type ImageProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Text } from './Text';
import { useThemeColors } from '../theme/ThemeProvider';
import { triggerHapticFeedback } from '../utils/haptics';

export type AvatarSize = 'sm' | 'md' | 'lg';

const sizeMap: Record<AvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 56,
};

export type AvatarProps = {
  src?: string;
  initials: string;
  size?: AvatarSize;
  alt?: string;
  imgProps?: Omit<ImageProps, 'source'>;
  onClick?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function getAvatarInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function Avatar({
  src,
  initials,
  size = 'md',
  alt,
  imgProps,
  onClick,
  style,
}: AvatarProps) {
  const colors = useThemeColors();
  const [failed, setFailed] = useState(false);
  const dim = sizeMap[size];
  const showImage = Boolean(src) && !failed;

  const content = (
    <View
      accessibilityLabel={alt ?? initials}
      style={[
        {
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          backgroundColor: colors.destructive,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {showImage ? (
        <Image
          {...imgProps}
          source={{ uri: src }}
          onError={() => setFailed(true)}
          style={{ width: dim, height: dim }}
        />
      ) : (
        <Text
          variant="open-bold-p"
          style={{ color: colors.white, fontSize: dim * 0.35 }}
        >
          {initials}
        </Text>
      )}
    </View>
  );

  if (onClick) {
    return (
      <Pressable
        accessibilityRole="button"
        onPressIn={() => triggerHapticFeedback('light')}
        onPress={onClick}
      >
        {content}
      </Pressable>
    );
  }
  return content;
}
