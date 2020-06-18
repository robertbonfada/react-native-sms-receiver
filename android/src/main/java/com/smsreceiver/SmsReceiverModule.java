package com.smsreceiver;

import android.Manifest;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.telephony.SmsMessage;

import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class SmsReceiverModule extends ReactContextBaseJavaModule {
  
  private final ReactApplicationContext reactContext;
  private BroadcastReceiver msgReceiver;

  public SmsReceiverModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "SmsReceiver";
  }

  @ReactMethod
  public void stopReadSMS() {
    try {
      if (reactContext != null && msgReceiver != null) {
        reactContext.unregisterReceiver(msgReceiver);
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  @ReactMethod
  public void startReadSMS(final Callback success, final Callback error) {
    try {
      if (ContextCompat.checkSelfPermission(reactContext, Manifest.permission.RECEIVE_SMS) == PackageManager.PERMISSION_GRANTED
        && ContextCompat.checkSelfPermission(reactContext, Manifest.permission.READ_SMS) == PackageManager.PERMISSION_GRANTED) {
          msgReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
              reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("received_sms", getMessageFromMessageIntent(intent));
            }
          };
          String SMS_RECEIVED_ACTION = "android.provider.Telephony.SMS_RECEIVED";
          reactContext.registerReceiver(msgReceiver, new IntentFilter(SMS_RECEIVED_ACTION));
          success.invoke("Start Read SMS successfully");
        } else {
          error.invoke("Required RECEIVE_SMS and READ_SMS permission");
        }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private String getMessageFromMessageIntent(Intent intent) {
    final Bundle bundle = intent.getExtras();
    String message = "";
    String address = "";
    String content = "";
    try {
      if (bundle != null) {
        final Object[] pdusObj = (Object[]) bundle.get("pdus");
        if (pdusObj != null) {
          for (Object aPdusObj : pdusObj) {
            SmsMessage currentMessage = SmsMessage.createFromPdu((byte[]) aPdusObj);
            message = currentMessage.getDisplayMessageBody();
            address = currentMessage.getDisplayOriginatingAddress();
          }
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    content = "{ \"address\": " + address + ", \"message\": " + message + "}" 
    return content;
  }
}