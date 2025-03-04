import { Accept, useDropzone } from "react-dropzone";

type DropzoneProps = {
  onDrop: (files: File[]) => void;
  accept: Accept;
  multiple?: boolean;
  label: string;
  isPadding?: boolean;
};

const Dropzone: React.FC<DropzoneProps> = ({
  onDrop,
  accept,
  multiple = false,
  label,
  isPadding = true,
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept,
    multiple,
    onDrop: (acceptedFiles) => onDrop(acceptedFiles),
  });

  const padding = isPadding ? "p-4" : "p-[6px]";

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed ${padding} text-center cursor-pointer rounded-md`}
    >
      <input {...getInputProps()} />
      <p>{label}</p>
    </div>
  );
};

export default Dropzone;
