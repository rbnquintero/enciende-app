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

NSMutableArray* locations;

RCT_EXPORT_MODULE();

#pragma mark - Public API

RCT_EXPORT_METHOD(beginReportingLocation:(NSString*) grupo usuario:(NSString*) usuario) {
  NSUserDefaults* sud = [NSUserDefaults standardUserDefaults];
  locations = [sud mutableArrayValueForKey:@"locations"];
  if(locations == nil) {
    locations = [[NSMutableArray alloc] init];
  }
  
  grupoId = grupo;
  usuarioId = usuario;
  
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
  NSDateFormatter *dateFormatter = [[NSDateFormatter alloc]init];
  [dateFormatter setDateFormat:@"yyyy-MM-dd'T'HH:mm:ss.SSSZ"];
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
  
  CompletitionHandler = ^(NSURLResponse *response, NSData *data, NSError *connectionError) {
    if (connectionError == nil || data != nil) {
      NSDictionary *res = [NSJSONSerialization JSONObjectWithData:data options:0 error:NULL];
      if(res != nil) {
        locations = [[NSMutableArray alloc] init];
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

- (void)didRecieveAddress:(NSString *)address {
  // VOID
}

- (void)didFailWithError:(NSError *)error {
  NSLog(@"Ocurrió un error: %@", error.localizedDescription);
}



@end
