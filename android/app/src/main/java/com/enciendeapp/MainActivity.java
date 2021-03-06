package com.enciendeapp;

import android.content.Intent;     // <--- import
import android.content.res.Configuration; // <--- import
import com.github.yamill.orientation.OrientationPackage;
import com.image.zoom.ReactImageZoom;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import io.neson.react.notification.NotificationPackage;
import com.oney.gcm.GcmPackage;
import com.microsoft.codepush.react.CodePush;
import com.AirMaps.AirPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.imagepicker.ImagePickerPackage;
import com.enciendeapp.services.LocationReportingServicePackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.rnfs.RNFSPackage;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {
    CallbackManager mCallbackManager;
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "enciendeApp";
    }

    @Override
    protected String getJSBundleFile() {
        return CodePush.getBundleUrl();
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        mCallbackManager = new CallbackManager.Factory().create();
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new GcmPackage(),
            new NotificationPackage(this),
            new AirPackage(),
            new OrientationPackage(this),
            new ReactImageZoom(),
            new ImagePickerPackage(),
            new FBSDKPackage(mCallbackManager),
            new LocationReportingServicePackage(),
            new LinearGradientPackage(),
            new RNFSPackage(),
            new CodePush("XcSFY3U6ZUNo0ANxutOKPzhuos8oNy6WzQ7-W", this, BuildConfig.DEBUG)
        );
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        this.sendBroadcast(intent);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        FacebookSdk.sdkInitialize(getApplicationContext());
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        mCallbackManager.onActivityResult(requestCode, resultCode, data);
    }
}
