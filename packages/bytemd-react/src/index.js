var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { createElement, Component } from 'react';
import * as bytemd from 'bytemd';
var Viewer = /** @class */ (function (_super) {
    __extends(Viewer, _super);
    function Viewer(props) {
        var _this = _super.call(this, props) || this;
        _this.container = null;
        _this.setContainer = function (e) {
            _this.container = e;
        };
        return _this;
    }
    Viewer.prototype.componentDidMount = function () {
        new bytemd.Viewer({
            target: this.container,
            props: this.props
        });
    };
    Viewer.prototype.render = function () {
        return createElement('div', {
            ref: this.setContainer
        });
    };
    return Viewer;
}(Component));
export { Viewer };
var Editor = /** @class */ (function (_super) {
    __extends(Editor, _super);
    function Editor(props) {
        var _this = _super.call(this, props) || this;
        _this.container = null;
        _this.setContainer = function (e) {
            _this.container = e;
        };
        return _this;
    }
    Editor.prototype.componentDidMount = function () {
        new bytemd.Viewer({
            target: this.container,
            props: this.props
        });
    };
    Editor.prototype.render = function () {
        return createElement('div', {
            ref: this.setContainer
        });
    };
    return Editor;
}(Component));
export { Editor };
