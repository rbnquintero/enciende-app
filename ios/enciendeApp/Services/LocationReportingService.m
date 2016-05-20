//
//  BackgroundTask.m
//  tomtrack
//
//  Created by Liam Edwards-Playne on 13/02/2016.
//

#import <Foundation/Foundation.h>

#import "LocationReportingService.h"

void (^CompletitionHandler)(NSURLResponse *response, NSData *data, NSError *connectionError);

@implementation LocationReportingService

NSString* grupoId = @"";
NSString* usuarioId = @"";
NSDate* fechalimite;

NSDateFormatter *dateFormatter;
NSMutableArray* locations;

RCT_EXPORT_MODULE();

#pragma mark - Public API

RCT_EXPORT_METHOD(beginReportingLocation:(NSString*) grupo usuario:(NSString*) usuario fechalimite:(NSString*)fecha) {
  dateFormatter = [[NSDateFormatter alloc]init];
  [dateFormatter setDateFormat:@"yyyy-MM-dd'T'HH:mm:ss.SSSZ"];
  
  NSUserDefaults* sud = [NSUserDefaults standardUserDefaults];
  locations = [sud mutableArrayValueForKey:@"locations"];
  if(locations == nil) {
    [self resetLocations];
  }
  
  grupoId = grupo;
  usuarioId = usuario;
  fechalimite = [dateFormatter dateFromString:fecha];
  
  dispatch_async(dispatch_get_main_queue(), ^{
    [[LocationHandler getSharedInstance] setDelegate:self];
    [[LocationHandler getSharedInstance] startUpdating];
  });
}

RCT_EXPORT_METHOD(stopReportingLocation) {
  [[LocationHandler getSharedInstance] stopUpdating];
}

RCT_EXPORT_METHOD(getLocations:(RCTResponseSenderBlock) callback) {
  callback(@[[NSNull null], locations]);
}

- (void)didUpdateLocations:(CLLocation *)location {
  NSDate *currDate = [NSDate date];
  NSString *dateString = [dateFormatter stringFromDate:currDate];
  
  NSDictionary* locationMap = [[NSDictionary alloc] initWithObjectsAndKeys:
                               [NSString stringWithFormat: @"%f", location.coordinate.latitude], @"latitud",
                               [NSString stringWithFormat: @"%f", location.coordinate.longitude], @"longitud",
                               [NSString stringWithFormat: @"%f", location.horizontalAccuracy], @"precision",
                               dateString, @"hora",
                               nil];
  [locations addObject:locationMap];
  NSDictionary* postData = [[NSDictionary alloc] initWithObjectsAndKeys:
                            grupoId, @"grupoId",
                            usuarioId, @"usuarioId",
                            locations, @"locations",
                            nil];
  NSError *error;
  NSData *postDataJSON = [NSJSONSerialization dataWithJSONObject:postData options:0 error:&error];
  
  NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL: [NSURL URLWithString:@"http://app-enciende.rhcloud.com/location/guardar"]];
  [request setHTTPMethod:@"POST"];
  [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
  [request setHTTPBody:postDataJSON];
  
  if([[[NSDate alloc]init] compare:fechalimite]>0) {
    [[LocationHandler getSharedInstance] stopUpdating];
  }
  
  CompletitionHandler = ^(NSURLResponse *response, NSData *data, NSError *connectionError) {
    if (connectionError == nil || data != nil) {
      NSDictionary *res = [NSJSONSerialization JSONObjectWithData:data options:0 error:NULL];
      if(res != nil) {
        if([res objectForKey:@"terminate"] != nil && [[NSNumber numberWithInt:1] isEqualToNumber: [res objectForKey:@"terminate"]]) {
          [self stopReceivingUpdates];
        }
        if([res objectForKey:@"success"] != nil && [[NSNumber numberWithInt:1] isEqualToNumber: [res objectForKey:@"success"]]) {
          [self resetLocations];
        }
      } else {
        NSLog(@"Error");
      }
    } else {
      NSLog(@"Error");
    }
  };
  
  [NSURLConnection sendAsynchronousRequest:request queue:[NSOperationQueue mainQueue] completionHandler:CompletitionHandler];
  
  NSUserDefaults* sud = [NSUserDefaults standardUserDefaults];
  [sud setObject:locations forKey:@"locations"];
  [sud synchronize];
}

- (void) stopReceivingUpdates {
  [[LocationHandler getSharedInstance] stopUpdating];
}

- (void) resetLocations {
  locations = [[NSMutableArray alloc] init];
}

- (void)didRecieveAddress:(NSString *)address {
  // VOID
}

- (void)didFailWithError:(NSError *)error {
  NSLog(@"Ocurrió un error: %@", error.localizedDescription);
}



@end
