// @flow
"use strict";
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  FlatList,
  Animated,
  ScrollView
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  statusBarHeight,
  headerHeight,
  SafeAreaWithHeader
} from "./DimensionsHelper";

const vw: number = SafeAreaWithHeader.vw;
const vh: number = SafeAreaWithHeader.vh;

class ViewWithTitle extends Component {
  props: {
    title: string,
    children: any,
    data: Array<Object>,
    renderItem: () => mixed,
    renderLeft: () => mixed,
    renderRight: () => mixed,
    style: Object,
    iOSBigTitleStyles: Object,
    titleStyles: Object,
    scrollViewProps: Object
  };

  state: {
    scrollY: Animated.Value
  } = {
    scrollY: new Animated.Value(0)
  };

  headerHeight: number = statusBarHeight + headerHeight;

  renderTitle = () => {
    if (this.props.title) {
      if (Platform.OS === "ios") {
        let title = this.props.title;
        if (title.length > 34) {
          title = title.substr(0, 32) + "...";
        }
        let titleOpacity = this.state.scrollY.interpolate({
          inputRange: [0, 41, 48],
          outputRange: [0, 0, 1],
          extrapolate: "clamp"
        });
        return (
          <Animated.View
            style={[
              styles.iOSTitleContainer,
              {
                height: this.headerHeight,
                opacity: titleOpacity,
              }
            ]}
          >
            <Text style={[styles.iOSTitle, this.props.titleStyles]}>{title}</Text>
          </Animated.View>
        );
      } else {
        let title = this.props.title;
        if (title.length > 38) {
          title = title.substr(0, 36) + "...";
        }
        return (
          <View
            style={[
              styles.androidTitleContainer,
              { height: this.headerHeight }
            ]}
          >
            <Text style={[styles.androidTitle, this.props.titleStyles]}>{title}</Text>
          </View>
        );
      }
    }
  };

  renderIOSBigTitle = () => {
    if (Platform.OS === "ios" && this.props.title) {
      let title = this.props.title;
      if (title.length > 19) {
        title = title.substr(0, 17) + "...";
      }
      const fontSize = this.state.scrollY.interpolate({
        inputRange: [-50, 0],
        outputRange: [40, 34],
        extrapolate: "clamp"
      });
      const top = this.state.scrollY.interpolate({
        inputRange: [0, 70],
        outputRange: [0, -70]
      });

      return (
        <Animated.View
          style={[
            styles.iOSBigTitleContainer,
            { transform: [{ translateY: top }] }
          ]}
          key="iosBigTitle"
        >
          <Animated.Text
            allowFontScaling={false}
            style={[styles.iOSBigTitle, { fontSize: fontSize }, this.props.titleStyles, this.props.iOSBigTitleStyles]}
          >
            {title}
          </Animated.Text>
        </Animated.View>
      );
    }
  };

  renderContentArea = () => {
    if (this.props.children) {
      let padding = Platform.OS === "ios" && this.props.title ? 56 : 0;
      return (
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          style={[{ paddingTop: padding }, this.props.style]}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
          ])}
          enableOnAndroid
          {...this.props.scrollViewProps}
        >
          <View
            style={[
              styles.contentContainer,
              {
                paddingBottom: padding,
                minHeight: 100 * vh
              }
            ]}
          >
            {this.props.children}
          </View>
        </KeyboardAwareScrollView>
      );
    }
  };

  renderContentAreaList = () => {
    if (this.props.data && this.props.renderItem) {
      let headerHeight = Platform.OS === "ios" && this.props.title ? 56 : 0;
      return (
        <FlatList
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          renderItem={this.props.renderItem}
          ListHeaderComponent={
            <View style={{ width: 100 * vw, height: headerHeight }} />
          }
          data={this.props.data}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
          ])}
        />
      );
    }
  };

  renderTitleArea = () => {
    return (
      <View style={[styles.titleContainer, { height: this.headerHeight }]}>
        {this.renderTitle()}
      </View>
    );
  };

  render() {
    return (
      <View style={styles.outerContainer}>
        {this.renderIOSBigTitle()}
        {this.renderTitleArea()}
        {this.props.renderLeft && (
          <View style={[styles.leftContainer, this.props.leftContainerStyles]}>{this.props.renderLeft()}</View>
        )}
        <View style={[styles.innerContainer, { height: 100 * vh }]}>
          {this.renderContentArea()}
          {this.renderContentAreaList()}
        </View>
        {this.props.renderRight && (
          <View style={styles.rightContainer}>{this.props.renderRight()}</View>
        )}
      </View>
    );
  }
}

const styles: StyleSheet = StyleSheet.create({
  outerContainer: {
    width: 100 * vw,
    backgroundColor: "#ffffff"
  },
  titleContainer: {
    width: 100 * vw,
    backgroundColor: "#ffffff"
  },
  iOSTitleContainer: {
    width: 100 * vw,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  iOSTitleContainerInvisible: {
    width: 100 * vw,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  iOSTitle: {
    marginBottom: 13,
    fontSize: 17,
    lineHeight: 17,
    fontWeight: "bold",
    color: "#353535",
    backgroundColor: "rgba(0,0,0,0)"
  },
  androidTitleContainer: {
    width: 100 * vw,
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  androidTitleContainerInvisible: {
    width: 100 * vw,
    alignItems: "flex-start",
    justifyContent: "flex-end"
  },
  androidComponentContainer: {
    position: "absolute",
    right: 16,
    bottom: 0,
    width: 100 * vw - 32,
    alignItems: "flex-end",
    justifyContent: "center"
  },
  androidTitle: {
    marginBottom: 16,
    marginLeft: 72,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "bold",
    color: "#353535",
    backgroundColor: "rgba(0,0,0,0)"
  },
  iOSBigTitleContainer: {
    position: "absolute",
    top: headerHeight + statusBarHeight,
    left: 0,
    width: 100 * vw,
    height: 56,
    backgroundColor: "#ffffff",
  },
  iOSBigTitle: {
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 16,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "bold",
    color: "#353535",
    backgroundColor: "rgba(0,0,0,0)"
  },
  innerContainer: {
    position: "relative",
    width: 100 * vw
  },
  contentContainer: {
    width: 100 * vw,
    backgroundColor: "#fff",
    flex: 1
  },
  leftContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 30 : 19,
    left: 15
  },
  rightContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 30 : 19,
    right: 15
  }
});

module.exports = ViewWithTitle;
