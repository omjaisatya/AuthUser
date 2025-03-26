# React Native Google Authentication

[![React Native](https://img.shields.io/badge/React%20Native-0.78.1-blue)](https://reactnative.dev/)

⚠️ **Important Note**: This implementation currently supports **Google Sign-In only**. Apple Sign-In is not available in this version.

A React Native authentication implementation using Google Sign-In

## Limitations

🚧 **Current Restrictions**:

- No Apple Sign-In support
- iOS implementation provided but **not tested by maintainer**
- Focused on Android development environment
- No physical iOS device available for testing

## Features

- Google Sign-In integration
- Cross-platform support (iOS & Android)
- Profile display with user information

## Prerequisites

- Node.js (v16+)
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)
- Java Development Kit (JDK 11+)
- Google Developer account

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/omjaisatya/AuthUser.git
cd AuthUser
```

```bash
npm install
```

## Configuration

### iOS Specific Notes

1. The provided iOS configuration is based on standard documentation
2. Not verified on physical Apple devices
3. Apple Sign-In capabilities are **not configured** in this project
4. Use Xcode cloud services or community contributions for iOS testing

## Running the App

## Android

```bash
npx react-native run-android
```

## iOS

```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

## Troubleshooting

### Known Limitations

**Explicitly Unsupported**:

- Apple ID/Apple Sign-In functionality
- iOS-specific authentication issues
- Physical device iOS testing

### Common Issues

- **Apple-related Errors**: Not supported in current implementation
- **iOS Simulator Issues**: Untested by maintainer
- **Missing Apple Services**: Intentional exclusion from current scope

## Contributing

**Special Contribution Request**:

- Apple Sign-In implementation contributions welcome
- iOS testing improvements encouraged
- Physical device test reports appreciated
