import { useState, useRef, useCallback, useEffect, ChangeEvent } from "react";

type TrackedData = {
  initVal: string | undefined;
  currentVal: string;
  editEnabled: boolean;
};

const useTrackedInput = () => {
  const [data, setData] = useState<TrackedData>({
    initVal: undefined,
    currentVal: "",
    editEnabled: false,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (data.editEnabled) {
      inputRef.current?.focus();
    }
  }, [data.editEnabled]);
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({
      ...prev,
      currentVal: e.target.value,
    }));
  }, []);
  const setInitVal = useCallback((initVal: string) => {
    setData({
      initVal,
      currentVal: initVal,
      editEnabled: false,
    });
  }, []);
  const toggleEditState = useCallback(() => {
    setData((prev) => ({
      ...prev,
      currentVal: prev.initVal ?? "",
      editEnabled: !prev.editEnabled,
    }));
  }, []);
  const reset = useCallback(() => {
    setData((prev) => ({
      ...prev,
      curentVal: prev.initVal,
      editEnabled: false,
    }));
  }, []);
  return {
    props: {
      disabled: !data.editEnabled,
      onChange: handleChange,
      value: data.currentVal,
      onIconClick: toggleEditState,
      icon: data.editEnabled ? "CloseIcon" : "EditIcon",
      ref: inputRef,
    },
    isChanged: () => data.editEnabled && data.currentVal !== data.initVal,
    setInitVal,
    reset,
  };
};

export default useTrackedInput;
