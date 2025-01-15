import React, { useState } from "react";
import {
    CarrouselContainer,
    Carrousel,
    Image,
    ArrowLeft,
    ArrowRight,
} from "../components/styled/Form.styles";

export default function Carrousel({ picture }) {
    const [carrouselIndex, setCarrouselIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState<number | null>(null);
    const [slideDirection, setSlideDirection] = useState<"left" | "right">(
        "right"
    );

    const prevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSlideDirection("left");
        setPrevIndex(carrouselIndex);
        setCarrouselIndex((prevIndex) =>
            prevIndex === 0 ? picture.length - 1 : prevIndex - 1
        );
    };

    const nextSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSlideDirection("right");
        setPrevIndex(carrouselIndex);
        setCarrouselIndex((prevIndex) =>
            prevIndex === picture.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <>
            <CarrouselContainer>
                <Carrousel>
                    {picture.map((preview, index) => {
                        const isVisible = index === carrouselIndex;
                        const isExiting = index === prevIndex;

                        return (
                            <Image
                                key={index}
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                isVisible={isVisible}
                                isExiting={isExiting}
                                slideDirection={slideDirection}
                            />
                        );
                    })}
                </Carrousel>
            </CarrouselContainer>
            {picture.length > 1 && (
                <>
                    <ArrowLeft
                        onClick={prevSlide}
                        role="button"
                        aria-label="Previous slide"
                    >
                        <SquareChevronLeft />
                    </ArrowLeft>
                    <ArrowRight
                        onClick={nextSlide}
                        role="button"
                        aria-label="Next slide"
                    >
                        <SquareChevronRight />
                    </ArrowRight>
                </>
            )}
        </>
    );
}
