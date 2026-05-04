import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors } from '../theme/tokens';

// Three concentric rings pulse outward from a central eye, like a radar scan.
// Each ring is staggered so the animation reads as a continuous sweep.

const RING_SIZE  = 64;   // base diameter; rings scale up from here
const NUM_RINGS  = 3;
const STAGGER_MS = 600;

function PulseRing({ delay }: { delay: number }) {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(anim, {
                    toValue: 1,
                    duration: NUM_RINGS * STAGGER_MS + 400,
                    useNativeDriver: true,
                }),
                Animated.timing(anim, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Animated.View
            style={[
                styles.ring,
                {
                    opacity: anim.interpolate({
                        inputRange:  [0, 0.15, 1],
                        outputRange: [0, 0.55,  0],
                    }),
                    transform: [{
                        scale: anim.interpolate({
                            inputRange:  [0, 1],
                            outputRange: [0.4, 2.6],
                        }),
                    }],
                },
            ]}
        />
    );
}

function LoadingIndicator() {
    const eyeScale = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Eye breathes
        Animated.loop(
            Animated.sequence([
                Animated.timing(eyeScale, { toValue: 1.1,  duration: 1800, useNativeDriver: true }),
                Animated.timing(eyeScale, { toValue: 1,    duration: 1800, useNativeDriver: true }),
            ])
        ).start();

        // Glow flickers
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, { toValue: 1,   duration: 1400, useNativeDriver: true }),
                Animated.timing(glowAnim, { toValue: 0.4, duration: 1400, useNativeDriver: true }),
            ])
        ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <View style={styles.container}>
            {/* Pulse rings */}
            {Array.from({ length: NUM_RINGS }).map((_, i) => (
                <PulseRing key={i} delay={i * STAGGER_MS} />
            ))}

            {/* Eye */}
            <Animated.View style={[styles.eyeOuter, { transform: [{ scale: eyeScale }] }]}>
                {/* Glow halo */}
                <Animated.View style={[
                    styles.eyeHalo,
                    {
                        opacity: glowAnim.interpolate({
                            inputRange:  [0.4, 1],
                            outputRange: [0.15, 0.5],
                        }),
                    },
                ]} />
                {/* Iris */}
                <View style={styles.eyeIris}>
                    {/* Pupil — vertical slit */}
                    <View style={styles.eyePupil} />
                </View>
            </Animated.View>
        </View>
    );
}

export default LoadingIndicator;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width:  RING_SIZE * 2.8,
        height: RING_SIZE * 2.8,
    },

    // ── Rings ──
    ring: {
        position: 'absolute',
        width:        RING_SIZE,
        height:       RING_SIZE,
        borderRadius: RING_SIZE / 2,
        borderWidth:  1.5,
        borderColor:  colors.accent.eye,
    },

    // ── Eye ──
    eyeOuter: {
        width:        44,
        height:       44,
        borderRadius: 22,
        borderWidth:  1.5,
        borderColor:  colors.accent.eye,
        alignItems:   'center',
        justifyContent: 'center',
    },
    eyeHalo: {
        position:     'absolute',
        width:        56,
        height:       56,
        borderRadius: 28,
        borderWidth:  8,
        borderColor:  colors.accent.eye,
    },
    eyeIris: {
        width:           32,
        height:          32,
        borderRadius:    16,
        backgroundColor: colors.accent.eyeDark,
        alignItems:      'center',
        justifyContent:  'center',
    },
    eyePupil: {
        width:        7,
        height:       19,
        borderRadius: 3.5,
        backgroundColor: colors.bg.base,
    },
});
