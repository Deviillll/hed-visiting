import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button'; // Or your custom styled button

export default function CloudUploadField({ onUpload }: { onUpload: (url: string) => void }) {
  return (
    <CldUploadWidget
      uploadPreset="food_app"
      onUpload={(result: any) => {
        const url = result.info.secure_url;
        onUpload(url);
      }}
    >
      {({ open }) => (
        <Button type="button" onClick={() => open()}>
          Upload Logo
        </Button>
      )}
    </CldUploadWidget>
  );
}
