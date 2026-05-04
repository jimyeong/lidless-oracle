import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { v4 as uuidv4 } from 'uuid';
import { colors } from '../../shared/theme/tokens';

// ─── GraphQL ──────────────────────────────────────────────────────────────────

const SEND_MESSAGE = gql`
    mutation SendMessage($content: String!) {
        sendMessage(content: $content) {
            content
        }
    }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = 'user' | 'oracle';

interface Message {
    id: string;
    role: Role;
    content: string;
}

// ─── Oracle avatar ────────────────────────────────────────────────────────────

function OracleAvatar() {
    return (
        <View style={styles.avatar}>
            <View style={styles.avatarPupil} />
        </View>
    );
}

// ─── Thinking indicator ───────────────────────────────────────────────────────

function ThinkingIndicator() {
    const dots = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;

    useEffect(() => {
        dots.forEach((anim, i) => {
            Animated.loop(
                Animated.sequence([
                    Animated.delay(i * 180),
                    Animated.timing(anim, { toValue: 1, duration: 280, useNativeDriver: true }),
                    Animated.timing(anim, { toValue: 0, duration: 280, useNativeDriver: true }),
                    Animated.delay(540 - i * 180),
                ])
            ).start();
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <View style={styles.msgRow}>
            <OracleAvatar />
            <View style={[styles.bubble, styles.oracleBubble, styles.thinkingBubble]}>
                {dots.map((anim, i) => (
                    <Animated.View
                        key={i}
                        style={[
                            styles.dot,
                            {
                                opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.25, 1] }),
                                transform: [{
                                    translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }),
                                }],
                            },
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
    const isUser = message.role === 'user';

    return (
        <View style={[styles.msgRow, isUser && styles.msgRowUser]}>
            {!isUser && <OracleAvatar />}
            <View style={[styles.bubble, isUser ? styles.userBubble : styles.oracleBubble]}>
                {!isUser && (
                    <Text style={styles.oracleLabel}>Oracle</Text>
                )}
                <Text style={[styles.msgText, isUser && styles.msgTextUser]}>
                    {message.content}
                </Text>
            </View>
        </View>
    );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
    const pulse = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1.08, duration: 2000, useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 1,    duration: 2000, useNativeDriver: true }),
            ])
        ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <View style={styles.emptyState}>
            <Animated.View style={[styles.emptyEyeOuter, { transform: [{ scale: pulse }] }]}>
                <View style={styles.emptyEyeIris}>
                    <View style={styles.emptyEyePupil} />
                </View>
            </Animated.View>
            <Text style={styles.emptyTitle}>The Oracle awaits</Text>
            <Text style={styles.emptySub}>
                Ask anything. The eye sees all.
            </Text>
        </View>
    );
}

// ─── Send icon ────────────────────────────────────────────────────────────────

function SendIcon({ color }: { color: string }) {
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {/* shaft */}
            <View style={{
                position: 'absolute',
                width: 13,
                height: 1.5,
                backgroundColor: color,
                transform: [{ translateX: -1 }],
            }} />
            {/* arrowhead */}
            <View style={{
                width: 0,
                height: 0,
                borderTopWidth: 5,
                borderBottomWidth: 5,
                borderLeftWidth: 7,
                borderTopColor: 'transparent',
                borderBottomColor: 'transparent',
                borderLeftColor: color,
                transform: [{ translateX: 5 }],
            }} />
        </View>
    );
}

// ─── ChatScreen ───────────────────────────────────────────────────────────────

export default function ChatScreen() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput]       = useState('');
    const [thinking, setThinking] = useState(false);
    const listRef = useRef<FlatList<Message>>(null);

    const [sendMessage] = useMutation<{ sendMessage: { content: string } }>(SEND_MESSAGE);

    const handleSend = async () => {
        const content = input.trim();
        if (!content || thinking) return;

        setInput('');

        const userMsg: Message = { id: uuidv4(), role: 'user', content };
        setMessages(prev => [...prev, userMsg]);
        setThinking(true);

        try {
            const { data } = await sendMessage({ variables: { content } });
            const reply = data?.sendMessage?.content ?? 'The Oracle speaks in silence.';
            const id = uuidv4();
            
            setMessages(prev => [...prev, { id, role: 'oracle', content: reply }]);
        } catch {
            setMessages(prev => [
                ...prev,
                { id: uuidv4(), role: 'oracle', content: 'The Oracle could not be reached. Try again.' },
            ]);
        } finally {
            setThinking(false);
        }
    };

    const canSend = input.trim().length > 0 && !thinking;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.headerEye}>
                        <View style={styles.headerEyePupil} />
                    </View>
                    <Text style={styles.headerTitle}>Oracle</Text>
                </View>
                <View style={styles.headerStatus}>
                    <View style={styles.statusDot} />
                    <Text style={styles.headerStatusText}>Watching</Text>
                </View>
            </View>

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={0}
            >
                {/* Message list */}
                {messages.length === 0 && !thinking ? (
                    <EmptyState />
                ) : (
                    <FlatList
                        ref={listRef}
                        data={messages}
                        keyExtractor={m => m.id}
                        renderItem={({ item }) => <MessageBubble message={item} />}
                        contentContainerStyle={styles.listContent}
                        onContentSizeChange={() =>
                            listRef.current?.scrollToEnd({ animated: true })
                        }
                        ListFooterComponent={thinking ? <ThinkingIndicator /> : null}
                        showsVerticalScrollIndicator={false}
                    />
                )}

                {/* Input bar */}
                <View style={styles.inputBar}>
                    <TextInput
                        style={styles.input}
                        value={input}
                        onChangeText={setInput}
                        placeholder="Ask the Oracle…"
                        placeholderTextColor={colors.text.muted}
                        multiline
                        maxLength={2000}
                        onSubmitEditing={handleSend}
                        blurOnSubmit={false}
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, canSend && styles.sendBtnActive]}
                        onPress={handleSend}
                        disabled={!canSend}
                        activeOpacity={0.75}
                    >
                        <SendIcon color={canSend ? colors.bg.base : colors.text.muted} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    flex: { flex: 1 },

    container: {
        flex: 1,
        backgroundColor: colors.bg.base,
    },

    // ── Header ──
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: colors.bg.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.bg.border,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerEye: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: colors.accent.eye,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerEyePupil: {
        width: 7,
        height: 17,
        borderRadius: 3.5,
        backgroundColor: colors.accent.eye,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.text.primary,
        letterSpacing: 0.8,
    },
    headerStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: colors.accent.mouldLight,
    },
    headerStatusText: {
        fontSize: 12,
        color: colors.accent.mouldLight,
        letterSpacing: 0.4,
    },

    // ── Message list ──
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 8,
        gap: 16,
    },

    // ── Message row ──
    msgRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
    },
    msgRowUser: {
        flexDirection: 'row-reverse',
    },

    // ── Avatar ──
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: colors.accent.eye,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.accent.eyeDark,
        flexShrink: 0,
    },
    avatarPupil: {
        width: 7,
        height: 17,
        borderRadius: 3.5,
        backgroundColor: colors.accent.eye,
    },

    // ── Bubble ──
    bubble: {
        maxWidth: '78%',
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
    oracleBubble: {
        backgroundColor: colors.bg.surface,
        borderWidth: 1,
        borderColor: colors.bg.border,
        borderBottomLeftRadius: 4,
    },
    userBubble: {
        backgroundColor: colors.bg.surface,
        borderWidth: 1,
        borderColor: colors.accent.eye + '55',  // amber tint border
        borderBottomRightRadius: 4,
    },
    oracleLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: colors.accent.eye,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    msgText: {
        fontSize: 15,
        color: colors.text.primary,
        lineHeight: 22,
    },
    msgTextUser: {
        color: colors.text.primary,
    },

    // ── Thinking ──
    thinkingBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: colors.accent.eye,
    },

    // ── Empty state ──
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        paddingHorizontal: 40,
    },
    emptyEyeOuter: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 1.5,
        borderColor: colors.accent.eye,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    emptyEyeIris: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: colors.accent.eyeDark,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyEyePupil: {
        width: 14,
        height: 36,
        borderRadius: 7,
        backgroundColor: colors.bg.base,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text.primary,
        letterSpacing: 0.5,
    },
    emptySub: {
        fontSize: 13,
        color: colors.text.muted,
        textAlign: 'center',
        lineHeight: 19,
    },

    // ── Input bar ──
    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.bg.surface,
        borderTopWidth: 1,
        borderTopColor: colors.bg.border,
    },
    input: {
        flex: 1,
        backgroundColor: colors.bg.base,
        borderWidth: 1,
        borderColor: colors.bg.border,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 15,
        color: colors.text.primary,
        maxHeight: 120,
        lineHeight: 21,
    },
    sendBtn: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: colors.bg.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendBtnActive: {
        backgroundColor: colors.accent.eye,
    },
});
