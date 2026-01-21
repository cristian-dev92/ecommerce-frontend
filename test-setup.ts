import 'zone.js';
import 'zone.js/testing';

import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Initialize the Angular testing environment for TestBed
TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

// Optionally resolve resources if any component uses templateUrl/styleUrls
// No-op: TestBed.resolveComponentResources is not required explicitly here.
