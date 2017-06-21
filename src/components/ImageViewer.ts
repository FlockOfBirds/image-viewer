import { Component, DOM, createElement } from "react";

import * as classNames from "classnames";
import * as Lightbox from "react-image-lightbox";
import { Units, onClickOptions } from "./ImageViewerContainer";
import objectFitImages = require("object-fit-images");

import "../ui/ImageViewer.css";

interface ImageViewerProps {
    imageUrl: string;
    height: number;
    heightUnit: Units;
    width: number;
    widthUnit: Units;
    className?: string;
    style?: object;
    responsive: boolean;
    onClickOption?: onClickOptions;
}

interface ImageViewerState {
    isOpen: boolean;
}

class ImageViewer extends Component<ImageViewerProps, ImageViewerState> {
    private image: HTMLImageElement;

    constructor(props: ImageViewerProps) {
        super(props);

        this.state = {
            isOpen: false
        };
        this.toggleLightBox = this.toggleLightBox.bind(this);
    }

    render() {
        const imageStyle = {
            height: this.getStyle(this.props.height, this.props.heightUnit, true),
            width: this.getStyle(this.props.width, this.props.widthUnit, true)
        };

        return DOM.div({
                className: classNames(
                    "widget-image-viewer",
                    { "widget-image-viewer-responsive": this.props.responsive },
                    this.props.className,
                    { hidden: !this.props.imageUrl }
                ),
                style: {
                    ...this.props.style,
                    height: this.getStyle(this.props.height, this.props.heightUnit),
                    width: this.getStyle(this.props.width, this.props.widthUnit)
                }
            },
            DOM.img({
                onClick: this.toggleLightBox,
                ref: node => this.image = node,
                src: this.props.imageUrl,
                style: imageStyle
            }),
            this.state.isOpen && createElement(Lightbox, {
                mainSrc: this.props.imageUrl,
                onCloseRequest: this.toggleLightBox
            })
        );
    }

    componentDidMount() {
        objectFitImages(this.image, { watchMQ: true });
    }

    componentDidUpdate() {
        // update fails.
        // https://github.com/bfred-it/object-fit-images/issues/85
        // else write own little polyfill based on https://github.com/tonipinel/object-fit-polyfill
        objectFitImages(this.image, { watchMQ: true });
    }

    private toggleLightBox() {
        if (this.props.onClickOption === "openFullScreen") {
            this.setState({
                isOpen: !this.state.isOpen
            });
        }
    }

    private getStyle(value: string | number, type: string, isInner?: boolean): number | string {
        if (type === "pixels") {
            return value + "px";
        }
        if (isInner && type === "percentage") {
            return "100%";
        }
        if (type === "percentage") {
            return value + "%";
        }

        return "";
    }
}

export { ImageViewer, ImageViewerProps, ImageViewerState };
