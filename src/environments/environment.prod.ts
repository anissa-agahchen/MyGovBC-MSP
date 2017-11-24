// var NODE_ENV = process.env.NODE_ENV || 

export const environment = {
    appConstants: {
        runtimeEnv: "production", // run-time env. by default same as build-time node env
        coreApiBaseUrl: 'http://localhost:9000/api',
        serviceName: 'Apply for BC Health Care',
        logBaseUrl: '/msp/api/logging',
        apiBaseUrl: '/msp/api',
        // apiBaseUrl: 'https://mygovbc-msp-dev.pathfinder.gov.bc.ca/api',
        captchaApiBaseUrl: '/msp/api/captcha',
        addressChangeBCUrl: 'https://www.addresschange.gov.bc.ca/',
        images: {
          maxImagesPerPerson: 50,
          maxWidth: 2600,
          maxHeight: 3300,
          minWidth: 0,
          minHeight: 0,
          maxSizeBytes: 1048576,
          reductionScaleFactor: 0.8,
          acceptMimeType: "image/*",
          convertToMimeType: "image/jpeg",
          jpegQuality: 0.5
        },
        // general state of the app, if unavailable, display Unavailable message and don't continue
        mspIsInMaintenanceFlag: process.env.mspIsInMaintenanceFlag,
        mspIsInMaintenanceText: process.env.mspIsInMaintenanceText,
        mspIsInMaintenanceTimes: process.env.mspIsInMaintenanceTimes,

        //At runtime, assistSDKUrl will be set to be either the internal or external URL.
        assistSDKUrl: null, 
        assistSDKExternalUrl: 'https://video-poc1.maximusbc.ca',
        assistPath: '/assistserver/sdk/web/consumer/assist.js',
        // Only accessible via intranet.
        assistSDKInternalUrl: 'https://video-poc1.maximusbc.ca:8443'
      }
}