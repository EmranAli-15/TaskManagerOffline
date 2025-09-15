import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import Container from '@/components/Container';
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

const noteColorPallate = [
  { id: 0, head: "#77BEF0", body: "#CBDCEB" },
  { id: 1, head: "#ffdc75", body: "#fff2cc" },
  { id: 2, head: "#eca3a3", body: "#f6d6d6" },
  { id: 3, head: "#a5d732", body: "#ddf0b2" },
  { id: 4, head: "#d94c9f", body: "#f4cce3" },
  { id: 5, head: "#875ab2", body: "#d2c1e2" }
]

export default function AddNote() {
  let color = "white";
  const colorScheme = useColorScheme();
  if (colorScheme == "dark") color = "white";
  else color = "black";


  const t = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit aperiam reiciendis commodi eligendi, natus minima pariatur quibusdam unde incidunt, nam placeat eum harum quaerat quos doloremque mollitia exercitationem delectus beatae repellendus dolorum ipsam! Inventore dolor placeat quam itaque est nam rerum odit accusamus mollitia. Dolores beatae qui eveniet nostrum quia et id numquam. Nobis delectus quae pariatur odit rerum enim voluptate dicta modi, voluptatum illo voluptates vitae fuga ab praesentium corrupti sequi id officia, molestias sint nulla autem cumque cupiditate eveniet quaerat? Itaque pariatur odit ab iste adipisci dolore vel officia aspernatur laborum. Amet beatae obcaecati nihil neque natus quisquam, saepe magnam fugiat vitae? Eveniet quasi quos consequatur vel porro? Fugit asperiores cumque, voluptate maxime recusandae doloremque! Numquam exercitationem quis, modi unde, autem explicabo itaque accusantium cupiditate ratione doloribus, dolore blanditiis! Quo totam repellendus minus magni veritatis alias, reprehenderit illum? Molestiae atque iste, ipsa quasi at facere labore accusantium rerum unde est voluptatem id quis vero laborum dolor delectus pariatur repellat minus eos nesciunt iusto aliquid perferendis voluptas ducimus? Enim molestiae, explicabo cum perspiciatis pariatur quisquam rerum in consectetur eos provident vero illum officia blanditiis commodi, impedit doloribus tempore animi atque tempora mollitia at ea optio recusandae? Dolorem, consectetur illum.Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit aperiam reiciendis commodi eligendi, natus minima pariatur quibusdam unde incidunt, nam placeat eum harum quaerat quos doloremque mollitia exercitationem delectus beatae repellendus dolorum ipsam! Inventore dolor placeat quam itaque est nam rerum odit accusamus mollitia. Dolores beatae qui eveniet nostrum quia et id numquam. Nobis delectus quae pariatur odit rerum enim voluptate dicta modi, voluptatum illo voluptates vitae fuga ab praesentium corrupti sequi id officia, molestias sint nulla autem cumque cupiditate eveniet quaerat? Itaque pariatur odit ab iste adipisci dolore vel officia aspernatur laborum. Amet beatae obcaecati nihil neque natus quisquam, saepe magnam fugiat vitae? Eveniet quasi quos consequatur vel porro? Fugit asperiores cumque, voluptate maxime recusandae doloremque! Numquam exercitationem quis, modi unde, autem explicabo itaque accusantium cupiditate ratione doloribus, dolore blanditiis! Quo totam repellendus minus magni veritatis alias, reprehenderit illum? Molestiae atque iste, ipsa quasi at facere labore accusantium rerum unde est voluptatem id quis vero laborum dolor delectus pariatur repellat minus eos nesciunt iusto aliquid perferendis voluptas ducimus? Enim molestiae, explicabo cum perspiciatis pariatur quisquam rerum in consectetur eos provident vero illum officia blanditiis commodi, impedit doloribus tempore animi atque tempora mollitia at ea optio recusandae? Dolorem, consectetur illum."


  const [showOps, setShowOps] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
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


  return (
    <Container>
      <View style={{ flex: 1, height: "100%" }}>
        <ScrollView>
          <View>
            <TextInput
              multiline={true}
              style={[styles.title, { color: noteColorPallate[noteColor].head }]}
              onChangeText={(text) => setTitle(text)}
              placeholderTextColor="gray"
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
                      <TouchableOpacity onPress={() => setNoteColor(item.id)}>
                        <View style={[styles.colorStyle, { backgroundColor: item.head, marginHorizontal: 10, flex: 1 }]}></View>
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
