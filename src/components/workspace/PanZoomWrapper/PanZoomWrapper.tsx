import { memo, useRef } from "react";
import { useDispatch } from "@/store/hooks";
import { toggleRerender } from "@/store/uiSlice";
import { ReactNode } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type PanZoomWrapperProps = {
  children: ReactNode;
};

const PanZoomWrapper: React.FC<PanZoomWrapperProps> = ({ children }) => {
  const dispatch = useDispatch();
  const rerender = () => dispatch(toggleRerender());

  const panZoomWrapperRef = useRef(null);

  return (
    <TransformWrapper
      ref={panZoomWrapperRef}
      limitToBounds={true}
      doubleClick={{ disabled: true }}
      minScale={0.1}
      maxScale={2}
      wheel={{ step: 0.1 }}
      initialPositionX={-4500}
      initialPositionY={-4500}
      panning={{
        excluded: [
          "module",
          "module-jack",
          "knob",
          "close-btn",
          "select",
          "option",
          "span",
          "button",
          "text-input",
          "input",
        ],
      }}
      onWheel={rerender}
      onPanning={rerender}
      onZoom={rerender}
      onPinching={rerender}
    >
      <TransformComponent
        wrapperStyle={{ maxWidth: "100%", maxHeight: "100%" }}
      >
        {children}
      </TransformComponent>
    </TransformWrapper>
  );
};

export default memo(PanZoomWrapper);
