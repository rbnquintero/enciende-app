//
//  LocationHandler.m
//  ControllerTest
//
//  Created by Ruben Quintero on 9/4/15.
//  Copyright (c) 2015 Ruben Quintero. All rights reserved.
//

#import "LocationHandler.h"
#import <CoreLocation/CoreLocation.h>
#import <AddressBookUI/AddressBookUI.h>
static LocationHandler *DefaultManager = nil;

@interface LocationHandler()
-(void)initiate;
@end

@implementation LocationHandler

+(id)getSharedInstance{
    if (!DefaultManager) {
        DefaultManager = [[self allocWithZone:NULL]init];
        [DefaultManager initiate];
    }
    return DefaultManager;
}

-(void)initiate {
    locationManager = [[CLLocationManager alloc]init];
    locationManager.desiredAccuracy = kCLLocationAccuracyNearestTenMeters;
    locationManager.distanceFilter = 50.0f;
    locationManager.delegate = self;
    locationManager.allowsBackgroundLocationUpdates = YES;
    locationManager.pausesLocationUpdatesAutomatically = NO;
    if ([locationManager respondsToSelector:@selector(requestAlwaysAuthorization)]) {
        [locationManager requestAlwaysAuthorization];
    }
}

-(void) startUpdating {
    [locationManager startUpdatingLocation];
}

-(void) stopUpdating {
    [locationManager stopUpdatingLocation];
}

-(void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations {
    if ([self.delegate respondsToSelector:@selector(didUpdateLocations:)]){
        [self.delegate didUpdateLocations:[locations lastObject]];
    }
}

-(void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error {
    [self.delegate didFailWithError:error];
}

-(void) getAddressFromCLLocation:(CLLocation*)location {
    CLGeocoder *geocoder = [[CLGeocoder alloc] init];
    __block NSString *response = nil;

    CLGeocodeCompletionHandler handler = ^(NSArray *placemarks, NSError *error) {
        NSLog(@"Finding address");
        if (error) {
            NSLog(@"Error %@", error.description);
        } else {
            CLPlacemark *placemark = [placemarks lastObject];
            response = [NSString stringWithFormat:@"%@", ABCreateStringWithAddressDictionary(placemark.addressDictionary, NO)];
            [self.delegate didRecieveAddress:response];
        }
    };

    [geocoder reverseGeocodeLocation:location completionHandler: handler];
}

@end
