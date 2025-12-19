import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

import Container from '@/components/Container';
import MyModal from '@/components/MyModal';
import { ThemedText } from "@/components/themed-text";
import { deleteNote, getCategories, getColors, getSingleNote, updateNote } from "@/db/db";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

type TNoteColorPallate = { id: number, head: string, body: string };

export default function EditNote() {
    let color = "white";
    let colorBg = "#fff"
    const colorScheme = useColorScheme();
    if (colorScheme == "dark") {
        color = "white";
        colorBg = "#151718"
    }
    else {
        color = "black";
        colorBg = "#fff";
    }

    const router = useRouter();

    const [showOps, setShowOps] = useState(false);
    const [readMode, setReadMode] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [savedIndecator, setSavedIndicator] = useState(false);


    const { id } = useLocalSearchParams();

    const [title, setTitle] = useState("");
    const [details, setDetails] = useState("");
    const [categoryId, setCategoryId] = useState(1);
    const [noteColor, setNoteColor] = useState(Math.floor(Math.random() * 6));


    const [categories, setCategories] = useState<string[]>([]);
    const [noteColorPallate, setNoteColorPallate] = useState<TNoteColorPallate[]>([]);



    const handleSaveNote = async () => {
        const data = {
            title: title,
            details: details,
            color_id: noteColor + 1,
            category_id: categoryId,
            id: id
        }
        if (details || title) {
            await updateNote(data);
            setSavedIndicator(true);
            setTimeout(() => {
                setSavedIndicator(false);
            }, 400);
        }
    };

    const handleDeleteNote = async () => {
        await deleteNote(id);
        router.navigate("/");
    }









    const titleRef = useRef<TextInput | any>(null);
    const detailsRef = useRef<TextInput | any>(null);
    const keyboardDidHideCallback = () => {
        titleRef.current.blur?.();
        detailsRef.current.blur?.();
    }
    useEffect(() => {
        const keyboardDidHideSubscription = Keyboard.addListener('keyboardDidHide', keyboardDidHideCallback);
        return () => {
            keyboardDidHideSubscription?.remove();
        };
    }, []);

    useEffect(() => {
        const run = async () => {
            const colors = await getColors();
            const categories = await getCategories();
            setCategories(categories);
            setNoteColorPallate(colors);
            const note = await getSingleNote(id);
            setTitle(note?.title);
            setDetails(note?.details);
            setNoteColor((note?.colorId) - 1)
            setCategoryId(note?.categoryId)
        }

        run();
    }, [])


    return (
        <Container>
            <View style={{ flex: 1, height: "100%" }}>
                <ScrollView>
                    <View>


                        <>
                            {
                                openModal && <MyModal modal={openModal} setModal={setOpenModal}>


                                    <View style={{ alignItems: "center" }}>
                                        <TouchableOpacity
                                            onPress={() => setReadMode(!readMode)}>
                                            {
                                                readMode ? <View style={{ alignItems: "center" }}>
                                                    <Entypo name="eye" size={24} color="#0077b6" />
                                                    <Text>Reading Mode</Text>
                                                </View> :
                                                    <View style={{ alignItems: "center" }}>
                                                        <Entypo name="edit" size={24} color="#0077b6" />
                                                        <Text>Edit Mode</Text>
                                                    </View>
                                            }
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{ width: "100%", height: 2, backgroundColor: "gray", marginVertical: 20 }}></View>

                                    <View style={{ alignItems: "center" }}>
                                        <TouchableOpacity onPress={handleDeleteNote}>
                                            <AntDesign name="delete" size={24} color="red" />
                                        </TouchableOpacity>
                                        <Text>Delete</Text>
                                    </View>

                                </MyModal>
                            }
                        </>




                        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                            <TouchableOpacity onPress={() => setOpenModal(!openModal)}>
                                <SimpleLineIcons name="options-vertical" size={25} color={color} />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            multiline={true}
                            style={[styles.title, { color: noteColorPallate[noteColor]?.head }]}
                            onChangeText={(text) => setTitle(text)}
                            placeholderTextColor={noteColorPallate[noteColor]?.body}
                            placeholder='Title'
                            value={title}
                            readOnly={readMode}
                            ref={(ref) => {
                                titleRef && (titleRef.current = ref as any);
                            }}
                        />


                        <View style={{ marginTop: 20, marginBottom: 100 }}>
                            <TextInput
                                textAlignVertical='top'
                                multiline={true}
                                style={[styles.details, { color: color }]}
                                onChangeText={(text) => setDetails(text)}
                                placeholderTextColor="gray"
                                placeholder='Details ...'
                                value={details}
                                readOnly={readMode}
                                ref={(ref) => {
                                    detailsRef && (detailsRef.current = ref as any);
                                }}
                            />
                        </View>
                    </View>
                </ScrollView>

                <>
                    {
                        savedIndecator && <View style={[styles.savedIndecator, { backgroundColor: colorBg }]}>
                            <Text style={{ color: "#F97A00", textAlign: "center", fontWeight: 700 }}>Saved !</Text>
                        </View>
                    }
                </>


                {/* Save button */}
                <View style={{ position: "absolute", bottom: 10, right: 0 }}>
                    <TouchableOpacity onPress={handleSaveNote}>
                        <View style={{ backgroundColor: "#0077b6", borderRadius: 20, padding: 8 }}>
                            <Ionicons name="checkmark-done" size={40} color="white" />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ position: "absolute", bottom: 10 }}>
                    <View style={{ zIndex: 100, backgroundColor: colorBg, borderRadius: 20, flex: 1 }}>
                        <TouchableOpacity onPress={() => setShowOps(!showOps)}>
                            <View style={{ marginVertical: 10, alignSelf: "center" }}>
                                {!showOps && <MaterialIcons name="keyboard-double-arrow-up" size={40} color={color} />}
                                {showOps && <MaterialIcons name="keyboard-double-arrow-down" size={40} color={color} />}
                            </View>
                        </TouchableOpacity>


                        <>
                            {
                                showOps &&
                                <View style={{ marginTop: 10, marginBottom: 20 }}>
                                    <FlatList
                                        horizontal
                                        data={noteColorPallate}
                                        keyExtractor={(item: any, index) => index.toString()}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity onPress={() => setNoteColor(item.id - 1)}>
                                                <View style={[styles.colorStyle, { backgroundColor: item.head, marginHorizontal: 10, flex: 1 }]}></View>
                                            </TouchableOpacity>
                                        )}
                                        contentContainerStyle={{ marginBottom: 10 }}
                                    ></FlatList>
                                    <FlatList
                                        style={{ marginTop: 10 }}
                                        horizontal
                                        data={categories}
                                        keyExtractor={(item: any, index) => index.toString()}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity onPress={() => setCategoryId(item.id)}>
                                                <View style={{ flex: 1, marginHorizontal: 8, width: "100%" }}>
                                                    <ThemedText style={{ fontSize: 20, fontWeight: 600, textTransform: "capitalize", color: item?.id == categoryId ? "#0077b6" : color }}>{item?.name}</ThemedText>
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                        contentContainerStyle={{ marginBottom: 10 }}
                                    ></FlatList>
                                </View>
                            }
                        </>
                    </View>
                </View>
            </View>
        </Container >
    )
}

const styles = StyleSheet.create({
    title: {
        borderColor: "gray",
        borderBottomWidth: 2,
        fontSize: 25,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    },
    details: {
        fontSize: 18,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        minHeight: 200,
    },
    navList: {
        paddingHorizontal: 8,
        borderRadius: 5
    },
    navListText: {
        fontSize: 18
    },
    colorStyle: {
        height: 50,
        width: 50,
        borderRadius: "50%",
    },
    savedIndecator: {
        position: "absolute",
        zIndex: 10,
        top: 50,
        left: "35%",
        right: "35%",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5
    }
})
