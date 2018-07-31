package com.schoolmanagement;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnative.photoview.PhotoViewPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.emekalites.react.alarm.notification.ANPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.calendarevents.CalendarEventsPackage;
import com.react.rnspinkit.RNSpinkitPackage;

import com.reactlibrary.RNGooglePlacePickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new PhotoViewPackage(),
            new VectorIconsPackage(),
            new ANPackage(),
            new MapsPackage(),
            new CalendarEventsPackage(),
            new RNSpinkitPackage(),
            new RNGooglePlacePickerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
