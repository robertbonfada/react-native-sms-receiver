# react-native-sms-receiver
A package that creates a broadcast receiver of SMS

<a href="https://www.buymeacoffee.com/robertbonfada" target="_blank"><img src="https://user-images.githubusercontent.com/23335817/89413420-31479200-d6ff-11ea-9dc5-dacbff973d74.PNG" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>

## Installation 🚀 
```bash
#yarn
yarn add react-native-sms-receiver

#npm
npm install react-native-sms-receiver
```

Then, import with:

```js
import { requestReadSMSPermission, startReadSMS} from 'react-native-sms-receiver/Receiver';
```

## Usage

Example:

```js
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { requestReadSMSPermission, startReadSMS} from 'react-native-sms-receiver/Receiver';

export default function App() {
  const startReadingMessages = async () => {
    const hasPermission = await requestReadSMSPermission();
    if(hasPermission) {
      startReadSMS((status: any, sms: any, error: any) => {
        if (status == "success") {
          console.log("Great 🤠 !! you have received new sms:", sms);
        }
      });
    }
  }

  useEffect(() => {
    startReadingMessages();
  }, [])

  return (
    <View>
      <Text>🛸</Text>
    </View>
  );
}
```
