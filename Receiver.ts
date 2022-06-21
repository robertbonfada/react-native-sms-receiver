import {
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform,
} from 'react-native';

const hasSMSPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }
  const hasReceiveSmsPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
  );

  const hasReadSmsPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_SMS,
  );

  if (hasReceiveSmsPermission && hasReadSmsPermission) {
    return true;
  }
  return false;
};

export async function startReadSMS(callback: any) {
  let resultFun = (status: any, sms: any, error?: any) => {
    if (callback) {
      callback(status, sms, error);
    }
  };
  if (Platform.OS === 'android') {
    const hasPermission = await hasSMSPermission();
    if (hasPermission) {
      NativeModules.SmsReceiver.startReadSMS(
        (result: any) => {
          new NativeEventEmitter(NativeModules.SmsReceiver).addListener(
            'received_sms',
            (sms) => {
              resultFun('success', sms);
            },
          );
        },
        (error: any) => {
          resultFun('error', '', error);
        },
      );
    } else {
      resultFun('error', '', 'Required RECEIVE_SMS and READ_SMS permission');
    }
  } else {
    resultFun('error', '', 'ReadSms Plugin is only for android platform');
  }
}

export async function requestReadSMSPermission() {
  if (Platform.OS === 'android') {
    const hasPermission = await hasSMSPermission();
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      PermissionsAndroid.PERMISSIONS.READ_SMS,
    ]);
    // As we request multiple permission, requestMultiple Method returns and object so we need to check like below code.
    if (
      status[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] === PermissionsAndroid.RESULTS.GRANTED &&
      status[PermissionsAndroid.PERMISSIONS.READ_SMS] === PermissionsAndroid.RESULTS.GRANTED
    ) {
      return true;
    }
    
    if (status[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] === PermissionsAndroid.RESULTS.DENIED &&
      status[PermissionsAndroid.PERMISSIONS.READ_SMS] === PermissionsAndroid.RESULTS.DENIED
    ) {
      console.log('Read Sms permission denied by user.', status);
    } else if (status[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN &&
      status[PermissionsAndroid.PERMISSIONS.READ_SMS] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
    ) {
      console.log('Read Sms permission revoked by user.', status);
    }
    return false;
  }
  return true;
}

export function stopReadSMS() {
  if (Platform.OS === 'android') {
    NativeModules.SmsReceiver.stopReadSMS();
  }
}