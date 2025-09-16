import { createCategoryTable, createColorTable, getDataFromCategoryTable, getDataFromColorTable, insertDataIntoCategoryTable, insertDataIntoColorTable } from "@/db/Database";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import Container from '@/components/Container';
import { ThemedText } from "@/components/themed-text";
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

type TNoteColorPallate = { id: number, head: string, body: string };

export default function AddNote() {
  let color = "white";
  const colorScheme = useColorScheme();
  if (colorScheme == "dark") color = "white";
  else color = "black";


  const [showOps, setShowOps] = useState(false);

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [categoryId, setCategoryId] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);

  const [noteColorPallate, setNoteColorPallate] = useState<TNoteColorPallate[]>([]);

  const [noteColor, setNoteColor] = useState(Math.floor(Math.random() * 6));


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
      await createColorTable();
      await createCategoryTable();

      await insertDataIntoColorTable();
      await insertDataIntoCategoryTable();

      const colors = await getDataFromColorTable();
      setNoteColorPallate(colors);

      const categories = await getDataFromCategoryTable();
      setCategories(categories);
    }

    run();
  }, [])


  return (
    <Container>
      <View style={{ flex: 1, height: "100%" }}>
        <ScrollView>
          <View>
            <TextInput
              multiline={true}
              style={[styles.title, { color: noteColorPallate[noteColor]?.head }]}
              onChangeText={(text) => setTitle(text)}
              placeholderTextColor={noteColorPallate[noteColor]?.body}
              placeholder='Title'
              value={title}
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
                ref={(ref) => {
                  detailsRef && (detailsRef.current = ref as any);
                }}
              />
            </View>
          </View>
        </ScrollView>

        <View style={{ position: "absolute", bottom: 10 }}>
          <View style={{ zIndex: 100, backgroundColor: "gray", borderRadius: 20, flex: 1 }}>
            <TouchableOpacity onPress={() => setShowOps(!showOps)}>
              <View style={{ marginVertical: 10, alignSelf: "center" }}>
                {!showOps && <MaterialIcons name="keyboard-double-arrow-up" size={40} color="white" />}
                {showOps && <MaterialIcons name="keyboard-double-arrow-down" size={40} color="white" />}
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
                          <ThemedText style={{ fontSize: 20, fontWeight: 600, textTransform: "capitalize", color: item?.id == categoryId ? "red" : "white" }}>{item?.name}</ThemedText>
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
  }
})
