import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'de.panbi.unicorn',
  appPath: 'src',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none'
  }
} as NativeScriptConfig;
