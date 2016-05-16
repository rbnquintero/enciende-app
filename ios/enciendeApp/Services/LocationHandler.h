//
//  LocationHandler.h
//  ControllerTest
//
//  Created by Ruben Quintero on 9/4/15.
//  Copyright (c) 2015 Ruben Quintero. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>

@protocol LocationHandlerDelegate <NSObject>
@required
-(void)didUpdateLocations:(CLLocation*)location;
-(void)didFailWithError:(NSError *)error;
-(void)didRecieveAddress:(NSString *)address;
@end

@interface LocationHandler : NSObject<CLLocationManagerDelegate> {
    CLLocationManager *locationManager;
}
@property(nonatomic,strong) id<LocationHandlerDelegate> delegate;

+(id) getSharedInstance;
-(void) startUpdating;
-(void) stopUpdating;
-(void) getAddressFromCLLocation:(CLLocation*)location;

@end