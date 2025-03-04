import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDropzone, Accept } from "react-dropzone";
import Image from "next/image";

interface DeliveriesType {
  title: string;
  icon: string;
}

interface AmenitiesList {
  title: string;
  icon: string;
}

interface PackageAmenities {
  amenitiesTitle: string;
  bgColor: string;
  amenitiesList: AmenitiesList[];
}

interface MaternityPackage {
  packageName: string;
  imageUrl: string;
  packagePrice: string;
  videoPreview: string;
  packageThumbnails: string[];
  deliveriesType: DeliveriesType[];
  packageAmenities: PackageAmenities[];
}

export function MaternityPackages() {
  const [packages, setPackages] = useState<MaternityPackage[]>([
    {
      packageName: "",
      imageUrl: "",
      packagePrice: "",
      videoPreview: "",
      packageThumbnails: [],
      deliveriesType: [],
      packageAmenities: [],
    },
  ]);

  const handleChange = (
    index: number,
    field: keyof MaternityPackage,
    value: string
  ) => {
    const updatedPackages = [...packages];
    updatedPackages[index][field] = value as never;
    setPackages(updatedPackages);
  };

  const addDeliveryType = (index: number) => {
    const updatedPackages = [...packages];
    updatedPackages[index].deliveriesType.push({ title: "", icon: "" });
    setPackages(updatedPackages);
  };

  const addAmenities = (index: number) => {
    const updatedPackages = [...packages];
    updatedPackages[index].packageAmenities.push({
      amenitiesTitle: "",
      bgColor: "",
      amenitiesList: [],
    });
    setPackages(updatedPackages);
  };

  const addAmenitiesList = (pkgIndex: number, amenitiesIndex: number) => {
    const updatedPackages = [...packages];
    updatedPackages[pkgIndex].packageAmenities[
      amenitiesIndex
    ].amenitiesList.push({ title: "", icon: "" });
    setPackages(updatedPackages);
  };

  const handleSubmit = () => {
    console.log("Submitting:", packages);
  };

  return (
    <div className="px-10 py-4 space-y-6 relative min-h-screen">
      <h1 className="text-2xl font-bold">Add Your Maternity Packages</h1>
      {packages.map((pkg, index) => (
        <div className="flex flex-col gap-5 mt-10" key={index}>
          <Card className="px-6 py-10 grid-cols-3 grid">
            <div className="flex flex-col gap-10">
              <Input
                placeholder="Package Name"
                value={pkg.packageName}
                onChange={(e) =>
                  handleChange(index, "packageName", e.target.value)
                }
              />
              <Input
                placeholder="Price"
                value={pkg.packagePrice}
                onChange={(e) =>
                  handleChange(index, "packagePrice", e.target.value)
                }
              />
            </div>

            <div className="flex flex-col gap-10">
              <Dropzone
                onDrop={(files) => {
                  const imageUrl = URL.createObjectURL(files[0]);
                  handleChange(index, "imageUrl", imageUrl);
                }}
                multiple={false}
                accept={{ "image/*": [] }}
                label="Drag & drop an image or click to select"
              />
              {pkg.imageUrl && (
                <Image
                  src={pkg.imageUrl}
                  alt="Preview"
                  width={300}
                  height={200}
                  unoptimized
                  className="rounded-md"
                />
              )}
              <Dropzone
                onDrop={(files) => {
                  const videoPreview = URL.createObjectURL(files[0]);
                  handleChange(index, "videoPreview", videoPreview);
                }}
                accept={{ "video/*": [] }}
                multiple={false}
                label="Drag & drop a video or click to select"
              />
              {pkg.videoPreview && (
                <video controls className="w-full h-40 rounded-md">
                  <source src={pkg.videoPreview} type="video/mp4" />
                </video>
              )}
            </div>

            {/* Multiple Image Upload (Thumbnails) */}
            <Dropzone
              onDrop={(files) => {
                const thumbnails = files.map((file) =>
                  URL.createObjectURL(file)
                );
                const updatedPackages = [...packages];
                updatedPackages[index].packageThumbnails = thumbnails;
                setPackages(updatedPackages);
              }}
              accept={{ "image/*": [] }}
              multiple
              label="Drag & drop multiple images for thumbnails"
            />
            <div className="flex flex-wrap gap-2">
              {pkg.packageThumbnails.map((thumb, tIndex) => (
                <Image
                  key={tIndex}
                  src={thumb}
                  alt="Thumbnail"
                  width={80}
                  height={80}
                  unoptimized
                  className="rounded-md"
                />
              ))}
            </div>
          </Card>

          <Card className="px-6 py-10 grid-cols-1 grid">
            <div className="space-y-2 border p-4 rounded-lg">
              <h2 className="text-lg font-semibold">Delivery Types</h2>
              {pkg.deliveriesType.map((delivery, dIndex) => (
                <div key={dIndex} className="grid grid-cols-2 gap-10 my-5 border p-4 rounded-lg">
                  <Input
                    placeholder="Delivery Title"
                    value={delivery.title}
                    onChange={(e) => {
                      const updatedPackages = [...packages];
                      updatedPackages[index].deliveriesType[dIndex].title =
                        e.target.value;
                      setPackages(updatedPackages);
                    }}
                  />

                  {delivery.icon ? (
                    <div className="shadow bg-white min-h-[200px] max-w-[200px] min-w-[200px] max-h-[200px] border rounded-lg ">
                      <Image
                        src={delivery.icon}
                        alt="Preview"
                        width={200}
                        height={200}
                        unoptimized
                        className="rounded-md"
                      />
                    </div>
                  ) : (
                    <Dropzone
                      onDrop={(files) => {
                        const iconUrl = URL.createObjectURL(files[0]);
                        const updatedPackages = [...packages];
                        updatedPackages[index].deliveriesType[dIndex].icon =
                          iconUrl;
                        setPackages(updatedPackages);
                      }}
                      multiple={false}
                      accept={{ "image/*": [] }}
                      label="Drag & drop an image or click to select"
                    />
                  )}
                </div>
              ))}
              <Button onClick={() => addDeliveryType(index)}>
                + Add Delivery Type
              </Button>
            </div>

            <div className="space-y-2 border p-4 rounded-lg">
              <h2 className="text-lg font-semibold">Amenities</h2>
              <div className="flex flex-col gap-8">
                {pkg.packageAmenities.map((amenities, aIndex) => (
                  <div key={aIndex} className="p-4 border rounded-lg">
                    <Input
                      placeholder="Amenities Title"
                      value={amenities.amenitiesTitle}
                      onChange={(e) => {
                        const updatedPackages = [...packages];
                        updatedPackages[index].packageAmenities[
                          aIndex
                        ].amenitiesTitle = e.target.value;
                        setPackages(updatedPackages);
                      }}
                    />
                    <Button
                      onClick={() => addAmenitiesList(index, aIndex)}
                      className="my-3"
                    >
                      + Add Amenities List
                    </Button>
                    {amenities.amenitiesList.map((list, lIndex) => (
                      <div
                        key={lIndex}
                        className="grid grid-cols-2 gap-10 mt-5"
                      >
                        <Input
                          placeholder="List Item"
                          value={list.title}
                          onChange={(e) => {
                            const updatedPackages = [...packages];
                            updatedPackages[index].packageAmenities[
                              aIndex
                            ].amenitiesList[lIndex].title = e.target.value;
                            setPackages(updatedPackages);
                          }}
                        />
                        {list.icon ? (
                          <div className="shadow bg-red-50 min-h-[200px] max-h-[200px] border rounded-lg ">
                            <Image
                              src={list.icon}
                              alt="Preview"
                              width={200}
                              height={200}
                              unoptimized
                              className="rounded-md"
                            />
                          </div>
                        ) : (
                          <Dropzone
                            onDrop={(files) => {
                              const iconUrl = URL.createObjectURL(files[0]);
                              const updatedPackages = [...packages];
                              updatedPackages[index].packageAmenities[
                                aIndex
                              ].amenitiesList[lIndex].icon = iconUrl;
                              setPackages(updatedPackages);
                            }}
                            multiple={false}
                            accept={{ "image/*": [] }}
                            label="Drag & drop an image or click to select"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <Button onClick={() => addAmenities(index)}>
                + Add Amenities
              </Button>
            </div>
          </Card>
        </div>
      ))}
      <Button className="w-fit absolute top-4 right-10" onClick={handleSubmit}>
        Submit Package
      </Button>
    </div>
  );
}

function Dropzone({
  onDrop,
  accept,
  multiple = false,
  label,
}: {
  onDrop: (files: File[]) => void;
  accept: Accept;
  multiple?: boolean;
  label: string;
}) {
  const { getRootProps, getInputProps } = useDropzone({
    accept,
    multiple,
    onDrop: (acceptedFiles) => onDrop(acceptedFiles),
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed p-4 text-center cursor-pointer rounded-md"
    >
      <input {...getInputProps()} />
      <p>{label}</p>
    </div>
  );
}
