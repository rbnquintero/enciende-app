package com.enciendeapp.services;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationListener;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.text.ParseException;
import java.util.Date;

import android.os.AsyncTask;
import android.os.Bundle;
import android.location.Location;
import android.content.Context;
import android.content.SharedPreferences;

import com.noveogroup.android.log.Logger;
import com.noveogroup.android.log.LoggerManager;

import java.util.HashMap;
import java.util.Map;

public class LocationReportingService extends ReactContextBaseJavaModule implements GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener, LocationListener {
  private static final Logger logger = LoggerManager.getLogger(LocationReportingService.class);

  public LocationReportingService(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  private String grupoId = "";
  private String usuarioId = "";
  private Date fechafinal;
  private SimpleDateFormat format;
  private Location mLastLocation;
  private GoogleApiClient mGoogleApiClient = null;
  private LocationListener locationListener;
  private LocationRequest mLocationRequest;
  private SharedPreferences prefs;
  String locations = "";

  @Override
  public String getName() {
    return "LocationReportingService";
  }

  @ReactMethod
  public void beginReportingLocation(String grupo, String usuario, String fechafinalStr) {
    String pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ";
    format = new SimpleDateFormat(pattern);
    try {
      fechafinal = format.parse(fechafinalStr);
    } catch (ParseException pe) {
      pe.printStackTrace();
    }
    logger.d("######################");
    logger.d(fechafinal.toString());
    grupoId = grupo;
    usuarioId = usuario;
    if(prefs == null) {
      prefs = getCurrentActivity().getSharedPreferences("com.enciendeapp", Context.MODE_PRIVATE);
    }
    if(locations == null || locations == "") {
      locations = prefs.getString("com.enciendeapp.locations", "");
      if(locations == null) {
        locations = "";
      }
    }
    if (checkGooglePlayServices()) {
		    buildGoogleApiClient();
		}
    logger.d("Result: " + checkGooglePlayServices());
  }

  @ReactMethod
  public void stopReportingLocation() {

  }

  private boolean checkGooglePlayServices(){
  	int checkGooglePlayServices = GooglePlayServicesUtil.isGooglePlayServicesAvailable(getReactApplicationContext());
  	if (checkGooglePlayServices != ConnectionResult.SUCCESS) {
  		return false;
  	}
  	return true;
  }

  protected synchronized void buildGoogleApiClient() {
    if(mGoogleApiClient == null) {
    	mGoogleApiClient = new GoogleApiClient.Builder(getReactApplicationContext())
    		.addConnectionCallbacks(this)
    		.addOnConnectionFailedListener(this)
    		.addApi(LocationServices.API)
    		.build();
    }
    if(mLocationRequest == null) {
      createLocationRequest();
    }
    if (!mGoogleApiClient.isConnecting() && !mGoogleApiClient.isConnected()) {
      mGoogleApiClient.connect();
    }
  }

  protected void createLocationRequest() {
  	mLocationRequest = new LocationRequest();
  	mLocationRequest.setInterval(240000);
  	mLocationRequest.setFastestInterval(120000);
  	mLocationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
  }

  protected void startLocationUpdates() {
  	LocationServices.FusedLocationApi.requestLocationUpdates(
  		mGoogleApiClient, mLocationRequest, this);
  }

  protected void stopLocationUpdates() {
  	if (mGoogleApiClient != null) {
  		LocationServices.FusedLocationApi.removeLocationUpdates(
  		mGoogleApiClient, this);
  	}
  }

  @Override
	public void onConnected(Bundle bundle) {
    mLastLocation = LocationServices.FusedLocationApi.getLastLocation(mGoogleApiClient);
  	if (mLastLocation != null) {
  		manageLocation(mLastLocation);
  	}
    startLocationUpdates();
	}

	@Override
	public void onConnectionSuspended(int i) {
    stopLocationUpdates();
	}

	@Override
	public void onConnectionFailed(ConnectionResult connectionResult) {
    stopLocationUpdates();
	}

  @Override
	public void onLocationChanged(Location location) {
		mLastLocation = location;
    manageLocation(location);
	}

  private void manageLocation(Location location) {
    locations = locations + mLastLocation.getLatitude() + "," + mLastLocation.getLongitude() + "," + mLastLocation.getAccuracy() + "," + format.format(new Date()) + ";";
    try {
      if(fechafinal!=null && (new Date()).after(fechafinal)) {
        stopLocationUpdates();
        return;
      }

      StringBuffer jsonString = new StringBuffer();
      jsonString.append("{\"grupoId\":\"" + grupoId + "\",\"usuarioId\":\"" + usuarioId + "\",\"locations\":[");
      logger.d(locations);
      for(String point : locations.split(";")) {
        jsonString.append("{\"latitud\":\"" + point.split(",")[0] + "\",");
        jsonString.append("\"longitud\":\"" + point.split(",")[1] + "\",");
        jsonString.append("\"precision\":\"" + point.split(",")[2] + "\",");
        jsonString.append("\"hora\":\"" + point.split(",")[3] + "\"},");
      }
      jsonString.append("]}");
      logger.d(jsonString.toString());
      new SaveLocationTask(prefs).execute(jsonString.toString());

      logger.e("this locations");
      logger.e(prefs.getString("com.enciendeapp.locations", ""));
    } catch (Exception e) {
      logger.e(e);
    }

    logger.d("Latitude:" + mLastLocation.getLatitude()+", Longitude:"+mLastLocation.getLongitude() + ", Accuracy: " + mLastLocation.getAccuracy());
    /*SharedPreferences sharedPref = getCurrentActivity().getPreferences(Context.MODE_PRIVATE);
    SharedPreferences.Editor editor = sharedPref.edit();
    editor.putString("locations", locations);
    editor.commit();*/
  }

  private class SaveLocationTask extends AsyncTask<String, Void, Boolean> {
    SharedPreferences preferences;
    public SaveLocationTask(SharedPreferences preferences) {
      this.preferences = preferences;
    }

    protected Boolean doInBackground(String... json) {
      try {
        URL url = new URL("http://app-enciende.rhcloud.com/location/guardar");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
  			conn.setDoOutput(true);
  			conn.setRequestMethod("POST");
  			conn.setRequestProperty("Content-Type", "application/json");

  			String input = json[0];
  			input = input.replaceAll(",null", "");
        input = input.replaceAll(",]", "]");

  			System.out.println(input);
  			OutputStream os = conn.getOutputStream();
  			os.write(input.getBytes());
  			os.flush();

  			if (conn.getResponseCode() != HttpURLConnection.HTTP_CREATED && conn.getResponseCode() != 200) {
  				throw new RuntimeException("Failed : HTTP error code : " + conn.getResponseCode());
  			}

  			BufferedReader br = new BufferedReader(new InputStreamReader((conn.getInputStream())));

  			String output;
  			logger.d("Output from Server .... \n");
  			while ((output = br.readLine()) != null) {
  				logger.d(output);
          if(!output.contains("\"success\":true")){
            logger.d("Error!");
          }
          if(output.contains("\"terminate\":true")){
            stopLocationUpdates();
          }
  			}

  			conn.disconnect();
        return true;
      } catch (Exception e) {
        logger.e(e);
        return false;
      }
    }

    protected void onPostExecute(Boolean result) {
        if(result) {
          locations = "";
        }
        logger.d("#### locations");
        logger.d(locations);
        if(this.preferences != null) {
          SharedPreferences.Editor editor = this.preferences.edit();
          editor.putString("com.enciendeapp.locations", locations);
          editor.commit();
        } else {
          logger.e("invalid preferences");
        }
    }
  }

}
