/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDropzone, Accept } from "react-dropzone";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import ThumbnailSlider from "./thumbnail-sliders";

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

  //ADD
  const handleImageChange = (
    index: number,
    field: keyof MaternityPackage,
    file: File
  ) => {
    const updatedPackages = [...packages];
    updatedPackages[index][field] = file as never;
    setPackages(updatedPackages);
  };

  const handleVideoChange = (
    index: number,
    field: keyof MaternityPackage,
    file: File
  ) => {
    const updatedPackages = [...packages];
    updatedPackages[index][field] = file as never;
    setPackages(updatedPackages);
  };

  const addDeliveryType = (index: number) => {
    setPackages((prevPackages) =>
      prevPackages.map((pkg, pkgIndex) =>
        pkgIndex === index
          ? {
              ...pkg,
              deliveriesType: [...pkg.deliveriesType, { title: "", icon: "" }],
            }
          : pkg
      )
    );
  };

  const deleteDeliveryType = (packageIndex: number, deliveryIndex: number) => {
    setPackages((prevPackages) =>
      prevPackages.map((pkg, pkgIndex) =>
        pkgIndex === packageIndex
          ? {
              ...pkg,
              deliveriesType: pkg.deliveriesType.filter(
                (_, index) => index !== deliveryIndex
              ),
            }
          : pkg
      )
    );
  };

  const addAmenities = (index: number) => {
    setPackages((prevPackages) =>
      prevPackages.map((pkg, pkgIndex) =>
        pkgIndex === index
          ? {
              ...pkg,
              packageAmenities: [
                ...pkg.packageAmenities,
                { amenitiesTitle: "", bgColor: "", amenitiesList: [] },
              ],
            }
          : pkg
      )
    );
  };

  const deleteAmenities = (packageIndex: number, amenitiesIndex: number) => {
    setPackages((prevPackages) =>
      prevPackages.map((pkg, pkgIndex) =>
        pkgIndex === packageIndex
          ? {
              ...pkg,
              packageAmenities: pkg.packageAmenities.filter(
                (_, index) => index !== amenitiesIndex
              ),
            }
          : pkg
      )
    );
  };

  const addAmenitiesList = (pkgIndex: number, amenitiesIndex: number) => {
    setPackages((prevPackages) =>
      prevPackages.map((pkg, packageIdx) =>
        packageIdx === pkgIndex
          ? {
              ...pkg,
              packageAmenities: pkg.packageAmenities.map(
                (amenity, amenityIdx) =>
                  amenityIdx === amenitiesIndex
                    ? {
                        ...amenity,
                        amenitiesList: [
                          ...amenity.amenitiesList,
                          { title: "", icon: "" },
                        ],
                      }
                    : amenity
              ),
            }
          : pkg
      )
    );
  };

  const deleteAmenitiesList = (
    packageIndex: number,
    amenitiesIndex: number,
    listIndex: number
  ) => {
    setPackages((prevPackages) =>
      prevPackages.map((pkg, pkgIdx) =>
        pkgIdx === packageIndex
          ? {
              ...pkg,
              packageAmenities: pkg.packageAmenities.map(
                (amenity, amenityIdx) =>
                  amenityIdx === amenitiesIndex
                    ? {
                        ...amenity,
                        amenitiesList: amenity.amenitiesList.filter(
                          (_, idx) => idx !== listIndex
                        ),
                      }
                    : amenity
              ),
            }
          : pkg
      )
    );
  };

  const addThumbnail = (index: number, files: File[]) => {
    setPackages((prevPackages) => {
      return prevPackages.map((pkg, pkgIndex) =>
        pkgIndex === index
          ? {
              ...pkg,
              packageThumbnails: [
                ...pkg.packageThumbnails,
                ...files.map((file) => URL.createObjectURL(file)),
              ],
            }
          : pkg
      );
    });
  };

  const removeThumbnail = (packageIndex: number, thumbnailIndex: number) => {
    setPackages((prevPackages) =>
      prevPackages.map((pkg, pkgIndex) =>
        pkgIndex === packageIndex
          ? {
              ...pkg,
              packageThumbnails: pkg.packageThumbnails.filter(
                (_, tIndex) => tIndex !== thumbnailIndex
              ),
            }
          : pkg
      )
    );
  };

  // In your file upload handler
  const handleFileUpload = async (
    packages: MaternityPackage[],
    formData: FormData
  ) => {
    const fileUploadPromises = packages.map(async (pkg, pkgIndex) => {
      const processFile = async (file: any, fieldName: string) => {
        if (!file) return;
  
        let processedFile: File | null = null;
  
        if (typeof file === "string" && file.startsWith("blob:")) {
          try {
            const response = await fetch(file);
            const blob = await response.blob();
            processedFile = new File([blob], `${fieldName}_${pkgIndex}.jpg`, {
              type: blob.type,
            });
          } catch (error) {
            console.error(`Error converting blob for ${fieldName}:`, error);
            return;
          }
        }
        else if (file instanceof File) {
          processedFile = file;
        }
        else if (
          file &&
          typeof file === "object" &&
          "name" in file &&
          "type" in file
        ) {
          processedFile = file as File;
        }
        if (processedFile) {
          // Modify this part to handle nested fields correctly
          const key = fieldName.includes('.')
            ? `files.maternityPackages.${pkgIndex}.${fieldName}`
            : `files.maternityPackages.${pkgIndex}.${fieldName}`;
          
          formData.append(key, processedFile);
        }
      };
  
      await Promise.all([
        processFile(pkg.imageUrl, "imageUrl"),
        processFile(pkg.videoPreview, "videoPreview"),
  
        // Thumbnails - use proper nested field
        ...(pkg.packageThumbnails || []).map((thumbnail, index) =>
          processFile(thumbnail, `packageThumbnails.${index}`)
        ),
  
        // Deliveries Type - use proper nested field
        ...(pkg.deliveriesType || []).map((delivery, index) =>
          processFile(delivery.icon, `deliveriesType.${index}.icon`)
        ),
  
        // Package Amenities - use proper nested field
        ...(pkg.packageAmenities || []).flatMap((amenity, amenityIndex) =>
          (amenity.amenitiesList || []).map((item, itemIndex) =>
            processFile(
              item.icon,
              `packageAmenities.${amenityIndex}.amenitiesList.${itemIndex}.icon`
            )
          )
        ),
      ]);
    });
  
    await Promise.all(fileUploadPromises);
  };

  const handleSubmit = async () => {
    try {
      // Create FormData instance
      const formData = new FormData();
  
      // Prepare the main data object with type safety
      const data = {
        facilityId: "7",
        facilityArea: "Scareelt",
        maternityPackages: packages.map((pkg: MaternityPackage) => ({
          packageName: pkg.packageName,
          packagePrice: pkg.packagePrice,
          imageUrl: pkg.imageUrl ? null : undefined,
          videoPreview: pkg.videoPreview ? null : undefined,
          packageThumbnails: pkg.packageThumbnails.length > 0 ? [] : undefined, // Keep this for API expectations
          deliveriesType: pkg.deliveriesType.map((delivery) => ({
            title: delivery.title,
            icon: delivery.icon ? null : undefined,
          })),
          packageAmenities: pkg.packageAmenities.map((amenity) => ({
            amenitiesTitle: amenity.amenitiesTitle,
            bgColor: amenity.bgColor,
            amenitiesList: amenity.amenitiesList.map((item) => ({
              title: item.title,
              icon: item.icon ? null : undefined,
            })),
          })),
        })),
      };
  
      // Append JSON data
      formData.append("data", JSON.stringify(data));
  
      // Call file upload handler
      await handleFileUpload(packages, formData);
  
      // Perform the upload
      const response = await fetch(
        "https://mh-dev-cms.oicharts.in/api/maternity-packages",
        {
          method: "POST",
          body: formData,
        }
      );
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error?.message || "Failed to submit package");
      }
  
      console.log("Success:", result);
      alert("Maternity package submitted successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit package. Please try again.");
    }
  };

  return (
    <div className="px-10 py-4 space-y-6 relative min-h-screen">
      <h1 className="text-2xl font-bold">Add Your Maternity Packages</h1>
      {packages.map((pkg, index) => (
        <div className="flex flex-col gap-5 mt-10" key={index}>
          <Card className="px-6 py-10 grid-cols-[1fr_1fr_2fr] grid">
            <div className="flex flex-col h-full gap-10">
              <Input
                placeholder="Package Name"
                value={pkg.packageName}
                onChange={(e) =>
                  handleChange(index, "packageName", e.target.value)
                }
                className="p-4 h-full"
              />
              <Input
                placeholder="Price"
                value={pkg.packagePrice}
                onChange={(e) =>
                  handleChange(index, "packagePrice", e.target.value)
                }
                className="p-4 h-full"
              />
            </div>

            <div className="flex flex-col gap-10">
              {pkg.imageUrl ? (
                <div className="shadow relative bg-white min-h-[100px] max-w-[150px] min-w-[150px] max-h-[100px] border rounded-lg ">
                  <Image
                    src={
                      typeof pkg.imageUrl === "string"
                        ? pkg.imageUrl
                        : URL.createObjectURL(pkg.imageUrl)
                    }
                    alt="Preview"
                    width={300}
                    height={200}
                    unoptimized
                    className="rounded-md w-full h-full object-contain"
                  />
                  <button
                    onClick={() => {
                      handleChange(index, "imageUrl", "");
                    }}
                    className="absolute cursor-pointer -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="font-medium text-sm mb-2">Image URL</h2>
                  <Dropzone
                    onDrop={(files) => {
                      handleImageChange(index, "imageUrl", files[0]);
                    }}
                    multiple={false}
                    accept={{ "image/*": [] }}
                    label="Drag & drop an image or click to select"
                  />
                </div>
              )}

              {pkg.videoPreview ? (
                <div className="relative shadow  bg-white">
                  <video controls className="w-full h-full rounded-md">
                    <source
                      src={
                        typeof pkg.videoPreview === "string"
                          ? pkg.videoPreview
                          : URL.createObjectURL(pkg.videoPreview as File)
                      }
                      type="video/mp4"
                    />
                  </video>
                  <button
                    onClick={() => {
                      handleChange(index, "videoPreview", "");
                    }}
                    className="absolute cursor-pointer -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="font-medium text-sm mb-2">Video Preview</h2>

                  <Dropzone
                    onDrop={(files) => {
                      handleVideoChange(index, "videoPreview", files[0]);
                    }}
                    accept={{ "video/*": [] }}
                    multiple={false}
                    label="Drag & drop a video or click to select"
                  />
                </div>
              )}
            </div>
            {/* Multiple Image Upload (Thumbnails) */}
            <ThumbnailSlider
              pkg={pkg}
              index={index}
              addThumbnail={addThumbnail}
              removeThumbnail={removeThumbnail}
            />
          </Card>

          <Card className="px-6 py-10 grid-cols-1 grid">
            <div className="space-y-2 border p-4 rounded-lg">
              <h2 className="text-lg font-semibold">Delivery Types</h2>
              {pkg.deliveriesType.map((delivery, dIndex) => (
                <div
                  key={dIndex}
                  className="grid relative grid-cols-2 gap-5 my-5 border py-4 pl-4 pr-28 rounded-lg"
                >
                  <Input
                    placeholder="Delivery Title"
                    value={delivery.title}
                    onChange={(e) => {
                      const updatedPackages = [...packages];
                      updatedPackages[index].deliveriesType[dIndex].title =
                        e.target.value;
                      setPackages(updatedPackages);
                    }}
                    className="h-full w-full"
                  />

                  {delivery.icon ? (
                    <div className="shadow relative bg-white min-h-[80px] max-w-[80px] min-w-[80px] max-h-[100px] border rounded-lg ">
                      <Image
                        src={delivery.icon}
                        alt="Preview"
                        width={200}
                        height={200}
                        unoptimized
                        className="rounded-md object-cover"
                      />
                      <button
                        onClick={() => {
                          const updatedPackages = [...packages];
                          updatedPackages[index].deliveriesType[dIndex].icon =
                            "";
                          setPackages(updatedPackages);
                        }}
                        className="absolute cursor-pointer -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
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
                  <Button
                    onClick={() => deleteDeliveryType(index, dIndex)}
                    className="bg-red-500 right-4 top-8 absolute hover:bg-red-700 self-end w-fit text-white font-bold py-2 px-4 rounded"
                  >
                    <Trash2 size={12} />
                  </Button>
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
                  <div key={aIndex} className="p-4 relative border rounded-lg">
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
                      className="w-fit h-fit p-4"
                    />
                    <Button
                      onClick={() => addAmenitiesList(index, aIndex)}
                      className="my-3"
                    >
                      + Add Amenities List
                    </Button>

                    <Button
                      onClick={() => deleteAmenities(index, aIndex)}
                      className="bg-red-500 absolute right-4 top-4 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      <Trash2 size={12} />
                    </Button>
                    <div className=" flex flex-col gap-4 ">
                      {amenities.amenitiesList.map((list, lIndex) => (
                        <div
                          key={lIndex}
                          className="grid border p-4 rounded-lg relative  pl-4 pr-28 grid-cols-2 gap-10"
                        >
                          <Input
                            placeholder="Title"
                            value={list.title}
                            onChange={(e) => {
                              const updatedPackages = [...packages];
                              updatedPackages[index].packageAmenities[
                                aIndex
                              ].amenitiesList[lIndex].title = e.target.value;
                              setPackages(updatedPackages);
                            }}
                            className="w-full h-full"
                          />
                          {list.icon ? (
                            <div className="shadow bg-white min-h-[200px] max-w-[200px] min-w-[200px] max-h-[200px] border rounded-lg ">
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
                          <Button
                            onClick={() =>
                              deleteAmenitiesList(index, aIndex, lIndex)
                            }
                            className="bg-red-500 absolute top-7 right-7 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      ))}
                    </div>
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
