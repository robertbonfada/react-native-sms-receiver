# react-native-sms-receiver
A package that creates a broadcast receiver of SMS

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
import React from "react";
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
      <Text>IT'S TIME</Text>
    </View>
  );
}
```
