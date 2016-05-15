/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import <UIKit/UIKit.h>

#import <Google/CloudMessaging.h>
#import "GCMReactModule.h"

@interface AppDelegate : UIResponder <UIApplicationDelegate, GGLInstanceIDDelegate, GCMReceiverDelegate, GCMDelegate>

@property (nonatomic, strong) UIWindow *window;

//GCM
@property(nonatomic, readonly, strong) NSString *registrationKey;
@property(nonatomic, readonly, strong) NSString *messageKey;
@property(nonatomic, readonly, strong) NSString *gcmSenderID;
@property(nonatomic, readonly, strong) NSDictionary *registrationOptions;
//\GCM

@end
