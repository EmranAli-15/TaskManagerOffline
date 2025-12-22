import Container from '@/components/Container';
import MyModal from '@/components/MyModal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSeed } from '@/contextProvider/ContextProvider';
import { addNewCategory, deleteCategory, deleteMultipleNote, getCategories, getNotesByCategory } from '@/db/db';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Foundation from '@expo/vector-icons/Foundation';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type TNote = {
    id: number,
    head: string,
    body: string;
    title: string;
    details: string;
    isChecked: boolean
}

export default function HomeScreen() {
    const router = useRouter();
    const { isSeeded } = useSeed();

    const [deleteCategoryModal, setDeleteCategoryModal] = useState(false);
    const [idForDeleteCategory, setIdForDeleteCategory] = useState<null | number>(null);


    const [selection, setSelection] = useState(false);

    const [deleteMultipleNoteModal, setDeleteMultipleNoteModal] = useState(false);

    const [addCategoryModal, setAddCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState<any>("");

    const [notes, setNotes] = useState<any>([]);
    const [categories, setCategories] = useState([]);

    const [currentCategory, setCurrentCategory] = useState("");
    const [wantTodeleteCategoryName, setWantTodeleteCategoryName] = useState("");

    const [reFetch, setReFetch] = useState(false);
    const [numColumns, setNumColumns] = useState(1);







    // NOTES AND CATEGORY QUERY
    const handleGetNotes = async ({ id, title }: { id: number, title: string }) => {
        const allNotes = await getNotesByCategory(id);
        const mutedNotes = allNotes.map((note: any) => ({
            ...note,
            isChecked: false
        }));
        setNotes(mutedNotes);
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
            handleGetCategory();
        }
    }

    const handleDeleteCategory = async () => {
        if (idForDeleteCategory && idForDeleteCategory > 1) {
            await deleteCategory(idForDeleteCategory);
            await handleGetNotes({ id: 1, title: "All" });
            handleGetCategory();
        }
        setDeleteCategoryModal(false);
    }
    // CATEGORY MUTATION FUNCTIONS END



    // Delete note
    const handleDeleteMultipleNote = async () => {
        const ids = notes.filter((note: TNote) => note.isChecked == true).map((note: TNote) => note.id);

        if (!deleteMultipleNoteModal) setDeleteMultipleNoteModal(true);
        else {
            await deleteMultipleNote(ids);
            handleGetNotes({ id: 1, title: "All" });
            setSelection(false);
            setDeleteMultipleNoteModal(false);
        }
    }
    const handleSelectNote = (id: number) => {
        if (!selection) setSelection(true);
        const updatedNotes = notes.map((note: TNote) => {
            if (note.id === id) return { ...note, isChecked: !note.isChecked }
            else return note
        });
        setNotes(updatedNotes)
    };
    const handleCancleSelection = () => {
        const mutedNotes = notes.map((note: any) => ({
            ...note,
            isChecked: false
        }));
        setNotes(mutedNotes);
        setSelection(false);
    };



    useEffect(() => {
        const fn = async () => {
            handleGetCategory();
            await handleGetNotes({ id: 1, title: "All" });
            setReFetch(false);
        }
        if (isSeeded || reFetch) {
            fn();
        }
    }, [isSeeded, reFetch]);


    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        handleGetNotes({ id: 1, title: "All" })

        setTimeout(() => {
            setRefreshing(false);
        }, 500);
    }, []);



    if (!isSeeded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
    else return (
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
                        <Text style={{ textAlign: "center", fontWeight: "400", fontSize: 18 }}>Delete <Text style={{ color: "red", fontWeight: "600" }}>{wantTodeleteCategoryName}</Text> category?</Text>
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

            <View>
                <MyModal modal={deleteMultipleNoteModal} setModal={setDeleteMultipleNoteModal}>
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
                        <Text style={{ color: "gray", textAlign: "center" }}>This action cannot be undone. All notes associated with this category will be lost.</Text>

                        <TouchableOpacity
                            onPress={handleDeleteMultipleNote}
                        >
                            <View style={{ width: "100%", backgroundColor: "#0077b6", padding: 4 }}>
                                <Text style={{ textAlign: "center", color: "white" }}>Delete</Text>
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
                            onPress={() => {
                                handleCancleSelection()
                                handleGetNotes({ id: nav.id, title: nav.name })
                            }}
                            onLongPress={() => {
                                setWantTodeleteCategoryName(nav.name)
                                setIdForDeleteCategory(nav.id);
                                if (nav.id !== 1)
                                    setDeleteCategoryModal(true);
                            }}
                        >
                            <ThemedView style={[styles.navList, currentCategory === nav.name && { backgroundColor: "#0077b6" }]}>
                                <ThemedText style={[styles.navListText, currentCategory === nav.name && { color: "#fff" }]}>{nav.name}</ThemedText>
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
                <View>
                    {
                        selection && <View style={{ flexDirection: "row", columnGap: 20 }}>
                            <Pressable onPress={() => handleDeleteMultipleNote()}><MaterialIcons name="delete" size={24} color="red" /></Pressable>
                            <Pressable onPress={() => handleCancleSelection()}><ThemedText>Cancle</ThemedText></Pressable>
                        </View>
                    }
                </View>
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
                        <ThemedText style={{ color: "gray", textAlign: "center", marginTop: 10 }}>{currentCategory == "All" ? "You have no notes yet!" : `${currentCategory} \nis empty.`}</ThemedText>
                    </View>}
                    key={numColumns}
                    keyExtractor={(item: TNote, index) => index.toString()}
                    renderItem={({ item }) => (


                        <Pressable
                            onLongPress={() => handleSelectNote(item.id)}
                            style={{
                                width: numColumns == 2 ? "50%" : "auto",
                                marginTop: 5,
                                flex: 1,
                                paddingHorizontal: 3
                            }}
                            onPress={() => {
                                if (selection) {
                                    handleSelectNote(item.id)
                                } else {
                                    router.push({
                                        pathname: '/editNote/[id]',
                                        params: { id: item.id },
                                    });
                                }
                            }}
                        >

                            <View style={[styles.box]}>
                                <View style={{ height: 40, backgroundColor: item.head }}>
                                    <View style={{ height: "100%", flex: 1, justifyContent: "center", backgroundColor: item.isChecked ? "#000000ad" : "" }}>
                                        <Text style={{ paddingHorizontal: 10, fontSize: 16, fontWeight: "400", overflow: "hidden", color: "black" }}>{item.title.length > 30 ? <Text>{item.title.slice(0, 30)}...</Text> : item.title}</Text>
                                    </View>
                                </View>
                                <View style={{ height: 90, backgroundColor: item.body }}>
                                    <View style={{ height: "100%", backgroundColor: item.isChecked ? "#000000ad" : "" }}>
                                        <Text style={styles.item}>
                                            {item.details.length > 110 ? <Text>{item.details.slice(0, 110)}...</Text> : item.details}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                        </Pressable>
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
        fontSize: 14,
        color: "gray",
        overflow: "hidden"
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
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 8
    },
    navList: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 20,
    },
    navListText: {
        fontSize: 14
    },
    inputStyle: {
        borderWidth: 1,
        borderColor: "#0077b6",
        borderRadius: 4,
        marginTop: 1
    }
});