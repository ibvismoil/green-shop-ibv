import { useState, useRef } from "react";
import { Carousel } from "antd";
import type { CarouselRef } from "antd/es/carousel";

interface Slide {
    id: number;
    text: string;
    title: string;
    description: string;
    img: string;
}

const HeroCarousel = () => {
    const slides: Slide[] = [
        {
            id: 1,
            text: "Welcome to GreenShop",
            title: "LET'S MAKE A BETTER PLANET",
            description:
                "We are an online plant shop offering a wide range of cheap and trendy plants. Use our plants to create an unique Urban Jungle. Order your favorite plants!",
            img: "https://firebasestorage.googleapis.com/v0/b/aema-image-upload.appspot.com/o/greenshop%2Fimages%2Fflower1.png?alt=media&token=0b53d608-7264-4c54-b497-a9bf054fcd9d",
        },
        {
            id: 2,
            text: "Welcome to GreenShop",
            title: "LET'S LIVE IN A BETTER PLANET",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni eos aut vitae, exercitationem voluptatum porro veniam animi sit voluptatibus, asperiores esse suscipit accusamus ipsum iusto odio fugiat placeat consequuntur alias?",
            img: "https://firebasestorage.googleapis.com/v0/b/aema-image-upload.appspot.com/o/greenshop%2Fimages%2Fhero-flower-1.png?alt=media&token=74ea8d3d-06b5-41e7-bb12-7caaf3035a6d",
        },
        {
            id: 3,
            text: "Welcome to GreenShop",
            title: "LET'S OBSERVE A BETTER PLANET",
            description:
                "Nmadur Nmadur Lalala Balo battar auo io maooo gul! Atirgul lolagul kokgul qoragul jigarrang gul naushnik telefon microsoft chelavek pauk ",
            img: "https://firebasestorage.googleapis.com/v0/b/aema-image-upload.appspot.com/o/greenshop%2Fimages%2Fhero-flower-2.png?alt=media&token=5b5addec-d344-4897-a983-95c9b10a1662",
        },
    ];

    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const carouselRef = useRef<CarouselRef | null>(null);

    return (
<div className="max-w-[1240px] m-auto px-4 mt-5 relative">
  <Carousel
    ref={carouselRef}
    autoplay
    autoplaySpeed={3500}
    dots={false}
    beforeChange={(_, to: number) => setCurrentSlide(to)}
  >
    {slides.map((slide, index) => (
      <div
        key={index}
        className="flex flex-col-reverse lg:flex-row items-center justify-center bg-[#F5F5F5] rounded-xl px-6 py-8 lg:pl-10 h-auto lg:h-[400px]"
      >
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-0 h-full">
          <div className="flex-1 flex flex-col justify-center text-center lg:text-left">
            <h3 className="uppercase text-sm md:text-lg font-medium text-[#3D3D3D]">
              {slide.text}
            </h3>
            <h2 className="font-black text-[#3D3D3D] text-3xl md:text-5xl lg:text-8xl leading-tight mt-2">
              {slide.title.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="text-[#46A358] uppercase">
                {slide.title.split(" ").slice(-1)}
              </span>
            </h2>
            <p className="text-xs md:text-sm font-normal text-[#727272] w-full lg:w-3/5 mt-3 mx-auto lg:mx-0">
              {slide.description}
            </p>
          </div>
          <div className="flex justify-center items-center flex-shrink-0">
            <img
              src={slide.img}
              alt={slide.text || "Carousel img"}
              className="max-w-[240px] md:max-w-[300px] lg:max-w-[390px] max-h-[300px] md:max-h-[350px] lg:max-h-[390px]"
              width={390}
              height={390}
            />
          </div>
        </div>
      </div>
    ))}
  </Carousel>

  <div className="justify-center items-center flex gap-2 absolute bottom-4 left-1/2 -translate-x-1/2">
    {slides.map((slide, index) => (
      <button
        key={slide.id}
        className={`relative cursor-pointer transition-all duration-300 bg-[#46A358] rounded-full !h-[6px] !w-[6px] ${
          currentSlide === index
            ? "!w-6"
            : "!h-6 hover:bg-[#46A358]/70 bg-[#46A358]/40"
        }`}
        onClick={() => carouselRef.current?.goTo(index)}
      />
    ))}
  </div>
</div>

    );
};

export default HeroCarousel;
