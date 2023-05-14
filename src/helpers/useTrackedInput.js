import { useState, useRef, useCallback, useEffect } from "react";

const useTrackedInput = () => {
  const [data, setData] = useState({
    initVal: undefined,
    curentVal: "",
    editEnabled: false,
  });
  const inputRef = useRef();
  useEffect(() => {
    if (data.editEnabled) {
      inputRef.current?.focus();
    }
  }, [data.editEnabled]);
  const handleChange = useCallback((e) => {
    setData((prev) => ({
      ...prev,
      curentVal: e.target.value,
    }));
  }, []);
  const setInitVal = useCallback((initVal) => {
    setData({
      initVal,
      curentVal: initVal,
      editEnabled: false,
    });
  }, []);
  const toggleEditState = useCallback(() => {
    setData((prev) => ({
      ...prev,
      curentVal: prev.initVal,
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
      value: data.curentVal,
      onIconClick: toggleEditState,
      icon: data.editEnabled ? "CloseIcon" : "EditIcon",
      ref: inputRef,
    },
    isChanged: () => data.editEnabled && data.curentVal !== data.initVal,
    setInitVal,
    reset,
  };
};

export default useTrackedInput;
