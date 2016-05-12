//
//  GCMReactModule.m
//  enciendeApp
//
//  Created by Ruben Quintero on 5/12/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "GCMReactModule.h"

@implementation GCMReactModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(subscribeTopic: (NSString *)topic)
{
  [self.delegate subscribeTopic: topic];
}

RCT_EXPORT_METHOD(unsubscribeTopic: (NSString *)topic)
{
  [self.delegate unsubscribeTopic: topic];
}

@end
