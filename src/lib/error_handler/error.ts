// lib/errors.ts
import { AxiosError } from "axios";
import { ZodError } from "zod";

export type NormalizedError = {
  message: string;
  code?: string | number;
  cause?: unknown;
};

export function isAxiosError(e: unknown): e is AxiosError<any> {
  return (
    typeof e === "object" && e !== null && (e as any).isAxiosError === true
  );
}

export function getErrorMessage(
  e: unknown,
  fallback = "Something went wrong. Try again."
): NormalizedError {
  // 1) Zod
  if (e instanceof ZodError) {
    return {
      message: e.issues?.[0]?.message ?? "Validation failed",
      code: "ZOD_ERROR",
      cause: e,
    };
  }

  // 2) Axios
  if (isAxiosError(e)) {
    const msg =
      e.response?.data?.message ??
      e.response?.data?.error ??
      e.message ??
      fallback;
    const code = e.response?.status ?? e.code;
    return { message: msg, code, cause: e };
  }

  // 3) Fetch/Response helpers (if you pass Response objects around)
  if (e instanceof Response) {
    return {
      message: `Request failed: ${e.status} ${e.statusText}`,
      code: e.status,
      cause: e,
    };
  }

  // 4) DOMException / Abort
  if (typeof DOMException !== "undefined" && e instanceof DOMException) {
    return { message: e.message || "Request aborted", code: e.name, cause: e };
  }

  // 5) Generic Error
  if (e instanceof Error) {
    return {
      message: e.message || fallback,
      code: (e as any).code,
      cause: e.cause,
    };
  }

  // 6) Unknown / string
  if (typeof e === "string") {
    return { message: e || fallback };
  }

  return { message: fallback, cause: e };
}
