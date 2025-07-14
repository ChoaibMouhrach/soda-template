import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class CustomError extends Error {
  //
}

export async function onError<T>(
  response: Promise<
    | { data: T; error: null }
    | { data: null; error: { status: unknown; value: unknown } }
  >,
): Promise<T> {
  const r = await response;

  if (!r.error) {
    return r.data;
  }

  if (r.error.status === 422) {
    throw new CustomError("Something went wrong");
  }

  const errorValue = r.error.value;
  const isValidErrorObject =
    errorValue &&
    typeof errorValue === "object" &&
    errorValue !== null &&
    "error" in errorValue;

  if (isValidErrorObject && typeof errorValue.error === "string") {
    const error = new CustomError(errorValue.error);

    if ("code" in errorValue && typeof errorValue.code === "string") {
      error.name = errorValue.code;
    }

    throw error;
  }

  throw new CustomError(`API call failed with status ${r.error.status}`);
}
