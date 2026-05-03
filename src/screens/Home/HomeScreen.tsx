import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import { logout, useAuth } from '../../app/providers/AuthProvider';
import { colors } from '../../shared/theme/tokens';
import ChatScreen from '../Chat/ChatScreen';

type Tab = 'home' | 'chat';

// ─── Tab bar icons ────────────────────────────────────────────────────────────

function HomeIcon({ color }: { color: string }) {
    return (
        <View style={{ alignItems: 'center' }}>
            {/* roof */}
            <View style={{
                width: 0,
                height: 0,
                borderLeftWidth: 9,
                borderRightWidth: 9,
                borderBottomWidth: 8,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: color,
            }} />
            {/* body */}
            <View style={{
                width: 13,
                height: 9,
                backgroundColor: color,
                borderBottomLeftRadius: 1,
                borderBottomRightRadius: 1,
            }} />
        </View>
    );
}

function ChatIcon({ color }: { color: string }) {
    return (
        <View>
            {/* bubble */}
            <View style={{
                width: 18,
                height: 14,
                borderRadius: 4,
                borderWidth: 1.5,
                borderColor: color,
            }} />
            {/* tail */}
            <View style={{
                position: 'absolute',
                bottom: -4,
                left: 4,
                width: 0,
                height: 0,
                borderLeftWidth: 4,
                borderRightWidth: 0,
                borderTopWidth: 5,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderTopColor: color,
            }} />
        </View>
    );
}

function LogoutIcon({ color }: { color: string }) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
            {/* shaft */}
            <View style={{ width: 10, height: 1.5, backgroundColor: color }} />
            {/* arrowhead */}
            <View style={{
                width: 0,
                height: 0,
                borderTopWidth: 4,
                borderBottomWidth: 4,
                borderLeftWidth: 5,
                borderTopColor: 'transparent',
                borderBottomColor: 'transparent',
                borderLeftColor: color,
            }} />
        </View>
    );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
    return (
        <View style={styles.card}>
            <Text style={styles.cardLabel}>{label}</Text>
            <Text style={styles.cardValue}>{value}</Text>
            {sub ? <Text style={styles.cardSub}>{sub}</Text> : null}
        </View>
    );
}

// ─── Home content ─────────────────────────────────────────────────────────────

function HomeContent() {
    const { user } = useAuth();
    const name = user?.displayName?.split(' ')[0] ?? 'Oracle';

    return (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.greeting}>Welcome back,</Text>
                <Text style={styles.userName}>{name}</Text>
                <View style={styles.statusRow}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Oracle is watching</Text>
                </View>
            </View>

            {/* Stats */}
            <Text style={styles.sectionTitle}>Monitor Overview</Text>
            <View style={styles.cardGrid}>
                <StatCard label="Sensors Online" value="—"  sub="pending" />
                <StatCard label="Active Alerts"  value="—"  sub="pending" />
            </View>
            <View style={styles.cardGrid}>
                <StatCard label="Last Scan"      value="—"  sub="pending" />
                <StatCard label="Tracked Zones"  value="—"  sub="pending" />
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Recent activity placeholder */}
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.emptyState}>
                <View style={styles.eyePlaceholder}>
                    <View style={styles.eyeInner} />
                </View>
                <Text style={styles.emptyText}>No activity yet</Text>
                <Text style={styles.emptySubText}>
                    The Oracle will surface alerts here once monitoring begins.
                </Text>
            </View>
        </ScrollView>
    );
}

// ─── Root shell ───────────────────────────────────────────────────────────────

export default function HomeScreen() {
    const [activeTab, setActiveTab] = useState<Tab>('home');

    const handleLogout = () => {
        Alert.alert('Sign out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign out', style: 'destructive', onPress: () => logout() },
        ]);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Page content */}
            <View style={styles.content}>
                {activeTab === 'home' ? <HomeContent /> : <ChatScreen />}
            </View>

            {/* Bottom tab bar */}
            <SafeAreaView style={styles.tabBar} edges={['bottom']}>
                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => setActiveTab('home')}
                    activeOpacity={0.7}
                >
                    {activeTab === 'home' && <View style={styles.tabIndicator} />}
                    <HomeIcon color={activeTab === 'home' ? colors.accent.eye : colors.text.muted} />
                    <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>
                        Home
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => setActiveTab('chat')}
                    activeOpacity={0.7}
                >
                    {activeTab === 'chat' && <View style={styles.tabIndicator} />}
                    <ChatIcon color={activeTab === 'chat' ? colors.accent.eye : colors.text.muted} />
                    <Text style={[styles.tabLabel, activeTab === 'chat' && styles.tabLabelActive]}>
                        Chat
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tab}
                    onPress={handleLogout}
                    activeOpacity={0.7}
                >
                    <LogoutIcon color={colors.text.muted} />
                    <Text style={styles.tabLabel}>Sign out</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </SafeAreaView>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg.base,
    },
    content: {
        flex: 1,
    },

    // ── Scroll ──
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 28,
        paddingBottom: 16,
    },

    // ── Header ──
    header: {
        marginBottom: 32,
    },
    greeting: {
        fontSize: 14,
        color: colors.text.secondary,
        letterSpacing: 0.3,
    },
    userName: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.text.primary,
        marginTop: 2,
        letterSpacing: 0.5,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 8,
    },
    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: colors.accent.mouldLight,
    },
    statusText: {
        fontSize: 12,
        color: colors.accent.mouldLight,
        letterSpacing: 0.4,
    },

    // ── Section ──
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text.muted,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginBottom: 12,
    },

    // ── Cards ──
    cardGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    card: {
        flex: 1,
        backgroundColor: colors.bg.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.bg.border,
        padding: 16,
    },
    cardLabel: {
        fontSize: 11,
        color: colors.text.muted,
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    cardValue: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text.primary,
    },
    cardSub: {
        fontSize: 11,
        color: colors.text.secondary,
        marginTop: 2,
    },

    // ── Divider ──
    divider: {
        height: 1,
        backgroundColor: colors.bg.border,
        marginVertical: 24,
    },

    // ── Empty state ──
    emptyState: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    eyePlaceholder: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1.5,
        borderColor: colors.bg.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    eyeInner: {
        width: 10,
        height: 26,
        borderRadius: 5,
        backgroundColor: colors.bg.border,
    },
    emptyText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.text.secondary,
        marginBottom: 6,
    },
    emptySubText: {
        fontSize: 13,
        color: colors.text.muted,
        textAlign: 'center',
        lineHeight: 19,
        paddingHorizontal: 24,
    },

    // ── Tab bar ──
    tabBar: {
        flexDirection: 'row',
        backgroundColor: colors.bg.surface,
        borderTopWidth: 1,
        borderTopColor: colors.bg.border,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 12,
        paddingBottom: 8,
        gap: 5,
    },
    tabIndicator: {
        position: 'absolute',
        top: 0,
        width: 24,
        height: 2,
        borderRadius: 1,
        backgroundColor: colors.accent.eye,
    },
    tabLabel: {
        fontSize: 11,
        color: colors.text.muted,
        letterSpacing: 0.3,
    },
    tabLabelActive: {
        color: colors.accent.eye,
        fontWeight: '600',
    },
});
