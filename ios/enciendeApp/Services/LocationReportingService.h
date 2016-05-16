//
//  BackgroundTask.h
//  tomtrack
//
//  Created by Liam Edwards-Playne on 13/02/2016.
//

#import "RCTBridgeModule.h"

#import "LocationHandler.h"

@interface LocationReportingService : NSObject <RCTBridgeModule, LocationHandlerDelegate>

@end