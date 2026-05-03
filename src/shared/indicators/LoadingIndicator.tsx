import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/tokens";



function LoadingIndicator() {
    const ring1 = useRef(new Animated.Value(0)).current;
    const ring2 = useRef(new Animated.Value(0)).current;
    const ring3 = useRef(new Animated.Value(0)).current;
    const eyeScale = useRef(new Animated.Value(1)).current;
    const eyeGlow = useRef(new Animated.Value(0)).current;
    const textFade = useRef(new Animated.Value(0)).current;
    const sporeAnims = useRef(SPORES.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        // Staggered outward pulse rings
        const pulseRing = (anim: Animated.Value, delay: number) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(anim, { toValue: 1, duration: 2400, useNativeDriver: true }),
                    Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
                ])
            );
        pulseRing(ring1, 0).start();
        pulseRing(ring2, 800).start();
        pulseRing(ring3, 1600).start();

        // Eye breathe
        Animated.loop(
            Animated.sequence([
                Animated.timing(eyeScale, { toValue: 1.07, duration: 2000, useNativeDriver: true }),
                Animated.timing(eyeScale, { toValue: 1, duration: 2000, useNativeDriver: true }),
            ])
        ).start();

        // Eye glow flicker
        Animated.loop(
            Animated.sequence([
                Animated.timing(eyeGlow, { toValue: 1, duration: 1700, useNativeDriver: true }),
                Animated.timing(eyeGlow, { toValue: 0.5, duration: 1700, useNativeDriver: true }),
            ])
        ).start();

        // Text fade in
        Animated.timing(textFade, {
            toValue: 1,
            duration: 1400,
            delay: 700,
            useNativeDriver: true,
        }).start();

        // Spore drift loop
        sporeAnims.forEach((anim, i) => {
            Animated.loop(
                Animated.sequence([
                    Animated.delay(SPORES[i].delay),
                    Animated.timing(anim, { toValue: 1, duration: 2600 + i * 180, useNativeDriver: true }),
                    Animated.timing(anim, { toValue: 0, duration: 2600 + i * 180, useNativeDriver: true }),
                ])
            ).start();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <View>
               <View style={styles.scene}>
                <View style={styles.stage}>
                    {/* Pulse rings */}
                    {[ring1, ring2, ring3].map((anim, i) => (
                        <Animated.View
                            key={i}
                            style={[
                                styles.ring,
                                {
                                    opacity: anim.interpolate({
                                        inputRange:  [0, 0.15, 1],
                                        outputRange: [0, 0.45,  0],
                                    }),
                                    transform: [{
                                        scale: anim.interpolate({
                                            inputRange:  [0, 1],
                                            outputRange: [0.35, 2.5],
                                        }),
                                    }],
                                },
                            ]}
                        />
                    ))}

                    {/* Mould spores */}
                    {SPORES.map((spore, i) => (
                        <Animated.View
                            key={`spore-${i}`}
                            style={{
                                position: 'absolute',
                                top:  CENTER + spore.y - spore.size / 2,
                                left: CENTER + spore.x - spore.size / 2,
                                opacity: sporeAnims[i].interpolate({
                                    inputRange:  [0, 0.5, 1],
                                    outputRange: [0.25, 0.7, 0.25],
                                }),
                                transform: [{
                                    translateY: sporeAnims[i].interpolate({
                                        inputRange:  [0, 1],
                                        outputRange: [0, -8],
                                    }),
                                }],
                            }}
                        >
                            <MouldSpore size={spore.size} />
                        </Animated.View>
                    ))}

                    {/* Lidless Eye */}
                    <Animated.View style={[styles.eyeOuter, { transform: [{ scale: eyeScale }] }]}>
                        {/* Glow halo */}
                        <Animated.View style={[
                            styles.eyeHalo,
                            {
                                opacity: eyeGlow.interpolate({
                                    inputRange:  [0.5, 1],
                                    outputRange: [0.2, 0.55],
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
            </View>

            {/* App name */}
            <Animated.View style={[styles.textBlock, { opacity: textFade }]}>
                <Text style={styles.appName}>Lidless Oracle</Text>
                <Text style={styles.tagline}>See clearly. Act wisely.</Text>
            </Animated.View>
        </View>
    );
}

export default LoadingIndicator;

// Mould spore positions relative to the stage centre
const SPORES: { x: number; y: number; size: number; delay: number }[] = [
    { x: -115, y: -85, size: 14, delay: 0 },
    { x: 90, y: -110, size: 10, delay: 500 },
    { x: -130, y: 45, size: 12, delay: 300 },
    { x: 120, y: 60, size: 9, delay: 700 },
    { x: -45, y: 125, size: 11, delay: 900 },
    { x: 65, y: 110, size: 8, delay: 200 },
];

const RING_BASE = 140; // base diameter of pulse rings
const STAGE = 320;  // square stage size
const CENTER = STAGE / 2;

// Mould spore: central body + 6 satellite bumps
function MouldSpore({ size }: { size: number }) {
    const bump = size * 0.32;
    const r = size * 0.55;
    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            {/* body */}
            <View style={{
                position: 'absolute',
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: colors.accent.mould,
            }} />
            {/* satellite bumps */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => {
                const rad = (deg * Math.PI) / 180;
                return (
                    <View
                        key={i}
                        style={{
                            position: 'absolute',
                            width: bump,
                            height: bump,
                            borderRadius: bump / 2,
                            backgroundColor: colors.accent.mouldLight,
                            transform: [
                                { translateX: Math.cos(rad) * r },
                                { translateY: Math.sin(rad) * r },
                            ],
                        }}
                    />
                );
            })}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg.base,
    },
    scene: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stage: {
        width: STAGE,
        height: STAGE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ring: {
        position: 'absolute',
        width: RING_BASE,
        height: RING_BASE,
        borderRadius: RING_BASE / 2,
        borderWidth: 1.5,
        borderColor: colors.accent.eye,
    },
    eyeOuter: {
        width: 116,
        height: 116,
        borderRadius: 58,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.accent.eye,
    },
    eyeHalo: {
        position: 'absolute',
        width: 130,
        height: 130,
        borderRadius: 65,
        borderWidth: 10,
        borderColor: colors.accent.eye,
    },
    eyeIris: {
        width: 84,
        height: 84,
        borderRadius: 42,
        backgroundColor: colors.accent.eyeDark,
        alignItems: 'center',
        justifyContent: 'center',
    },
    eyePupil: {
        width: 20,
        height: 54,
        borderRadius: 10,
        backgroundColor: colors.bg.base,
    },
    textBlock: {
        alignItems: 'center',
        paddingBottom: 52,
    },
    appName: {
        fontSize: 26,
        fontWeight: '700',
        color: colors.text.primary,
        letterSpacing: 1.2,
    },
    tagline: {
        marginTop: 6,
        fontSize: 13,
        color: colors.text.secondary,
        letterSpacing: 0.5,
    },
});
