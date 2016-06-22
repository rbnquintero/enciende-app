//
//  GCMReactModule.m
//  enciendeApp
//
//  Created by Ruben Quintero on 5/12/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "GCMReactModule.h"
#import "AppDelegate.h"

@implementation GCMReactModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(subscribeTopic: (NSString *)topic)
{
  NSLog(@"About to subscribe to %@", topic);
  AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  if ([delegate conformsToProtocol:@protocol(GCMDelegate)]) {
    NSLog(@"Valid delegate");
    NSObject<GCMDelegate> *gcm = (NSObject<GCMDelegate> *) delegate;
    [gcm subscribeToTopic: topic];
  }
}

RCT_EXPORT_METHOD(unsubscribeTopic: (NSString *)topic)
{
  NSLog(@"About to unsubscribe from %@", topic);
  AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  if ([delegate conformsToProtocol:@protocol(GCMDelegate)]) {
    NSLog(@"Valid delegate");
    NSObject<GCMDelegate> *gcm = (NSObject<GCMDelegate> *) delegate;
    [gcm unsubscribeFromTopic: topic];
  }
}

@end
