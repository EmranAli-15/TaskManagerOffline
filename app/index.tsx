import Container from '@/components/Container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createNoteTable, getAllDataFromNoteTable } from '@/db/Database';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TNote = {
    id: number,
    head: string,
    body: string;
    title: string;
}

export default function HomeScreen() {
    const [data, setData] = useState([
        { id: 1, head: "#77BEF0", body: "#CBDCEB" },
        { id: 2, head: "#ffdc75", body: "#fff2cc" },
        { id: 3, head: "#eca3a3", body: "#f6d6d6" },
        { id: 4, head: "#a5d732", body: "#ddf0b2" },
        { id: 5, head: "#d94c9f", body: "#f4cce3" },
        { id: 6, head: "#875ab2", body: "#d2c1e2" },
        { id: 8, head: "#77BEF0", body: "#CBDCEB" },
        { id: 9, head: "#77BEF0", body: "#CBDCEB" },
        { id: 9, head: "#77BEF0", body: "#CBDCEB" },
        { id: 9, head: "#77BEF0", body: "#CBDCEB" },
        { id: 9, head: "#77BEF0", body: "#CBDCEB" },
        { id: 9, head: "#77BEF0", body: "#CBDCEB" },
    ])


    const [notes, setNotes] = useState([])

    const [numColumns, setNumColumns] = useState(1);


    const handleGetNotes = async () => {
        await createNoteTable();
        const allNotes = await getAllDataFromNoteTable();
        setNotes(allNotes);
    }

    useEffect(() => {
        const run = async () => {
            await handleGetNotes()
        }
        run();
    }, [])


    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        const run = async () => {
            await handleGetNotes()
        }
        run();
        setTimeout(() => {
            setRefreshing(false);
        }, 500);
    }, []);

    return (
        <Container>
            <ThemedText style={{ fontSize: 30, fontWeight: 700 }}>
                HelixNotes
            </ThemedText>

            <View>
                <ScrollView horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 8 }}
                    style={{ marginTop: 10 }}
                >
                    <ThemedView style={styles.navList}>
                        <ThemedText style={styles.navListText}>All Notes</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.navList}>
                        <ThemedText style={styles.navListText}>Today</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.navList}>
                        <ThemedText style={styles.navListText}>Exams</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.navList}>
                        <ThemedText style={styles.navListText}>Tasks</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.navList}>
                        <ThemedText style={styles.navListText}>Projects</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.navList}>
                        <ThemedText style={styles.navListText}>Ideas</ThemedText>
                    </ThemedView>
                </ScrollView>
            </View>

            <View style={styles.viewButton}>
                <TouchableOpacity onPress={() => setNumColumns(numColumns === 1 ? 2 : 1)}>
                    <View>
                        {
                            numColumns === 1 ? <MaterialIcons name="checklist" size={35} color="orange" />
                                :
                                <Entypo name="grid" size={35} color="orange" />
                        }
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.addNote}>
                <Link href="/AddNote">
                    <AntDesign name="file-add" size={24} color="white" />
                </Link>
            </View>

            <View>
                <FlatList
                    data={notes}
                    numColumns={numColumns}
                    key={numColumns}
                    keyExtractor={(item: TNote, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={[styles.box, { width: numColumns == 2 ? "50%" : "auto", marginHorizontal: 3, flex: 1 }]}>

                            <View style={{ height: 10, backgroundColor: item.head }}></View>
                            <View style={{ height: 90, backgroundColor: item.body }}>
                                <Text style={styles.item}>
                                    {item?.title}
                                </Text>
                            </View>

                        </View>
                    )}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    contentContainerStyle={{ paddingBottom: 120 }}
                />
            </View>

        </Container>
    )
}

const styles = StyleSheet.create({
    item: {
        margin: 10,
        fontSize: 18,
        color: "black",
    },
    box: {
        borderRadius: 10,
        overflow: "hidden",
        flex: 1,
        marginTop: 5,
    },
    addNote: {
        position: "absolute",
        bottom: 40,
        right: 10,
        backgroundColor: "#0077b6",
        padding: 20,
        borderRadius: "50%",
        zIndex: 10,
    },
    viewButton: {
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    navList: {
        paddingHorizontal: 8,
        borderRadius: 5
    },
    navListText: {
        fontSize: 18
    }
});