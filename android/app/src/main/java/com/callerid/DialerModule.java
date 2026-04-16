package com.callerid; 

import android.app.role.RoleManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class DialerModule extends ReactContextBaseJavaModule {
    DialerModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "DialerModule";
    }

    @ReactMethod
    public void requestDefaultDialer() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            RoleManager roleManager = (RoleManager) getReactApplicationContext().getSystemService(Context.ROLE_SERVICE);
            if (roleManager != null && !roleManager.isRoleHeld(RoleManager.ROLE_DIALER)) {
                Intent intent = roleManager.createRequestRoleIntent(RoleManager.ROLE_DIALER);
                getCurrentActivity().startActivityForResult(intent, 101);
            }
        }
    }
}