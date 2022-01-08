import React, { useCallback, useRef, VFC } from "react";
import { View, Text, Button, Platform, Alert } from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";

const os = Platform.OS;

const App: VFC = () => {
  const viewShot = useRef(null);

  const permissionAlert = () => {
    Alert.alert(
      "画像の保存が許可されませんでした。",
      "設定から画像の保存を許可してください。"
    );
  };

  const saveImageFromView = async () => {
    try {
      const uri = await captureRef(viewShot);
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("画像の保存完了");
    } catch (e) {
      console.log(e);
      permissionAlert();
    }
  };

  const capture = useCallback(async () => {
    // android
    if (os === "android") {
      const permission = await MediaLibrary.getPermissionsAsync();
      if (permission.canAskAgain && permission.status !== "granted") {
        const permissionResponse = await MediaLibrary.requestPermissionsAsync();
        if (permissionResponse.status !== "granted") {
          permissionAlert();
        } else {
          await saveImageFromView();
        }
      } else if (permission.status !== "granted") {
        permissionAlert();
      } else {
        await saveImageFromView();
      }
    }
    // iOS
    else {
      await saveImageFromView();
    }
  }, []);

  return (
    <View>
      <ViewShot
        ref={viewShot}
        style={{ height: 500, width: 300, backgroundColor: "red" }}
      >
        <Text style={{ fontSize: 30, marginTop: 200, textAlign: "center" }}>
          {"こんにちは〜"}
        </Text>
      </ViewShot>
      <Button title="変換して保存する" onPress={capture} />
    </View>
  );
};

export default App;
