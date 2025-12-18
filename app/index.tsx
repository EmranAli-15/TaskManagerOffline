import Container from '@/components/Container';
import MyModal from '@/components/MyModal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { addNewCategory, deleteCategory, getCategories, getNotesByCategory } from '@/db/db';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Foundation from '@expo/vector-icons/Foundation';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { prepareDatabase } from '../db/init';

type TNote = {
    id: number,
    head: string,
    body: string;
    title: string;
}

export default function HomeScreen() {
    const [ready, setReady] = useState(false);
    const router = useRouter();

    const [deleteCategoryModal, setDeleteCategoryModal] = useState(false);
    const [idForDeleteCategory, setIdForDeleteCategory] = useState<null | number>(null)

    const [addCategoryModal, setAddCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState<any>("");

    const [notes, setNotes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState("");

    const [reFetch, setReFetch] = useState(false);
    const [numColumns, setNumColumns] = useState(1);







    // NOTES AND CATEGORY QUERY
    const handleGetNotes = async ({ id, title }: { id: number, title: string }) => {
        const allNotes = await getNotesByCategory(id);
        setNotes(allNotes);
        setCurrentCategory(title);
    };

    const handleGetCategory = async () => {
        const data = await getCategories();
        setCategories(data);
    };
    // NOTES AND CATEGORY QUERY END







    // CATEGORY MUTATION FUNCTIONS
    const handleAddCategory = async () => {
        if (!newCategoryName) return setAddCategoryModal(false);
        else {
            await addNewCategory({ name: newCategoryName });
            setNewCategoryName("");
            setAddCategoryModal(false);
            handleGetCategory()
        }
    }

    const handleDeleteCategory = async () => {
        if (idForDeleteCategory && idForDeleteCategory > 1) {
            await deleteCategory(idForDeleteCategory);
            handleGetCategory()
        }
        setDeleteCategoryModal(false);
    }
    // CATEGORY MUTATION FUNCTIONS END




    useEffect(() => {
        (async () => {
            try {
                if (ready) handleGetCategory();

                if (reFetch || ready) {
                    await handleGetNotes({ id: 1, title: "All Notes" });
                    setReFetch(false);
                }
            } catch (error) {

            }
        })();
    }, [reFetch, ready]);

    useEffect(() => {
        (async () => {
            try {
                if (!ready) {
                    await prepareDatabase();
                    setReady(true);
                }
            } catch (e) {
                console.error('DB init error => :', e);
            }
        })();
    }, [])


    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        handleGetNotes({ id: 1, title: "All Notes" })

        setTimeout(() => {
            setRefreshing(false);
        }, 500);
    }, []);


    if (!ready) {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }


    console.log(notes)
    console.log(categories)

    return (
        <Container>

            {/* MODAL VIEW SECTION */}
            <View>
                <MyModal modal={deleteCategoryModal} setModal={setDeleteCategoryModal}>
                    <View style={{ flexDirection: "column", rowGap: 8 }}>
                        <View style={{ alignItems: "center" }}>
                            <View style={{
                                padding: 5,
                                backgroundColor: "#fff4e5",
                                height: 45,
                                width: 45,
                                borderRadius: "50%",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                            >
                                <Foundation name="alert" size={30} color="#ed6c02" />
                            </View>
                        </View>
                        <Text style={{ textAlign: "center", fontWeight: "400", fontSize: 18 }}>Delete this category?</Text>
                        <Text style={{ color: "gray", textAlign: "center" }}>This action cannot be undone. All notes associated with this category will be lost.</Text>

                        <TouchableOpacity
                            onPress={handleDeleteCategory}
                        >
                            <View style={{ width: "100%", backgroundColor: "#0077b6", padding: 4 }}>
                                <Text style={{ textAlign: "center", color: "white" }}>Delete</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setDeleteCategoryModal(false)}
                        >
                            <View style={{ width: "100%", borderWidth: 1, borderColor: "#0077b6", padding: 4 }}>
                                <Text style={{ textAlign: "center" }}>Cancle</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </MyModal>
            </View>

            <View>
                <MyModal modal={addCategoryModal} setModal={setAddCategoryModal}>
                    <View style={{ flexDirection: "column", rowGap: 8 }}>
                        <View>
                            <Text>Category Name:</Text>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={text => setNewCategoryName(text)}
                                value={newCategoryName}
                            >
                            </TextInput>
                        </View>
                        <TouchableOpacity
                            onPress={handleAddCategory}
                        >
                            <View style={{ width: "100%", backgroundColor: "#0077b6", padding: 4 }}>
                                <Text style={{ textAlign: "center", color: "white" }}>Add</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </MyModal>
            </View>
            {/* MODAL VIEW SECTION END */}




            <ThemedText style={{ fontSize: 30, fontWeight: 700 }}>
                HelixNotes
            </ThemedText>

            <View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 8 }}
                    style={{ marginTop: 20 }}
                >
                    {
                        categories.map((nav: any, idx) => <TouchableOpacity
                            key={idx}
                            onPress={() => handleGetNotes({ id: nav.id, title: nav.name })}
                            onLongPress={() => {
                                setIdForDeleteCategory(nav.id);
                                setDeleteCategoryModal(true);
                            }}
                        >
                            <ThemedView style={styles.navList}>
                                <ThemedText style={[styles.navListText, currentCategory === nav.name && { color: "#0077b6" }]}>{nav.name}</ThemedText>
                            </ThemedView>
                        </TouchableOpacity>)
                    }

                    <TouchableOpacity
                        onPress={() => setAddCategoryModal(true)}
                    >
                        <ThemedView style={styles.navList}>
                            <ThemedText style={styles.navListText}>
                                <AntDesign name="plus" size={24} color="#0077b6" />
                            </ThemedText>
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

            <TouchableOpacity
                onPress={() => router.navigate("/AddNote")}
                style={styles.addNote}
            >
                <AntDesign name="file-add" size={24} color="white" />
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
                <FlatList
                    data={notes}
                    numColumns={numColumns}
                    ListEmptyComponent={<View>
                        <ThemedText style={{ color: "gray", textAlign: "center", marginTop: 10 }}>No {currentCategory == "All Notes" ? "All" : currentCategory} notes !</ThemedText>
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
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 50,
    },
    navListText: {
        fontSize: 16
    },
    inputStyle: {
        borderWidth: 1,
        borderColor: "#0077b6",
        borderRadius: 4,
        marginTop: 1
    }
});