import React, { useState, useEffect } from "react";
import { 
  View, 
  FlatList, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert 
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

// Use consistent API URL - adjust this to match your other files
const API_BASE_URL = 'https://vocabapp-backend-3ec74c7b267c.herokuapp.com';

interface VocabList {
  id: string;  // Changed from listID (number) to id (string) for MongoDB
  userId: string;
  listName: string;
  createdAt: string;
}

interface RouteParams {
  userID: string;  // Changed from number to string
  vocabHistoryID?: string;
}

interface VocabListPageProps {
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

const VocabListPage = ({ route }: VocabListPageProps) => {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [vocabLists, setVocabLists] = useState<VocabList[]>([]);
  const { userID, vocabHistoryID } = route.params;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    console.log("📋 VocabListPage loaded");
    console.log("👤 userID:", userID);
    console.log("📚 vocabHistoryID:", vocabHistoryID);
    loadVocabLists();
  }, [userID]);

  const loadVocabLists = async () => {
    setLoading(true);
    try {
      console.log("🔍 Fetching vocab lists from backend...");
      console.log("🌐 URL:", `${API_BASE_URL}/api/vocab/lists/${userID}`);

      const response = await fetch(
        `${API_BASE_URL}/api/vocab/lists/${userID}`
      );

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        throw new Error(`Failed to fetch lists: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Received lists:", JSON.stringify(data, null, 2));
      console.log("📊 Total lists:", data.length);

      setVocabLists(data);
    } catch (error) {
      console.error("=" .repeat(50));
      console.error("❌ Error loading vocab lists:", error);
      console.error("=" .repeat(50));
      Alert.alert(
        "Error", 
        "Failed to load vocab lists. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const Item = ({ item, onPress, backgroundColor, textColor }: ItemProps) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
      <Text style={[styles.listName, { color: textColor }]}>{item.listName}</Text>
      <Text style={[styles.listDate, { color: textColor }]}>
        Created: {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: VocabList }) => {
    const backgroundColor = item.id === selectedId ? "#aed6f1" : "#5dade2";
    const color = item.id === selectedId ? "black" : "white";

    return (
      <Item
        item={item}
        onPress={() => {
          console.log("📌 List selected:", item.listName, "ID:", item.id);
          setSelectedId(item.id);
          (navigation as any).navigate("WordListPage", { 
            userID, 
            listID: item.id,
            listName: item.listName 
          });
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <SafeAreaProvider>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            console.log("🔙 Navigating back to LandingPage");
            (navigation as any).navigate("LandingPage", { userID });
          }}
        >
          <Text style={styles.backButtonText}>&#8249; Back</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Your Vocab Lists</Text>
        </View>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={loadVocabLists}
        >
          <Text style={styles.refreshButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>

      <SafeAreaView style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#5dade2" />
            <Text style={styles.loadingText}>Loading Vocab Lists...</Text>
          </View>
        ) : vocabLists.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.noListsText}>No Vocab Lists Found</Text>
            <Text style={styles.emptySubtext}>
              Create a new list from the landing page to get started!
            </Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => {
                console.log("➕ Navigating to ListCreation");
                (navigation as any).navigate("ListCreation", { userID });
              }}
            >
              <Text style={styles.createButtonText}>+ Create New List</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.listCount}>
              {vocabLists.length} {vocabLists.length === 1 ? 'list' : 'lists'} found
            </Text>
            <FlatList
              data={vocabLists}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              refreshing={loading}
              onRefresh={loadVocabLists}
            />
          </>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    backgroundColor: "white",
    borderBottomColor: '#ddd',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: "blue",
    fontSize: 18,
    fontWeight: "600",
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 8,
  },
  refreshButtonText: {
    fontSize: 24,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noListsText: {
    textAlign: "center",
    color: "#888",
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listCount: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginVertical: 10,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  listDate: {
    fontSize: 12,
    opacity: 0.8,
  },
});

export default VocabListPage;