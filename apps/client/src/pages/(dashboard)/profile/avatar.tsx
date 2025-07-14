import { CustomInput } from "@/components/custom/custom-input";
import { env } from "@/lib/env";
import { useRef } from "react";

interface AvatarInputProps {
  setValue: (value: File | null) => void;
  value: File | null;
  firstName: string;
  lastName: string;
  defaultValue?: string | null;
}

export const AvatarInput: React.FC<AvatarInputProps> = ({
  defaultValue,
  setValue,
  firstName,
  lastName,
  value,
}) => {
  const avatarRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex items-center gap-3">
      <div className="w-18 aspect-square bg-muted border rounded-full overflow-hidden relative">
        {(value || defaultValue) && (
          <img
            src={
              value
                ? URL.createObjectURL(value).toString()
                : defaultValue
                  ? `${env.VITE_STORAGE_URL}/${defaultValue}`
                  : ""
            }
            alt="profile photo"
            className="h-full w-full object-cover absolute top-0 left-0"
          />
        )}
      </div>
      <div className="flex flex-col items-start">
        <span className="text-lg">
          {firstName} {lastName}
        </span>
        <button
          type="button"
          className="text-primary cursor-pointer"
          onClick={() => avatarRef.current?.click()}
        >
          Change Avatar
        </button>
      </div>
      <CustomInput
        type="file"
        accept=".png"
        ref={avatarRef}
        className="hidden"
        onChange={(e) => setValue(e.target.files?.item(0) || null)}
      />
    </div>
  );
};
