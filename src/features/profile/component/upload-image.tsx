"use client";

import React, { memo, useState } from "react";
import { Edit, Loader2, Upload, X } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { updateProfile } from "@/redux/slices/user/user-slice";
import { Div, H1, Para, Span } from "@/components/ui/tags";
import { useUserInfo } from "@/helpers/use-user";
import { useUpdateAvatar } from "../hooks/mutations";
import { useAppDispatch } from "@/redux/hook";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error_handler/error";
import { FormattedMessage } from "react-intl";

const UploadAvatar = () => {
  const { user } = useUserInfo();
  const disptach = useAppDispatch();
  const updateAvatar = useUpdateAvatar();

  const [isEditAvatar, setIsEditAvatar] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  if (!user) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    setSelectedFile(file);
    setIsEditAvatar(false);

    await updateAvatar.mutateAsync(
      { avatar: file, id: user?.id || "" },
      {
        onSuccess: (data) => {
          disptach(updateProfile(data?.data));
          setUploading(false);
          toast.success(data.message || "Avatar updated successfully!");
        },
        onError: (error) => {
          setUploading(false);
          const { message } = getErrorMessage(
            error,
            "Failed to update avatar."
          );
          toast.error(message);
        },
        onSettled: () => {
          setSelectedFile(null);
          setUploading(false);
        },
      }
    );
  };
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Div className="flex items-center gap-32">
      <Div>
        <H1 className="text-xl">
          <FormattedMessage
            defaultMessage={"Profile Picture"}
            id="profile.avatar.title"
          />
        </H1>
        <Para className="text-xs text-gray-500">
          <FormattedMessage
            defaultMessage={"Profile Picture"}
            id="profile.avatar.profile_picture_desc"
          />
        </Para>
      </Div>
      {!isEditAvatar && (
        <Avatar className="h-25 w-25 flex items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 to-rose-500">
          <Div className=" absolute top-0 right-0 p-4 cursor-pointer">
            <Edit
              className="text-white"
              size={15}
              onClick={() => setIsEditAvatar((p) => !p)}
            />
          </Div>
          {uploading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <AvatarImage
              src={
                selectedFile
                  ? URL.createObjectURL(selectedFile)
                  : user.avatar_url
              }
              alt={user.firstName}
            />
          )}
          <AvatarFallback className="text-4xl text-white">
            {!selectedFile ? user?.firstName.slice(0, 1) : ""}
          </AvatarFallback>
        </Avatar>
      )}
      {isEditAvatar && (
        <Avatar className="h-25 w-25 flex flex-col space-y-1 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 relative">
          <Div className="absolute top-0 right-0 m-4 cursor-pointer">
            <X
              className="text-white"
              size={15}
              onClick={() => setIsEditAvatar((p) => !p)}
            />
          </Div>

          {/* Trigger upload on click */}
          <button
            className="flex flex-col text-white items-center justify-center cursor-pointer"
            onClick={handleUploadClick}
          >
            <Upload size={18} />
            <Span className="text-xs ">
              <FormattedMessage
                defaultMessage={"Upload"}
                id="profile.avatar.upload"
              />
            </Span>
          </button>

          {/* Hidden input */}
          <input
            ref={fileInputRef}
            disabled={!isEditAvatar || uploading}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </Avatar>
      )}
    </Div>
  );
};

export default memo(UploadAvatar);
