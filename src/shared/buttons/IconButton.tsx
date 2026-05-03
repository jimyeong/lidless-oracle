import { ReactNode } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    StyleProp,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { colors } from '../theme/tokens';

export type IconButtonProps = {
    icon: ReactNode;
    label: string;
    onPress?: () => void;
    activeOpacity?: number;
    style?: StyleProp<ViewStyle>;
    iconContainerStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
};

export function IconButton({
    icon,
    label,
    onPress,
    activeOpacity = 0.8,
    style,
    iconContainerStyle,
    labelStyle,
}: IconButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.button, style]}
            onPress={onPress}
            activeOpacity={activeOpacity}
        >
            <View style={[styles.iconContainer, iconContainerStyle]}>{icon}</View>
            <Text style={[styles.label, labelStyle]}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 24,
        gap: 12,
    },
    iconContainer: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: colors.brand.google,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        color: colors.text.inverse,
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
});
