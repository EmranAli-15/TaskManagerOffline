import Container from '@/components/Container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createCategoryTable, createColorTable, createNoteTable, getAllDataFromNoteTable, getCategoryDataFromNoteTable, insertDataIntoCategoryTable, insertDataIntoColorTable } from '@/db/Database';
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
    const [reFetch, setReFetch] = useState(false);
    const [notes, setNotes] = useState([])
    const [numColumns, setNumColumns] = useState(1);

    const handleGetNotes = async () => {

        const allNotes = await getAllDataFromNoteTable();
        setNotes(allNotes);
    }

    const handleGetCategoryNotes = async (category: number) => {
        const allNotes = await getCategoryDataFromNoteTable(category);
        setNotes(allNotes);
    }


    useEffect(() => {
        const run = async () => {
            if (reFetch) {
                await handleGetNotes()
                setReFetch(false);
            }
        }
        run();
    }, [reFetch]);
    useEffect(() => {
        const run = async () => {
            await createColorTable();
            await insertDataIntoColorTable();
            await createCategoryTable();
            await insertDataIntoCategoryTable();
            await createNoteTable();
            await handleGetNotes();
        }
        run();
    }, [])


    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        handleGetNotes()

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
                    style={{ marginTop: 20 }}
                >
                    <TouchableOpacity onPress={() => setReFetch(true)}>
                        <ThemedView style={styles.navList}>
                            <ThemedText style={styles.navListText}>All Notes</ThemedText>
                        </ThemedView>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleGetCategoryNotes(1)}>
                        <ThemedView style={styles.navList}>
                            <ThemedText style={styles.navListText}>Today</ThemedText>
                        </ThemedView>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleGetCategoryNotes(2)}>
                        <ThemedView style={styles.navList}>
                            <ThemedText style={styles.navListText}>Exams</ThemedText>
                        </ThemedView>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleGetCategoryNotes(3)}>
                        <ThemedView style={styles.navList}>
                            <ThemedText style={styles.navListText}>Tasks</ThemedText>
                        </ThemedView>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleGetCategoryNotes(4)}>
                        <ThemedView style={styles.navList}>
                            <ThemedText style={styles.navListText}>Projects</ThemedText>
                        </ThemedView>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleGetCategoryNotes(5)}>
                        <ThemedView style={styles.navList}>
                            <ThemedText style={styles.navListText}>Ideas</ThemedText>
                        </ThemedView>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <View style={styles.viewButton}>
                <TouchableOpacity onPress={() => setNumColumns(numColumns === 1 ? 2 : 1)}>
                    <View>
                        {
                            numColumns === 1 ? <MaterialIcons name="checklist" size={35} color="#0077b6" />
                                :
                                <Entypo name="grid" size={35} color="#0077b6" />
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
                    ListEmptyComponent={<View>
                        <ThemedText style={{ color: "gray", textAlign: "center", marginTop: 10 }}>No notes !</ThemedText>
                    </View>}
                    key={numColumns}
                    keyExtractor={(item: TNote, index) => index.toString()}
                    renderItem={({ item }) => (


                        <Link
                            style={{ width: numColumns == 2 ? "50%" : "auto", marginTop: 5, flex: 1, paddingHorizontal: 3 }}
                            href={{
                                pathname: '/editNote/[id]',
                                params: { id: item.id },
                            }}>
                            <View style={[styles.box]}>

                                <View style={{ height: 10, backgroundColor: item.head }}></View>
                                <View style={{ height: 90, backgroundColor: item.body }}>
                                    <Text style={styles.item}>
                                        {item.title.length > 30 ? <Text>{item.title.slice(0, 30)}...</Text> : item.title}
                                    </Text>
                                </View>

                            </View>
                        </Link>
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
        fontSize: 19,
        color: "black",
    },
    box: {
        borderRadius: 10,
        overflow: "hidden",
        flex: 1,
        width: "100%",
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