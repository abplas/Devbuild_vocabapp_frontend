import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const API_BASE_URL = "https://vocabapp-backend-3ec74c7b267c.herokuapp.com";

interface VocabList {
  id: string;
  userId: string;
  listName: string;
}

interface RouteParams {
  userID: string;
  vocabHistoryID: string;
  dailyWord: string;
  definition: string;
}

interface PickListProps {
  route: {
    params: RouteParams;
  };
}

interface ItemProps {
  item: VocabList;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
}

export default function PickList({ route }: PickListProps) {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [vocabLists, setVocabLists] = useState<VocabList[]>([]);
  const { userID, vocabHistoryID, dailyWord, definition } = route.params;
  const [selectedID, setSelectedID] = useState<string | null>(null);

  useEffect(() => {
    console.log("=".repeat(50));
    console.log("🎬 PickList screen loaded");
    console.log("👤 userID:", userID);
    console.log("📁 vocabHistoryID:", vocabHistoryID);
    console.log("📝 dailyWord:", dailyWord);
    console.log("📖 definition:", definition);
    console.log("=".repeat(50));

    loadVocabLists();
  }, []);

  const loadVocabLists = async () => {
    try {
      console.log("🔍 Loading vocab lists...");
      console.log(
        "🌐 URL:",
        `${API_BASE_URL}/api/vocab/lists/${userID}/exclude-history`
      );

      const response = await fetch(
        `${API_BASE_URL}/api/vocab/lists/${userID}/exclude-history`
      );

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        throw new Error(`Failed to fetch lists: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Received data:", JSON.stringify(data, null, 2));

      setVocabLists(data.lists || []);
      console.log("📊 Total lists loaded:", (data.lists || []).length);
    } catch (error) {
      console.error("=".repeat(50));
      console.error("❌ Error loading vocab lists:", error);
      console.error("=".repeat(50));
      Alert.alert(
        "Error",
        "Failed to load vocab lists. Check console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  const Item = ({ item, onPress, backgroundColor, textColor }: ItemProps) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.item, { backgroundColor }]}
    >
      <Text style={[styles.listName, { color: textColor }]}>
        {item.listName}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: VocabList }) => {
    const backgroundColor = item.id === selectedID ? "#aed6f1" : "#5dade2";
    const color = item.id === selectedID ? "black" : "white";

    return (
      <Item
        item={item}
        onPress={() => {
          console.log("📌 List selected:", item.listName);
          setSelectedID(item.id);
          saveWordToList(item.id, item.listName);
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  const saveWordToList = async (chosenID: string, listName: string) => {
    console.log("=".repeat(50));
    console.log("💾 Saving word to list");
    console.log("📝 Word:", dailyWord);
    console.log("📖 Definition:", definition);
    console.log("📁 List ID:", chosenID);
    console.log("📋 List name:", listName);
    console.log("👤 User ID:", userID);

    try {
      const requestBody = {
        userId: userID,
        listId: chosenID,
        word: dailyWord,
        definition: definition,
      };

      console.log("📦 Request body:", JSON.stringify(requestBody, null, 2));
      console.log("🌐 URL:", `${API_BASE_URL}/api/vocab/words`);

      const response = await fetch(`${API_BASE_URL}/api/vocab/words`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📡 Response status:", response.status);

      const data = await response.json();
      console.log("📄 Response data:", JSON.stringify(data, null, 2));

      if (response.ok) {
        console.log(`✅ SUCCESS! Saved '${dailyWord}' to ${listName}`);
        Alert.alert("Success", `Word saved to ${listName}!`, [
          {
            text: "OK",
            onPress: () => {
              console.log("🔙 Navigating back");
              navigation.goBack();
            },
          },
        ]);
      } else {
        console.error(`❌ Failed to save: ${data.error}`);
        Alert.alert("Error", data.error || "Failed to save word");
      }
    } catch (error) {
      console.error("=".repeat(50));
      console.error("🚨 Error saving word:", error);
      console.error("=".repeat(50));
      Alert.alert("Error", "Could not connect to server");
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            console.log("🔙 Back button pressed");
            navigation.goBack();
          }}
        >
          <Text style={styles.backButtonText}>&#8249;- Back</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Select List to Add "{dailyWord}"</Text>
        </View>
        <View style={styles.rightContent} />
      </View>

      <SafeAreaView style={styles.container}>
        {loading ? (
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator size="large" color="#5dade2" />
            <Text style={{ textAlign: "center", marginTop: 10 }}>
              Loading lists...
            </Text>
          </View>
        ) : vocabLists.length === 0 ? (
          <View style={{ marginTop: 20, padding: 20 }}>
            <Text style={styles.noListsText}>No Created Vocab Lists Found</Text>
            <Text style={{ textAlign: "center", marginTop: 10, color: "#666" }}>
              Create a list first to add words to it
            </Text>
            <TouchableOpacity
              style={[
                styles.item,
                { backgroundColor: "#4CAF50", marginTop: 20 },
              ]}
              onPress={() => {
                console.log("➕ Create list button pressed");
                (navigation as any).navigate("ListCreation", { userID });
              }}
            >
              <Text style={[styles.listName, { color: "white" }]}>
                + Create New List
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={{ marginVertical: 10, color: "#666" }}>
              Tap a list to save "{dailyWord}"
            </Text>
            <FlatList
              data={vocabLists}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          </>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    backgroundColor: "white",
    borderBottomColor: "#ddd",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: "blue",
    fontSize: 16,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  rightContent: {
    width: 50,
    alignItems: "flex-end",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  noListsText: {
    textAlign: "center",
    color: "#888",
    fontSize: 18,
    fontWeight: "bold",
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  listName: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
