"use client";
import axios from "@/utils/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";

import uploadImageToCloudinary from "@/utils/fileUpload";

export const instituteSchema = z.object({
  name: z.string().min(3, { message: "Name should be at least 3 characters" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" })
    .max(100, { message: "Address can be maximum 100 characters" }),
  contact: z
    .string()
    .min(5, { message: "Contact must be at least 5 characters" })
    .max(15, { message: "Contact can be maximum 15 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  logo: z.string().optional(),
  website: z
    .string()
    // .min(3, { message: "Website must be at least 3 characters" })
    .optional(),
  description: z
    .string()
    // .min(5, { message: "Description must be at least 5 characters" })
    // .max(200, { message: "Description can be maximum 200 characters" })
    .optional(),
});

type InstituteFormValues = z.infer<typeof instituteSchema>;

export function InstituteForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [logoError, setLogoError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<InstituteFormValues>({
    resolver: zodResolver(instituteSchema),
    defaultValues: {
      email: "",
      address: "",
      name: "",
      contact: "",
      logo: "",
      website: "",
      description: "",
    },
    //reValidateMode: "onChange",
  });

  const onSubmit = async (data: InstituteFormValues) => {
    setIsLoading(true);
    try {
      // Upload logo only if a file was selected
      console.log(selectedFile);
      if (selectedFile) {
        const logoUrl = await uploadImageToCloudinary(selectedFile);
        setValue("logo", logoUrl);

        data.logo = logoUrl;
      } else {
        throw new Error("Logo file is required");
      }

      const res = await axios.post("/institute", data);

      if (res.data.success && res.data.statusCode === 201) {
        toast.success("Profile created successfully", {
          description: res.data.message,
          position: "top-right",
          duration: 4000,
        });
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.log(error);
      toast.error("An error occurred", {
        description: data.logo
          ? error.response?.data?.message
          : error.message || "Please try again later",
      });
    } finally {
      setIsLoading(false);
      setLogoError("");
    }
  };

  return (
    <div className="p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full mx-auto"
      >
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Organization Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-x-6 gap-y-3 lg:w-[70%] mx-auto"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="john doe"
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                placeholder="New York, USA"
                {...register("address")}
                className={errors.address ? "border-destructive" : ""}
              />
              {errors.address && (
                <p className="text-sm text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact *</Label>
              <Input
                id="contact"
                placeholder="+1 234 567 890"
                {...register("contact")}
                className={errors.contact ? "border-destructive" : ""}
              />
              {errors.contact && (
                <p className="text-sm text-destructive">
                  {errors.contact.message}
                </p>
              )}
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="About your organization"
                {...register("description")}
                className={`h-20 ${
                  errors.description ? "border-destructive" : ""
                }`}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://example.com"
                {...register("website")}
                className={errors.website ? "border-destructive" : ""}
              />
              {errors.website && (
                <p className="text-sm text-destructive">
                  {errors.website.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Logo *</Label>
              <Input
                className={errors.logo ? "border-destructive" : ""}
                id="logo"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />

              {selectedFile && (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="h-10 w-10 mt-2 rounded"
                />
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> creating....
                </>
              ) : (
                "Create Organization"
              )}
            </Button>
          </form>
        </CardContent>
      </motion.div>
    </div>
  );
}
