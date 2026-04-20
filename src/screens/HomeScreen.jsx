import React from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, SafeAreaView, ActivityIndicator } from "react-native";
import { Search, Sparkles, Settings } from "lucide-react-native";
import { useContacts } from "../hooks/useContacts";

const theme = {
  colors: {
    background: "#0F1724",
    card: "#1A2233",
    foreground: "#F4F7FB",
    mutedForeground: "#8A95A8",
    primary: "#5EE7DF",
    primarySoft: "rgba(94,231,223,0.15)",
    border: "rgba(80,95,120,0.4)",
  },
  radius: { lg: 16 },
};

export default function HomeScreen({navigation}) {
  const { allContacts, loading } = useContacts();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.name}>Welcome back</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.iconCircle}><Settings size={16} color={theme.colors.mutedForeground} /></TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <Search size={16} color={theme.colors.mutedForeground} />
          <TextInput placeholder="Search..." placeholderTextColor={theme.colors.mutedForeground} style={styles.searchInput} />
        </View>

        <View style={{ marginTop: 24 }}>
          <View style={styles.sectionHeader}>
            <Sparkles size={14} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Suggested for you</Text>
          </View>
          
          {loading ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {allContacts.slice(0, 8).map((c) => (
                <View key={c.recordID} style={styles.suggestCard}>
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>{c.givenName?.[0]}</Text>
                  </View>
                  <Text style={styles.suggestName} numberOfLines={1}>{c.givenName}</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  name: { fontSize: 20, fontWeight: "600", color: theme.colors.foreground },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.card, alignItems: "center", justifyContent: "center" },
  searchBox: { marginTop: 20, flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: theme.colors.card, borderRadius: theme.radius.lg, padding: 12 },
  searchInput: { flex: 1, color: theme.colors.foreground },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: "600", color: theme.colors.foreground },
  suggestCard: { width: 100, alignItems: "center", backgroundColor: theme.colors.card, borderRadius: theme.radius.lg, padding: 12, marginRight: 12 },
  avatarPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: theme.colors.primarySoft, justifyContent: "center", alignItems: "center" },
  avatarText: { color: theme.colors.primary, fontWeight: "bold" },
  suggestName: { fontSize: 12, color: theme.colors.foreground, marginTop: 8 },
});