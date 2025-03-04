import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import Dropzone from "./dropzone";
import { NavigationOptions } from "swiper/types";

type PackageType = {
  packageThumbnails: string[];
};

type ThumbnailSliderProps = {
  pkg: PackageType;
  index: number;
  addThumbnail: (index: number, files: File[]) => void;
  removeThumbnail: (packageIndex: number, thumbnailIndex: number) => void;
};

const ThumbnailSlider: React.FC<ThumbnailSliderProps> = ({
  pkg,
  index,
  addThumbnail,
  removeThumbnail,
}) => {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="relative w-full flex flex-col items-center"> {/* Center everything */}
      {pkg.packageThumbnails.length > 0 ? (
        <div className="relative w-[300px]"> {/* Restrict width to center the image */}
          <Swiper
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView={1} // Show only one image at a time
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              if (prevRef.current && nextRef.current) {
                if (swiper.params.navigation) {
                  (swiper.params.navigation as NavigationOptions).prevEl =
                    prevRef.current;
                  (swiper.params.navigation as NavigationOptions).nextEl =
                    nextRef.current;
                  swiper.navigation.init();
                  swiper.navigation.update();
                }
              }
            }}
            className="w-full relative"
          >
            {pkg.packageThumbnails.map((thumb, tIndex) => (
              <SwiperSlide key={tIndex} className="flex justify-center">
                <div className="relative bg-white shadow border rounded-lg w-[250px] h-[250px]">
                  <Image
                    src={thumb}
                    alt="Thumbnail"
                    width={250}
                    height={250}
                    unoptimized
                    className="rounded-md object-cover w-full h-full"
                  />
                  {/* Delete Button */}
                  <button
                    onClick={() => removeThumbnail(index, tIndex)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center transition hover:bg-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                  {/* Upload New Thumbnail */}
                  <div className="absolute top-2 left-2 bg-gray-400 rounded-md cursor-pointer">
                    <Dropzone
                      onDrop={(files) => addThumbnail(index, files)}
                      accept={{ "image/*": [] }}
                      multiple
                      label="+"
                      isPadding={false}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons (INSIDE SWIPER CONTAINER) */}
          <button
            ref={prevRef}
            className="absolute left-[-40px] top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center z-10"
          >
            ◀
          </button>
          <button
            ref={nextRef}
            className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center z-10"
          >
            ▶
          </button>
        </div>
      ) : (
        <div>
          <h2 className="font-medium text-sm mb-2">Package Thumbnails</h2>
          <Dropzone
            onDrop={(files) => addThumbnail(index, files)}
            accept={{ "image/*": [] }}
            multiple={false}
            label="Drag & drop a thumbnail or click to select"
          />
        </div>
      )}
    </div>
  );
};


export default ThumbnailSlider;
