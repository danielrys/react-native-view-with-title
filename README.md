react-native-view-with-title
========================================================

Component for iOS-like headers in React Native. Compatible also with Android.

Installation
------------

```sh
$ yarn add anceque/react-native-view-with-title
```

Usage
-----

```javascript
import ViewWithTitle from 'react-native-view-with-title'

...
render() {
  <ViewWithTitle
    title="Screen title"
    style="add some styles here"
    renderLeft={() => (
      <YourComponentForBackButton
        onPress={() => this.props.navigation.goBack()}
      />
    )}
  >
    ...
  </ViewWithTitle>
}
```
