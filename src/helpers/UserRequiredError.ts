import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

export const createUserRequiredError = () => {
  return { name: "UserRequired" };
};

export const isUserRequiredError = (
  error: FetchBaseQueryError | SerializedError | undefined
) => {
  if (error && "status" in error && error.status === "CUSTOM_ERROR") {
    return (
      error.data &&
      typeof error.data === "object" &&
      "name" in error.data &&
      error.data.name === "UserRequired"
    );
  }
};

export type FetchError = FetchBaseQueryError | SerializedError | undefined;

export const getErrorMessage = (error: FetchError): string => {
  if (error) {
    if ("status" in error && typeof error.status === "number") {
      const data = error.data as Record<string, string> | undefined;
      const msg = data && "message" in data ? ` - ${data.message}` : "";
      return `ошибка ${error.status}${msg}`;
    }
    if ("error" in error) {
      return error.error;
    }
    if ("message" in error && error.message) {
      return error.message;
    }
  }
  console.log("ERROR", error);
  return "Неизвестная ошибка";
};
