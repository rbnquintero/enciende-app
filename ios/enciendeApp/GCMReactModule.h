//
//  GCMReactModule.h
//  enciendeApp
//
//  Created by Ruben Quintero on 5/12/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"

@protocol GCMDelegate <NSObject>
@required
-(void)subscribeToTopic:(NSString*)topic;
-(void)unsubscribeFromTopic:(NSString*)topic;
@end

@interface GCMReactModule : NSObject <RCTBridgeModule>
@property(nonatomic,strong) id<GCMDelegate> delegate;
@end
